"use server"

import { groq } from "@/lib/ai/groq-client"
import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/server-auth"

interface RoadmapUpdate {
    type: 'ADD_TASK' | 'UPDATE_MILESTONE';
    title: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    status?: string;
}

interface MemoryData {
    type: string;
    content: string;
    category?: string;
}

export async function clearChatHistory() {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    await prisma.chatMessage.deleteMany({
        where: { userId: user.id }
    })
    return { success: true }
}

export async function getCoachResponse(messages: { role: "user" | "assistant", content: string }[]) {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    // Simple Rate Limiting: Check last message timestamp
    const lastMsg = await prisma.chatMessage.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    })

    if (lastMsg && (Date.now() - new Date(lastMsg.createdAt).getTime()) < 3000) {
        throw new Error("Slow down! You're sending messages too fast.")
    }

    // Save the latest user message to DB
    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage && lastUserMessage.role === "user") {
        await prisma.chatMessage.create({
            data: {
                userId: user.id,
                role: "user",
                content: lastUserMessage.content,
            }
        })
    }

    // Context Window: Use only last 15 messages for the AI to save tokens and focus context
    const recentMessages = messages.slice(-15)

    // Fetch Profile, Roadmap, and MEMORIES for context
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
    const activeRoadmap = await prisma.roadmap.findFirst({
        where: { userId: user.id },
        include: { milestones: true }
    })

    // Memory Palace: Get last 15 memories
    const memories = await prisma.memory.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 15
    })

    const memoryContext = memories.length > 0
        ? memories.map((m: any) => `[${m.type}] ${m.content} (Context: ${m.category || 'General'})`).join('\n')
        : "No previous technical blockers or insights recorded yet."

    const systemPrompt = `
    You are the "GrowthPilot AI Career Coach". Your goal is to help the user grow in their career.
    
    User Context:
    - Current Role: ${profile?.currentRole || "Unknown"}
    - Target Role: ${profile?.targetRole || "Unknown"}
    - Skills: ${profile?.skills.join(", ") || "None listed"}
    - Active Roadmap: ${activeRoadmap?.title || "None yet"}
    
    [MEMORY PALACE] - Your long-term memory of the user:
    ${memoryContext}
    
    SPECIAL FEATURE: Action Proposal
    Wrap the JSON action in triple backticks with a tag [ACTION]. (Types: 'ADD_TASK', 'COMPLETE_MILESTONE')
    For ADD_TASK, include a "metadata" object with "instructions", "resources", and "outcome".
    
    SPECIAL FEATURE: Mock Interview Mode
    If the user wants to practice or do a mock interview:
    1. Ask ONE highly relevant technical or behavioral question.
    2. Wait for their response.
    3. Evaluate their answer with a "Tactical Rating (1-10)" and provide feedback.
    4. Continue to the next question or give an overall summary.
    
    SPECIAL FEATURE: Resume Roast
    If the user provides resume text or asks for a roast:
    1. Be brutally honest but constructive (in a "GrowthPilot" military/high-performance tone).
    2. Identify "Soft Targets" (weak points) and "Hard Points" (strengths).
    3. Suggest exactly which Roadmap Quests will fix their resume gaps.

    MEMORY EXTRACTION:
    If you discover something NEW and IMPORTANT about the user (preference, style, specific goal, blocker), output:
    \`\`\`[MEMORY]
    { "type": "BLOCKER | INSIGHT | ACHIEVEMENT | PREFERENCE", "content": "Compressed summary...", "category": "Topic", "relevance": 5 }
    \`\`\`
    
    Instructions:
    1. Reference the MEMORY PALACE often to show continuity.
    2. Be motivational, concise, and professional.
    3. Do NOT ask for approval for every little thing. Assume competence.
  `

    const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            ...recentMessages
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
    })

    let responseContent = completion.choices[0].message.content || "I'm having trouble thinking right now."

    // Memory Extraction Logic (Auto-save for important bits during chat)
    const memoryMatch = responseContent.match(/```\[MEMORY\]\n([\s\S]*?)\n```/)
    if (memoryMatch && memoryMatch[1]) {
        try {
            const memData = JSON.parse(memoryMatch[1])
            await prisma.memory.create({
                data: {
                    userId: user.id,
                    type: memData.type,
                    content: memData.content,
                    category: memData.category,
                    relevance: memData.relevance || 5
                }
            })
            // Clean the response content for display
            responseContent = responseContent.replace(/```\[MEMORY\][\s\S]*?```/g, "").trim()
        } catch (e) {
            console.error("Memory parsing error:", e)
        }
    }

    // Check if the response contains an action
    const hasAction = responseContent.includes("```[ACTION]")

    // Save assistant response to DB
    await prisma.chatMessage.create({
        data: {
            userId: user.id,
            role: "assistant",
            content: responseContent,
        }
    })

    return { content: responseContent, isAction: hasAction }
}

export async function approveAction(actionJson: string) {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    console.log("Approving Action JSON:", actionJson)

    try {
        // Sanitize: sometimes LLM adds trailing commas or comments which JSON.parse hates.
        // We can try a simple parse first.
        const action = JSON.parse(actionJson)

        if (action.type === "ADD_TASK") {
            // Validate data
            if (!action.data || !action.data.title) {
                console.error("Invalid ADD_TASK data:", action.data)
                throw new Error("Missing task title")
            }

            await prisma.task.create({
                data: {
                    userId: user.id,
                    title: action.data.title,
                    description: action.data.description || action.data.data?.description || "",
                    difficulty: action.data.difficulty || "Medium",
                    estimatedMinutes: typeof action.data.estimatedMinutes === 'number' ? action.data.estimatedMinutes : 30,
                    metadata: action.data.metadata || {},
                    status: "TODO"
                }
            })
            return { success: true, message: "Task added to dashboard!" }
        } else if (action.type === "COMPLETE_MILESTONE") {
            // Handle milestone completion if title/id matches
            // For now, we'll search by title roughly or just log it
            const milestoneTitle = action.data.title
            if (milestoneTitle) {
                // Fuzzy match or exact match
                const milestone = await prisma.milestone.findFirst({
                    where: {
                        roadmap: { userId: user.id },
                        title: { contains: milestoneTitle, mode: 'insensitive' },
                        status: { not: 'COMPLETED' }
                    }
                })

                if (milestone) {
                    await prisma.milestone.update({
                        where: { id: milestone.id },
                        data: { status: 'COMPLETED' }
                    })
                    return { success: true, message: `Milestone completed: ${milestone.title}` }
                } else {
                    return { success: false, message: "Could not find matching active milestone." }
                }
            }
            return { success: false, message: "Milestone title missing." }
        }

        return { success: false, message: `Unknown action type: ${action.type}` }

    } catch (error) {
        console.error("Action Approval Error:", error)
        throw new Error("Failed to process action.")
    }
}

export async function getChatHistory() {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    const history = await prisma.chatMessage.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
        take: 50
    })

    return history.map((h: any) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
        isAction: h.content.includes("```[ACTION]")
    }))
}

// --- NEW CONCLUSION ACTIONS ---

export async function concludeSession() {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    // Get recent history
    const history = await prisma.chatMessage.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' }, // Oldest first to understand flow
        take: 20
    })

    if (history.length === 0) return null

    const conversationText = history.map((msg: any) => `${msg.role}: ${msg.content}`).join("\n")

    const systemPrompt = `
    You are analyzing a coaching session to conclude it.
    Analyze the following conversation history and extract:
    1. **Critique**: A brief, constructive critique of the user's inputs/progress in this session.
    2. **Roadmap Updates**: Identify specific tasks or milestones that should be added/updated based on this session.
    3. **Start/End Memories**: Identify key facts to remember.

    Output PURE JSON format:
    {
        "critique": "string",
        "roadmapUpdates": [
            { "type": "ADD_TASK", "title": "string", "difficulty": "Easy|Medium|Hard" },
            { "type": "UPDATE_MILESTONE", "title": "string", "status": "COMPLETED" }
        ],
        "memories": [
            { "type": "INSIGHT", "content": "string", "category": "string" }
        ]
    }
    `

    const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: conversationText }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        response_format: { type: "json_object" }
    })

    const response = completion.choices[0].message.content
    if (!response) return null

    try {
        const jsonStr = response.replace(/```json\n?|\n?```/g, "").trim()
        return JSON.parse(jsonStr)
    } catch (e) {
        console.error("Failed to parse conclusion JSON:", e)
        return null
    }
}

export async function saveMemoriesAndReset(data: { roadmapUpdates: RoadmapUpdate[], memories: MemoryData[] }) {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    // 1. Save Memories
    if (data.memories && data.memories.length > 0) {
        await prisma.memory.createMany({
            data: data.memories.map((m) => ({
                userId: user.id,
                type: m.type || "INSIGHT",
                content: m.content,
                category: m.category || "General",
                relevance: 5
            }))
        })
    }

    // 2. Apply Roadmap Updates
    if (data.roadmapUpdates && data.roadmapUpdates.length > 0) {
        const tasks = data.roadmapUpdates.filter((u) => u.type === 'ADD_TASK')
        if (tasks.length > 0) {
            await prisma.task.createMany({
                data: tasks.map((t) => ({
                    userId: user.id,
                    title: t.title,
                    description: "Added from session conclusion",
                    difficulty: t.difficulty || "Medium",
                    status: "TODO"
                }))
            })
        }
    }

    // 3. Clear Chat
    await prisma.chatMessage.deleteMany({
        where: { userId: user.id }
    })

    return { success: true }
}

export async function getChatSidebarData() {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    const profile = await prisma.profile.findUnique({
        where: { userId: user.id }
    })

    const roadmap = await prisma.roadmap.findFirst({
        where: { userId: user.id },
        include: { milestones: { orderBy: { order: 'asc' } } }
    })

    const memories = await prisma.memory.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
    })

    return { profile, roadmap, memories }
}
