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
        const text = content.replace(/```json\n?|\n?```/g, "").trim() // Sanitize
        const roadmapData = JSON.parse(text)

        // DELETE existing roadmap to ensure fresh start
        await prisma.roadmap.deleteMany({
            where: { userId: user.id }
        })

        // DELETE existing tasks (optional, but good for a fresh start/re-generation)
        await prisma.task.deleteMany({
            where: { userId: user.id, status: 'TODO' } // Keep done tasks? For now, let's clear TODOs to avoid duplicates if re-generating
        })

        // Create new roadmap
        await prisma.roadmap.create({
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

        // Create initial tasks
        if (roadmapData.initial_tasks && Array.isArray(roadmapData.initial_tasks)) {
            await prisma.task.createMany({
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

        return { success: true }
    } catch (error) {
        console.error("Roadmap Generation Error:", error)
        return { success: false, error: "Failed to generate roadmap" }
    }
}
