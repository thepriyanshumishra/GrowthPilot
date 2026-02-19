"use server"

import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/server-auth"
import { revalidatePath } from "next/cache"

export async function completeTaskAction(taskId: string) {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    // Find the task
    const task = await prisma.task.findUnique({
        where: { id: taskId, userId: user.id }
    })

    if (!task) throw new Error("Task not found")
    if (task.status === "DONE") return { success: true }

    // Update task status
    await prisma.task.update({
        where: { id: taskId },
        data: { status: "DONE" }
    })

    // Update Profile Stats (XP & Streaks)
    const profile = await prisma.profile.findUnique({
        where: { userId: user.id }
    })

    if (profile) {
        const now = new Date()
        const lastDate = profile.lastTaskDate ? new Date(profile.lastTaskDate) : null

        let newStreak = profile.streak
        const isToday = lastDate && lastDate.toDateString() === now.toDateString()
        const isYesterday = lastDate && new Date(now.getTime() - 86400000).toDateString() === lastDate.toDateString()

        if (!isToday) {
            if (isYesterday) {
                newStreak += 1
            } else {
                newStreak = 1 // Reset or start new streak
            }
        }

        await prisma.profile.update({
            where: { userId: user.id },
            data: {
                xp: { increment: 50 },
                streak: newStreak,
                lastTaskDate: now
            }
        })
    }

    revalidatePath("/dashboard")
    return { success: true }
}
