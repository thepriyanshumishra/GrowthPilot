"use server"

import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/server-auth"
import { revalidatePath } from "next/cache"

export async function updateProfile(data: {
    name?: string
    username?: string
    bio?: string
    dailyBriefing?: boolean
    milestoneAlerts?: boolean
    emailUpdates?: boolean
}) {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    try {
        // Update User table
        if (data.name !== undefined || data.username !== undefined) {
            // Check username uniqueness if provided
            if (data.username && data.username !== user.username) {
                const existing = await prisma.user.findUnique({
                    where: { username: data.username }
                })
                if (existing) {
                    return { success: false, error: "Username already taken." }
                }
            }

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: data.name,
                    username: data.username
                }
            })
        }

        // Update Profile (Upsert to be safe)
        await prisma.profile.upsert({
            where: { userId: user.id },
            update: {
                bio: data.bio,
                dailyBriefing: data.dailyBriefing,
                milestoneAlerts: data.milestoneAlerts,
                emailUpdates: data.emailUpdates
            },
            create: {
                userId: user.id,
                bio: data.bio,
                dailyBriefing: data.dailyBriefing ?? true,
                milestoneAlerts: data.milestoneAlerts ?? true,
                emailUpdates: data.emailUpdates ?? false
            }
        })

        revalidatePath("/settings")
        revalidatePath(`/pilot/${data.username || user.username}`)

        return { success: true }
    } catch (error) {
        console.error("Settings Update Error:", error)
        return { success: false, error: "Failed to update settings." }
    }
}

export async function getProfileData() {
    const user = await getServerUser()
    if (!user) return null

    const profile = await prisma.profile.findUnique({
        where: { userId: user.id }
    })

    return {
        name: user.name,
        username: user.username,
        email: user.email,
        bio: profile?.bio || "",
        dailyBriefing: profile?.dailyBriefing ?? true,
        milestoneAlerts: profile?.milestoneAlerts ?? true,
        emailUpdates: profile?.emailUpdates ?? false
    }
}
