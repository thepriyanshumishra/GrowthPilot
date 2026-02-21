"use server"

import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/server-auth"

export async function getSquads() {
    return await prisma.squad.findMany({
        orderBy: { totalXp: 'desc' },
        include: { _count: { select: { members: true } } }
    })
}

export async function getUserSquad() {
    const user = await getServerUser()
    if (!user) return null

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
            squad: {
                include: {
                    members: {
                        select: { name: true, username: true, id: true, profile: { select: { xp: true } } },
                        orderBy: { profile: { xp: 'desc' } }
                    }
                }
            }
        }
    })

    return dbUser?.squad || null
}

export async function createSquad(name: string, description: string) {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    // Check if name exists
    const existing = await prisma.squad.findUnique({ where: { name } })
    if (existing) return { success: false, error: "Squad name already taken." }

    // Create squad and add user to it
    await prisma.squad.create({
        data: {
            name,
            description,
            members: {
                connect: { id: user.id }
            }
        }
    })

    return { success: true }
}

export async function joinSquad(squadId: string) {
    const user = await getServerUser()
    if (!user) throw new Error("Unauthorized")

    await prisma.user.update({
        where: { id: user.id },
        data: { squadId }
    })
    return { success: true }
}
