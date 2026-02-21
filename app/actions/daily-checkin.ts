"use server"

import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/server-auth"

export async function getPendingPastTasks() {
    const user = await getServerUser()
    if (!user) return []

    const yesterday = new Date()
    yesterday.setHours(0, 0, 0, 0)

    const tasks = await prisma.task.findMany({
        where: {
            userId: user.id,
            status: "TODO",
            createdAt: {
                lt: yesterday // Created before today
            }
        },
        orderBy: { createdAt: "desc" }
    })

    return tasks
}

export async function updateTaskStatus(taskId: string, status: "DONE" | "TODO") {
    const user = await getServerUser()
    if (!user) return { success: false }

    await prisma.task.update({
        where: { id: taskId, userId: user.id },
        data: { status }
    })

    // Reward XP
    if (status === "DONE") {
        await prisma.profile.update({
            where: { userId: user.id },
            data: { xp: { increment: 50 } }
        })
    }

    return { success: true }
}

export async function rescheduleTasksStart() {
    const user = await getServerUser()
    if (!user) return { success: false }

    const yesterday = new Date()
    yesterday.setHours(0, 0, 0, 0)

    // Bump the createdAt timestamp of all older TODO tasks to now so they sort to today
    await prisma.task.updateMany({
        where: {
            userId: user.id,
            status: "TODO",
            createdAt: { lt: yesterday }
        },
        data: { createdAt: new Date() }
    })

    return { success: true }
}
