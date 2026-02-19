"use server"

import { prisma } from "@/lib/prisma"

export async function getSquads() {
    return await prisma.squad.findMany({
        orderBy: { totalXp: 'desc' },
        include: { _count: { select: { members: true } } }
    })
}

export async function joinSquad(squadId: string, userId: string) {
    await prisma.user.update({
        where: { id: userId },
        data: { squadId }
    })
    return { success: true }
}
