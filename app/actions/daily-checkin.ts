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

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Verify and update the task
            await tx.task.update({
                where: { id: taskId, userId: user.id },
                data: { status }
            })

            // 2. Reward XP if completed
            if (status === "DONE") {
                const xpValue = 50 // Standard task reward

                await tx.profile.update({
                    where: { userId: user.id },
                    data: { xp: { increment: xpValue } }
                })

                // 3. Squad XP Sync
                const dbUser = await tx.user.findUnique({
                    where: { id: user.id },
                    select: { squadId: true }
                })

                if (dbUser?.squadId) {
                    await tx.squad.update({
                        where: { id: dbUser.squadId },
                        data: { totalXp: { increment: xpValue } }
                    })
                }
            }
        })
        return { success: true }
    } catch (error) {
        console.error("Task status update failure:", error)
        return { success: false }
    }
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
