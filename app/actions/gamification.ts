"use server"

import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/server-auth"
import { revalidatePath } from "next/cache"

export async function addXP(amount: number) {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    // Security: Guard against suspicious XP spikes
    if (amount > 500) {
        console.error(`Suspicious XP addition attempt: ${amount} by user ${user.id}`)
        return { success: false, error: "Invalid reward amount" }
    }

    try {
        const profile = await prisma.profile.update({
            where: { userId: user.id },
            data: {
                xp: { increment: amount }
            }
        })

        revalidatePath("/dashboard")
        return { success: true, xp: profile.xp }
    } catch (error) {
        console.error("Failed to add XP:", error)
        return { success: false, error: "Failed to update progress" }
    }
}
