"use server"

import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/server-auth"

export async function addFocusTime(minutes: number) {
    if (minutes <= 0) return { success: false }

    const user = await getServerUser()
    if (!user) return { success: false }

    await prisma.profile.update({
        where: { userId: user.id },
        data: { focusTimeTotal: { increment: minutes } }
    })

    return { success: true }
}
