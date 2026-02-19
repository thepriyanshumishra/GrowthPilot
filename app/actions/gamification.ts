"use server"

import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/server-auth"
import { revalidatePath } from "next/cache"

export async function addXP(amount: number) {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

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
