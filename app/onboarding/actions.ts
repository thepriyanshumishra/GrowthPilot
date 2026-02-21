"use server"

import { groq } from "@/lib/ai/groq-client"
import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/server-auth"
import { revalidatePath } from "next/cache"
import { generateRoadmap } from "./roadmap-action"
// @ts-expect-error - pdf-parse has no default export in some environments
import pdf from "pdf-parse"

// ... existing code ...

export async function saveProfile(profileData: any) {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    try {
        await prisma.profile.upsert({
            where: { userId: user.id },
            update: {
                currentRole: profileData.currentRole,
                targetRole: profileData.targetRole,
                experienceLevel: profileData.experienceLevel,
                skills: profileData.skills || [],
            },
            create: {
                userId: user.id,
                currentRole: profileData.currentRole || "Explorer",
                targetRole: profileData.targetRole || "Growth",
                experienceLevel: profileData.experienceLevel || "Beginner",
                skills: profileData.skills || [],
            }
        })

        if (profileData.name) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: profileData.name,
                    isOnboarded: true
                }
            })
        } else {
            await prisma.user.update({
                where: { id: user.id },
                data: { isOnboarded: true }
            })
        }

        // Generate fresh roadmap
        await generateRoadmap()

        revalidatePath("/dashboard")
        revalidatePath("/squad") // Just in case

        return { success: true }
    } catch (error) {
        console.error("Save Profile Error:", error)
        return { success: false }
    }
}

export async function uploadResume(formData: FormData) {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    const file = formData.get("file") as File
    if (!file) return { success: false, error: "No file provided" }

    // Security: Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
        return { success: false, error: "File too large. Maximum size is 5MB." }
    }

    // Security: Validate MIME type
    if (file.type !== "application/pdf") {
        return { success: false, error: "Invalid file type. Only PDF is supported." }
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const data = await pdf(buffer)
        const text = data.text

        if (!text || text.trim().length === 0) {
            return { success: false, error: "No text could be extracted from this PDF. Please try a different format or manual entry." }
        }

        await prisma.profile.upsert({
            where: { userId: user.id },
            update: { resumeText: text },
            create: {
                userId: user.id,
                resumeText: text,
                currentRole: "Explorer",
                targetRole: "Growth",
                experienceLevel: "Beginner",
                skills: []
            }
        })

        return { success: true, text: text.substring(0, 500) } // Return snippet for UI confirmation
    } catch (error) {
        console.error("PDF Parsing Error:", error)
        return { success: false, error: "Failed to parse PDF" }
    }
}

export async function resetUserOnboarding() {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    try {
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { isOnboarded: false }
            }),
            prisma.roadmap.deleteMany({
                where: { userId: user.id }
            })
        ])

        revalidatePath("/dashboard")
        revalidatePath("/onboarding")

        return { success: true }
    } catch (error) {
        console.error("Reset Onboarding Error:", error)
        return { success: false }
    }
}

export async function startOnboarding() {
    const user = await getServerUser()

    if (user?.name) {
        return {
            question: `Welcome back, ${user.name.split(' ')[0]}! To help me design a more precise path, would you like to upload your resume?`,
            type: "file",
            options: [],
            field: "resume"
        }
    }

    return {
        question: "Hi there! I'm GrowthPilot. Before we blast off, I'd love to know who I'm flying with. What should I call you?",
        type: "text",
        options: [],
        field: "name"
    }
}

export async function processAnswer(history: { role: "user" | "assistant", content: string }[]) {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    const profile = await prisma.profile.findUnique({
        where: { userId: user.id },
        select: { resumeText: true }
    })

    console.log("Onboarding Inbound History:", JSON.stringify(history))

    // Analysis: Check what information we ALREADY have to help the AI
    const profileState = {
        name: history.find(m => m.role === "assistant" && m.content.includes("call you")) ?
            history.slice(history.findIndex(m => m.role === "assistant" && m.content.includes("call you")) + 1).find(m => m.role === "user")?.content : (user.name || null),
        status: history.find(m => m.role === "assistant" && m.content.includes("status/role")) ?
            history.slice(history.findIndex(m => m.role === "assistant" && m.content.includes("status/role")) + 1).find(m => m.role === "user")?.content : null,
    }

    const systemPrompt = `
    You are the "GrowthPilot Onboarding AI". Your mission is to interview the user and build their profile.
    
    ${profile?.resumeText ? `IMPORTANT: The user has uploaded a resume. PRE-FILL as much as possible from this text, but still ask clarifying questions if details are ambiguous or missing.
    RESUME TEXT SNIPPET: ${profile.resumeText.substring(0, 2000)}` : ""}

    STRICT CHECKLIST (Capture in this order):
    1. Name (Currently: ${profileState.name || 'MISSING'})
    2. Current Status/Role (Currently: ${profileState.status || 'MISSING'})
    3. Experience Level (Beginner, Intermediate, Senior)
    4. Target Goal/Role (What they want to achieve)
    5. Primary Skills (Multiselect list)
    6. Main Challenge (What's stopping them?)

    UX INSTRUCTIONS:
    - ALWAYS provide 4-6 smart "options" for EVERY field except "name". 
    - **TYPE DECISION**: You decide if the user should pick ONE ("select") or MANY ("multiselect").
      - Use "multiselect" for fields like **skills** or **mainChallenge** where multiple factors usually apply.
      - Use "select" for fields like **experienceLevel** or **currentRole** where a single choice is more common.
    - **DYNAMISM**: Generate options that are RELEVANT to the user. (e.g. If They want to be an AI Engineer, the "mainChallenge" options should be things like "Mathematics for AI", "GPUs are expensive", "Finding AI projects").
    - **MANDATORY**: Always include "Other" as the last option for ANY field with options.
    - Be concise and encouraging.

    EXAMPLE OPTIONS TO INSPIRE YOU:
    - targetRole: ["Senior Frontend Dev", "AI/ML Engineer", "Fullstack Architect", "Product Manager", "Engineering Lead", "Other"]
    - mainChallenge: ["Lack of a clear roadmap", "Struggling to find time", "Complexity of advanced topics", "Imposter syndrome", "Gaps in my technical foundation", "Other"]
    - currentRole: ["Student", "Working Professional", "Freelancer", "Job Seeker", "Entrepreneur", "Other"]
    - experienceLevel: ["Beginner (0-1 yrs)", "Junior (1-3 yrs)", "Mid-Level (3-5 yrs)", "Senior (5+ yrs)", "Other"]
    - skills: ["React/Next.js", "Python/AI", "UI/UX Design", "Product Management", "Backend Dev", "Marketing", "Data Science", "Other"]
    
    RULES:
    - ONLY ask for ONE missing item from the checklist.
    - If the user says "nothing", "none", or gives a vague answer, ACCEPT IT, mark that field as "Unknown/None", and move to the NEXT item.
    - NEVER ask the same question twice in a row.
    - Always provide recommendations (options) to make it easier for the user to answer.
    
    RESPONSE FORMAT (JSON ONLY):
    {
        "next_question": "string",
        "type": "text" | "select" | "multiselect",
        "options": ["option1", "option2"],
        "field": "name" | "currentRole" | "experienceLevel" | "targetRole" | "skills" | "mainChallenge",
        "is_complete": false,
        "collected_profile": {
            "name": "string",
            "currentRole": "string",
            "experienceLevel": "string",
            "targetRole": "string",
            "skills": ["string"],
            "mainGoal": "string"
        }
    }
    `

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...history
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0,
            response_format: { type: "json_object" }
        })

        const content = completion.choices[0].message.content || "{}"
        const res = JSON.parse(content)

        // Safety normalization
        res.options = res.options || []
        res.is_complete = !!res.is_complete
        res.collected_profile = res.collected_profile || {}

        // MANDATORY: Force "Other" for selection types if AI forgets
        if ((res.type === "select" || res.type === "multiselect") && !res.options.includes("Other")) {
            res.options.push("Other")
        }

        // ROOT FIX: Manual safety check for repetition (Text or Field)
        const lastAssistantMsg = [...history].reverse().find(m => m.role === "assistant")?.content

        // We look at the history to see if we've already asked about this field
        const questionCount = history.filter(m => m.role === "assistant").length;
        const isRepeatingContent = res.next_question === lastAssistantMsg;

        if (isRepeatingContent && !res.is_complete && questionCount > 2) {
            console.log("Safety Trigger: AI stuck. Forcing forward progress.");
            const fallbackCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt + "\n\nCRITICAL: You are stuck. If the user doesn't have an answer or says 'nothing', ACCEPT IT. Move to the next field (Main Challenge) immediately." },
                    ...history
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0,
                response_format: { type: "json_object" }
            });
            return JSON.parse(fallbackCompletion.choices[0].message.content || "{}");
        }

        return res
    } catch (error) {
        console.error("AI Onboarding Error:", error)
        return {
            next_question: "Let's move to your career. What is your current role or status?",
            type: "text",
            field: "currentRole",
            is_complete: false,
            collected_profile: {}
        }
    }
}
