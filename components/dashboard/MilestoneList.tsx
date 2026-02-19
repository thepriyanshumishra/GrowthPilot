"use client"

import { GlassCard } from "@/components/GlassCard"
import { CheckCircle2, ArrowRight, Flag } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

import { ScrollArea } from "@/components/ui/scroll-area"

export function MilestoneList({ milestones, className }: { milestones: any[], className?: string }) {
    if (!milestones || milestones.length === 0) return null

    return (
        <div className={`space-y-6 pt-4 flex flex-col ${className}`}>
            <div className="flex items-center justify-between px-1 shrink-0">
                <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Tactical Roadmap</h3>
                <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-tight">{milestones.length} Phases</span>
            </div>

            <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="relative space-y-3 px-1">
                    {/* Vertical Connector Line */}
                    <div className="absolute left-[27px] top-8 bottom-8 w-[1.5px] bg-zinc-100 dark:bg-zinc-800 -z-10" />

                    {milestones.sort((a, b) => a.order - b.order).map((milestone, i) => (
                        <motion.div
                            key={milestone.id}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href="/roadmap" className="block">
                                <GlassCard className={`p-4 border border-transparent shadow-sm flex items-center justify-between group transition-all relative z-10 rounded-2xl ${milestone.status === 'COMPLETED' ? 'bg-zinc-50/50 dark:bg-zinc-900/20' : 'bg-white dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700'
                                    }`}>
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${milestone.status === 'COMPLETED'
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/10'
                                                : 'bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 text-zinc-400'
                                                }`}>
                                                {milestone.status === 'COMPLETED'
                                                    ? <CheckCircle2 className="w-5 h-5" />
                                                    : <Flag className="w-4 h-4" />
                                                }
                                            </div>
                                            {milestone.status !== 'COMPLETED' && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-2 border-white dark:border-zinc-950">
                                                    <span className="text-[9px] font-bold">{i + 1}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-0.5">
                                            <h4 className={`font-semibold tracking-tight text-[15px] ${milestone.status === 'COMPLETED' ? 'text-zinc-400 line-through decoration-blue-500/20' : 'text-zinc-900 dark:text-white'}`}>
                                                {milestone.title}
                                            </h4>
                                            <p className="text-xs text-zinc-500 line-clamp-1 max-w-md">{milestone.description}</p>
                                        </div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-4 h-4 text-blue-600" />
                                    </div>
                                </GlassCard>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
