"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
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
            className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 px-4 pointer-events-none"
        >
            <div className="w-full max-w-7xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-white/20 dark:border-zinc-800/50 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm pointer-events-auto">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xl shadow-blue-500/20 ring-1 ring-white/10 group-hover:scale-110 transition-all duration-300">
                        <Image src="/logo.png" alt="GrowthPilot" fill className="object-cover" />
                    </div>
                    <span className="text-[17px] font-black tracking-tight text-zinc-900 dark:text-white uppercase transition-colors group-hover:text-blue-600">GrowthPilot</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    <Link href="/features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</Link>
                    <Link href="/how-it-works" className="hover:text-zinc-900 dark:hover:text-white transition-colors">How it Works</Link>
                    <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</Link>
                </div>

                <div className="flex items-center gap-3">
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>
                    )}

                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard">
                                <Button variant="secondary" className="rounded-xl font-medium px-5">
                                    Dashboard
                                </Button>
                            </Link>
                            <Button onClick={logout} variant="ghost" className="rounded-xl font-medium px-5">
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <Link href="/auth/signup">
                            <Button className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-xl px-6 font-medium">
                                Get Started
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.nav>
    )
}
