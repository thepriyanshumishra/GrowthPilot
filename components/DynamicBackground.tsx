"use client"

import { useAuth } from "@/context/AuthContext"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function DynamicBackground() {
    const { user, dbUser } = useAuth()
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Use high-res image if available
    const imageUrl = dbUser?.image || user?.photoURL

    // Only render dynamic background in dark mode and if user has an image
    if (resolvedTheme !== "dark" || !imageUrl) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }} // Subtle tint (15%)
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden"
            >
                {/* 
                  We use an oversized background image that is heavily blurred.
                  The scale-150 ensures no edges are visible when blurred.
                */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat blur-[100px] scale-150 transform transition-transform duration-[20s]"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />

                {/* Overlay gradient to ensure text readability */}
                <div className="absolute inset-0 bg-black/40" />
            </motion.div>
        </AnimatePresence>
    )
}
