"use server"

import { groq } from "@/lib/ai/groq-client"
import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/server-auth"

export async function generateRoadmap() {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    // Fetch user profile to inform the roadmap
    const profile = await prisma.profile.findUnique({
        where: { userId: user.id }
    })

    if (!profile) throw new Error("Profile not found")

    const systemPrompt = `
    You are an expert Career Architect.
    Based on the user's profile, generate a comprehensive strategic roadmap AND immediate tactical tasks.
    
    User Profile:
    - Current Role: ${profile.currentRole}
    - Target Role: ${profile.targetRole}
    - Experience Level: ${profile.experienceLevel}
    - Skills: ${profile.skills.join(", ")}
    ${profile.resumeText ? `- Context from Resume: ${profile.resumeText.substring(0, 3000)}` : ""}

    **Output Format (JSON ONLY)**:
    {
        "title": "String (e.g., 'Senior Frontend Engineer Roadmap')",
        "description": "String (Brief strategic overview)",
        "milestones": [
            {
                "title": "String (e.g., 'Master React Patterns')",
                "description": "String (Detailed objective)",
                "status": "PENDING"
            },
            ... (Generate 4-6 high-impact milestones)
        ],
        "initial_tasks": [
            {
                "title": "String (Actionable short-term task)",
                "description": "String (Brief context)",
                "difficulty": "Easy" | "Medium" | "Hard",
                "estimatedMinutes": Number,
                "metadata": {
                    "instructions": "String (Step-by-step 'How to do')",
                    "resources": "String (Links or 'Where to do')",
                    "outcome": "String ('What you should be able to do')"
                }
            },
            ... (Generate 3 specific starter tasks for the first milestone)
        ]
    }
    `

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Generate my roadmap and starter tasks." }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.4,
            response_format: { type: "json_object" }
        })

        const content = completion.choices[0].message.content || "{}"
        let text = content.replace(/```json\n?|\n?```/g, "").trim() // Sanitize

        // Attempt aggressive cleanup if Llama output conversational text before the JSON
        const firstBrace = text.indexOf('{')
        const lastBrace = text.lastIndexOf('}')
        if (firstBrace !== -1 && lastBrace !== -1) {
            text = text.substring(firstBrace, lastBrace + 1)
        }

        let roadmapData;
        try {
            roadmapData = JSON.parse(text)
        } catch (parseError) {
            console.error("AI returned malformed JSON, using fallback roadmap framework.", parseError)
            roadmapData = {
                title: `${profile.targetRole || 'Career'} Blueprint`,
                description: "A structured, foundational roadmap for your immediate growth.",
                milestones: [
                    { title: "Establish System Foundations", description: "Review and organize your primary skillsets.", status: "PENDING" },
                    { title: "Core Competency Deep-Dive", description: "Focus intensely on missing fundamental knowledge.", status: "PENDING" },
                    { title: "Action & Execution", description: "Apply knowledge to real-world scenarios or projects.", status: "PENDING" }
                ],
                initial_tasks: [
                    {
                        title: "Audit Current Skills",
                        description: "List out your current skills and grade yourself 1-10.",
                        difficulty: "Easy",
                        estimatedMinutes: 20,
                        metadata: { instructions: "Open a doc and list your top 5 hard skills.", resources: "None required.", outcome: "Self-awareness baseline" }
                    },
                    {
                        title: "Identify 3 Major Gaps",
                        description: "Find the missing links between your role and your target role.",
                        difficulty: "Medium",
                        estimatedMinutes: 30,
                        metadata: { instructions: "Look at job descriptions for your target role.", resources: "LinkedIn Jobs.", outcome: "Targeted learning list" }
                    }
                ]
            }
        }

        // Atomically replace roadmap and tasks
        await prisma.$transaction(async (tx) => {
            // 1. DELETE existing roadmap to ensure fresh start
            await tx.roadmap.deleteMany({
                where: { userId: user.id }
            })

            // 2. DELETE existing tasks (clear TODOs to avoid duplicates if re-generating)
            await tx.task.deleteMany({
                where: { userId: user.id, status: 'TODO' }
            })

            // 3. Create new roadmap
            await tx.roadmap.create({
                data: {
                    userId: user.id,
                    title: roadmapData.title,
                    description: roadmapData.description,
                    milestones: {
                        create: roadmapData.milestones.map((m: any, index: number) => ({
                            title: m.title,
                            description: m.description,
                            order: index + 1,
                            status: "PENDING"
                        }))
                    }
                }
            })

            // 4. Create initial tasks
            if (roadmapData.initial_tasks && Array.isArray(roadmapData.initial_tasks)) {
                await tx.task.createMany({
                    data: roadmapData.initial_tasks.map((t: any) => ({
                        userId: user.id,
                        title: t.title,
                        description: t.description || "",
                        difficulty: t.difficulty || "Medium",
                        estimatedMinutes: t.estimatedMinutes || 30,
                        metadata: t.metadata || {}, // Save the structured details
                        status: "TODO"
                    }))
                })
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Roadmap Generation Error:", error)
        return { success: false, error: "Failed to generate roadmap" }
    }
}
