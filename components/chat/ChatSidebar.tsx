"use client"

import { BrainCircuit, Target, Trophy, Activity } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
    profile: any
    activeRoadmap: any
    memories: any[]
}

export function ChatSidebar({ profile, activeRoadmap, memories }: ChatSidebarProps) {

    return (
        <aside className="hidden lg:flex flex-col w-[300px] shrink-0 h-full border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 backdrop-blur-3xl p-5 overflow-hidden">
            <div className="flex flex-col gap-6 h-full">

                {/* Section: Mission Insight */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em] px-1 flex items-center justify-between">
                        <span>Mission Profile</span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.5)]" />
                            <span className="text-[9px] font-medium lowercase opacity-60">syncing</span>
                        </div>
                    </h3>

                    <div className="bg-white dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-[14px] p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-[10px] bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <Target className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-100 truncate">
                                    {activeRoadmap?.title || "Drafting Mission..."}
                                </span>
                                <span className="text-[9px] text-zinc-500 font-medium">Strategic Roadmap</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <div className="bg-zinc-50 dark:bg-white/5 rounded-[10px] p-2 border border-zinc-200/30 dark:border-white/5">
                                <span className="text-[8px] text-zinc-400 dark:text-zinc-500 uppercase font-black block mb-0.5">Exp Level</span>
                                <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">{profile?.experienceLevel || "N/A"}</span>
                            </div>
                            <div className="bg-zinc-50 dark:bg-white/5 rounded-[10px] p-2 border border-zinc-200/30 dark:border-white/5">
                                <span className="text-[8px] text-zinc-400 dark:text-zinc-500 uppercase font-black block mb-0.5">Focus Goal</span>
                                <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 truncate">Daily Brief</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Tactical Memory */}
                <div className="flex-1 min-h-0 flex flex-col space-y-3">
                    <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em] px-1 flex items-center gap-2">
                        <BrainCircuit className="w-3 h-3" />
                        Intelligence Feed
                    </h3>

                    <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-none pb-4">
                        {memories.length > 0 ? memories.slice(0, 6).map((mem, i) => (
                            <motion.div
                                key={mem.id}
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white/50 dark:bg-white/5 rounded-[12px] p-3 border border-zinc-200/30 dark:border-white/5 hover:border-blue-500/20 transition-all cursor-default"
                            >
                                <div className="flex items-center gap-2 mb-1.5 opacity-60">
                                    <div className={cn(
                                        "w-1 h-1 rounded-full",
                                        mem.type === 'BLOCKER' ? 'bg-red-500' :
                                            mem.type === 'INSIGHT' ? 'bg-amber-500' :
                                                'bg-blue-500'
                                    )} />
                                    <span className="text-[8px] font-black uppercase tracking-tighter">{mem.type}</span>
                                </div>
                                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                    {mem.content}
                                </p>
                            </motion.div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-4">
                                <Activity className="w-6 h-6 mb-2" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting Data</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section: Statistics Footer */}
                <div className="pt-5 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Total Progress</span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-xl font-black text-zinc-900 dark:text-white leading-none">
                                    {profile?.xp?.toLocaleString() || 0}
                                </span>
                                <span className="text-[10px] font-bold text-zinc-400">XP</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center border border-zinc-200/50 dark:border-white/10">
                            <Trophy className="w-5 h-5 text-amber-500" />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
