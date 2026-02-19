"use server"

import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/server-auth"

export async function getMemories() {
    try {
        const user = await getServerUser()
        if (!user) return []

        const memories = await prisma.memory.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" }
        })
        return memories
    } catch (error) {
        console.error("Failed to fetch memories:", error)
        return []
    }
}

export async function deleteMemory(memoryId: string) {
    try {
        const user = await getServerUser()
        if (!user) return { success: false }

        await prisma.memory.delete({
            where: {
                id: memoryId,
                userId: user.id // Security check
            }
        })
        return { success: true }
    } catch (error) {
        console.error("Failed to delete memory:", error)
        return { success: false }
    }
}
