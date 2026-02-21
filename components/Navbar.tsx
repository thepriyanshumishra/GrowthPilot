"use client"

import Link from "next/link"
import Image from "next/image"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"


export function Navbar() {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 sm:p-6 pointer-events-none"
        >
            <div className="w-full max-w-6xl clay-panel rounded-[2.5rem] px-6 py-3 md:px-8 flex items-center justify-between pointer-events-auto transition-all duration-500">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="relative w-11 h-11 rounded-[1.2rem] overflow-hidden group-hover:scale-105 transition-all duration-500 shadow-[4px_4px_10px_rgba(0,0,0,0.1),inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-2px_-2px_4px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.4),inset_2px_2px_4px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.3)]">
                        <Image src="/logo.png" alt="GrowthPilot" fill className="object-cover" />
                    </div>
                    <span className="text-lg font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100 uppercase transition-colors group-hover:text-blue-500 drop-shadow-sm">GrowthPilot</span>
                </Link>

                <div className="hidden lg:flex items-center gap-8 text-[15px] font-bold text-zinc-600 dark:text-zinc-300">
                    <Link href="/features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
                    <Link href="/how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How it Works</Link>
                    <Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link>
                </div>

                <div className="flex items-center gap-4">
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="flex items-center justify-center w-11 h-11 rounded-2xl clay-btn text-zinc-600 hover:text-blue-500 dark:text-zinc-300 dark:hover:text-blue-400"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    )}

                    {user ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link href="/dashboard">
                                <button className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-[1.1rem] font-bold text-zinc-700 dark:text-zinc-200 clay-btn text-xs sm:text-sm">
                                    Dashboard
                                </button>
                            </Link>
                            <button onClick={logout} className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-[1.1rem] font-bold text-rose-500 dark:text-rose-400 clay-btn text-xs sm:text-sm">
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link href="/auth/signup">
                            <button className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-[1.1rem] font-bold clay-btn-primary text-sm sm:text-base">
                                Get Started
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.nav>
    )
}
