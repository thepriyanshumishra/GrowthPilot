"use client"

import { GlassCard } from "@/components/GlassCard"
import { Users, Trophy, Zap, Shield, ArrowUpRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { getSquads, joinSquad } from "./actions"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

export default function SquadsPage() {
    const { user } = useAuth()
    const [squads, setSquads] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadSquads = async () => {
            try {
                const data = await getSquads()
                setSquads(data)
            } catch (error) {
                console.error("Failed to load squads:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadSquads()
    }, [])

    const handleJoin = async (squadId: string) => {
        if (!user) return
        try {
            await joinSquad(squadId, user.uid)
            toast.success("Squad joined successfully!")
            window.location.reload()
        } catch {
            toast.error("Failed to join squad")
        }
    }

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-black font-geist pb-20 md:pb-0">
            <main className="px-4 py-6 md:px-0 md:py-0">
                <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2 md:mb-3">
                            <div className="px-2 md:px-2.5 py-0.5 bg-blue-600 text-white text-[9px] md:text-[10px] font-semibold uppercase tracking-wider rounded-md">Global Arena</div>
                            <div className="text-zinc-400 text-[9px] md:text-[10px] font-semibold uppercase tracking-wider">Tactical Squads</div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">Squad Command</h1>
                        <p className="text-zinc-500 max-w-xl font-medium text-sm md:text-base">Join a tactical squad, sync your milestones, and climb the global leaderboards with your team.</p>
                    </div>

                    <GlassCard className="p-3 md:p-4 px-5 md:px-6 w-full md:w-auto rounded-2xl flex items-center justify-between md:justify-start gap-6 bg-white dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                        <div className="text-left md:text-center">
                            <div className="text-[9px] md:text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Your Squad</div>
                            <div className="text-base md:text-lg font-semibold text-blue-600">Active</div>
                        </div>
                    </GlassCard>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Leaderboard - 8 Cols */}
                    <div className="lg:col-span-8 space-y-4 md:space-y-6">
                        <h3 className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-zinc-400 ml-1 md:ml-2">Leaderboard</h3>
                        <div className="space-y-3">
                            {squads.length === 0 ? (
                                <div className="p-8 md:p-12 text-center text-zinc-500 text-sm md:text-base bg-white/50 dark:bg-zinc-900/50 rounded-2xl md:rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                    No squads found. Start by creating one (Admin only).
                                </div>
                            ) : squads.map((squad, i) => (
                                <motion.div
                                    key={squad.id}
                                    whileHover={{ x: 5 }}
                                    className="cursor-pointer"
                                    onClick={() => handleJoin(squad.id)}
                                >
                                    <GlassCard className="p-4 md:p-5 rounded-xl md:rounded-2xl flex items-center justify-between group bg-white dark:bg-zinc-900/40 hover:border-zinc-200 dark:hover:border-zinc-800 transition-all border border-zinc-100 dark:border-zinc-800/50 shadow-sm">
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-lg md:rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-xs md:text-sm font-semibold text-zinc-400">
                                                {i + 1}
                                            </div>
                                            <div className="min-w-0 pr-2">
                                                <h4 className="text-base md:text-lg font-semibold tracking-tight text-zinc-900 dark:text-white truncate">{squad.name}</h4>
                                                <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1">
                                                    <span className="text-[10px] md:text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                                                        <Users className="w-3 h-3 md:w-3.5 md:h-3.5" /> {squad._count.members}
                                                    </span>
                                                    <span className="text-[10px] md:text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                                                        <Zap className="w-3 h-3 md:w-3.5 md:h-3.5" /> {squad.totalXp.toLocaleString()} XP
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-zinc-300 group-hover:text-blue-600 transition-colors shrink-0" />
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Stats - 4 Cols */}
                    <div className="lg:col-span-4 space-y-6 md:space-y-8 mt-4 md:mt-0">
                        <GlassCard className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-blue-600 text-white border-none shadow-lg shadow-blue-500/10 space-y-4 md:space-y-6 relative overflow-hidden">
                            <h3 className="text-base md:text-lg font-bold tracking-tight">Season 1: Early Adopter</h3>
                            <p className="text-blue-100 text-xs md:text-sm font-medium opacity-90 leading-relaxed">The first tactical season is live. Top squads earn permanent badges and profile artifacts.</p>

                            <div className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-wider text-white/60">Season Progress</span>
                                    <span className="text-[10px] md:text-xs font-bold">12 Days Left</span>
                                </div>
                                <div className="h-1 md:h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-2/3" />
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4 md:space-y-6">
                            <h3 className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Tactical Insights</h3>
                            <div className="space-y-3 md:space-y-4">
                                <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-start md:items-center gap-3 md:gap-4 border border-zinc-100 dark:border-zinc-800/50">
                                    <div className="p-1.5 md:p-2 bg-blue-500/10 text-blue-600 rounded-lg shrink-0 mt-0.5 md:mt-0">
                                        <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </div>
                                    <div className="text-[11px] md:text-[12px] font-medium leading-relaxed md:leading-tight text-zinc-600 dark:text-zinc-400">Focus on Python milestones this week for 2x XP boost.</div>
                                </div>
                                <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-start md:items-center gap-3 md:gap-4 border border-zinc-100 dark:border-zinc-800/50">
                                    <div className="p-1.5 md:p-2 bg-blue-500/10 text-blue-600 rounded-lg shrink-0 mt-0.5 md:mt-0">
                                        <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </div>
                                    <div className="text-[11px] md:text-[12px] font-medium leading-relaxed md:leading-tight text-zinc-600 dark:text-zinc-400">Join a squad to earn group XP multipliers.</div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </main>
        </div>
    )
}
