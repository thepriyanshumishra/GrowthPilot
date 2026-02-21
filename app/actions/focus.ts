"use server"

import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/server-auth"

export async function addFocusTime(minutes: number) {
    if (minutes <= 0) return { success: false }

    const user = await getServerUser()
    if (!user) return { success: false }

    // Security check: No single focus session should exceed 200 minutes (3.3 hours)
    if (minutes > 200) {
        console.error(`Suspicious focus time attempt: ${minutes}m by ${user.id}`)
        return { success: false, error: "Invalid focus duration" }
    }

    try {
        await prisma.profile.update({
            where: { userId: user.id },
            data: { focusTimeTotal: { increment: minutes } }
        })

        return { success: true }
    } catch (error) {
        console.error("Failed to update focus time", error)
        return { success: false }
    }
}
