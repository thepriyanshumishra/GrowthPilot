"use server"

import { getServerUser } from "@/lib/server-auth"

export async function getCurrentUser() {
    try {
        const user = await getServerUser()
        return user
    } catch (error) {
        console.error("Failed to fetch current user:", error)
        return null
    }
}
