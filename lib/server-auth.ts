import { cookies } from "next/headers"
import { adminAuth } from "./firebase-admin"
import { prisma } from "./prisma"

export async function getServerUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
        console.log("Auth Debug: No token cookie found")
        return null
    }

    try {
        const decodedToken = await adminAuth.verifyIdToken(token)
        const uid = decodedToken.uid
        console.log("Auth Debug: Token verified for UID:", uid)

        // Ensure user exists in our Prisma DB
        let user = await prisma.user.findUnique({
            where: { id: uid }
        })

        if (user) {
            // Sync profile picture if changed
            if (decodedToken.picture && user.image !== decodedToken.picture) {
                user = await prisma.user.update({
                    where: { id: uid },
                    data: { image: decodedToken.picture }
                })
            }
        } else {
            user = await prisma.user.create({
                data: {
                    id: uid,
                    email: decodedToken.email || `${uid}@no-email.com`,
                    name: decodedToken.name || decodedToken.email?.split('@')[0] || "User",
                    image: decodedToken.picture || null
                }
            })
        }

        return user
    } catch (error: any) {
        // Distinguish between Auth error and DB error
        if (error.code?.startsWith('P') || error.message?.includes('Can\'t reach database')) {
            console.error("Critical Database Error in Auth:", error.message)
            throw error // Re-throw DB errors so they aren't masked as "Unauthorized"
        }

        console.error("Auth Verification Error:", error.message || error)
        return null
    }
}
