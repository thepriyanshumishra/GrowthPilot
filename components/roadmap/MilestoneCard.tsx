"use client"

import { useState } from "react"
import { GlassCard } from "@/components/GlassCard"
import { CheckCircle2, Flag, Lock, Trophy, ArrowUpRight, Zap, Target } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RoadmapEngageButton } from "@/components/dashboard/RoadmapEngageButton"
import { Badge } from "@/components/ui/badge"

interface MilestoneCardProps {
    milestone: {
        id: string
        title: string
        description: string | null
        status: string
        order: number
    }
    index: number
    isCompleted: boolean
    isCurrent: boolean
    isLocked: boolean
}

export function MilestoneCard({ milestone, index, isCompleted, isCurrent, isLocked }: MilestoneCardProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="relative pl-16 group cursor-pointer">
                    {/* Node Icon */}
                    <div className={`absolute left-0 top-1 w-14 h-14 rounded-2xl border-4 border-[#FAFAFA] dark:border-black flex items-center justify-center z-10 transition-all duration-300 ${isCompleted ? 'bg-green-500 text-white shadow-lg shadow-green-500/20 scale-100' :
                        isCurrent ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110 ring-4 ring-blue-500/10' :
                            'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800'
                        }`}>
                        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> :
                            isCurrent ? <Flag className="w-6 h-6 fill-current" /> :
                                <Lock className="w-5 h-5" />}
                    </div>

                    {/* Card */}
                    <GlassCard className={`p-6 rounded-3xl border transition-all duration-300 group-hover:translate-x-1 ${isCurrent
                        ? 'bg-white dark:bg-zinc-900 border-blue-200 dark:border-blue-900/30 shadow-xl shadow-blue-500/5'
                        : 'bg-white/60 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-lg hover:border-zinc-300/50'
                        }`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${isCompleted ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                                        isCurrent ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                                            'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'
                                        }`}>
                                        Phase {index + 1}
                                    </span>
                                    {isCurrent && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider animate-pulse">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                            Active Objective
                                        </span>
                                    )}
                                </div>
                                <h3 className={`text-xl font-bold tracking-tight ${isLocked ? 'text-zinc-400' : 'text-zinc-900 dark:text-white'}`}>
                                    {milestone.title}
                                </h3>
                            </div>

                            {!isLocked && (
                                <RoadmapEngageButton
                                    title={milestone.title}
                                    isCompleted={isCompleted}
                                    isCurrent={isCurrent}
                                />
                            )}
                        </div>

                        <p className={`text-sm leading-relaxed mb-6 ${isLocked ? 'text-zinc-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                            {milestone.description || "Complete the previous objectives to unlock this mission phase."}
                        </p>

                        {!isLocked && (
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">500 XP</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                                    <ArrowUpRight className="w-3.5 h-3.5 text-purple-500" />
                                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Skill Unlock</span>
                                </div>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 rounded-3xl p-0 overflow-hidden shadow-2xl">
                <div className={`h-2 w-full ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-600' : 'bg-zinc-200'}`} />

                <div className="p-8">
                    <DialogHeader className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <Badge variant="outline" className={`font-mono text-[10px] tracking-widest ${isCompleted ? 'border-green-500/30 text-green-600 bg-green-50' : isCurrent ? 'border-blue-500/30 text-blue-600 bg-blue-50' : 'text-zinc-400'}`}>
                                MISSION PHASE {index + 1}
                            </Badge>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter flex items-center gap-2">
                                Status: <span className={isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-zinc-500'}>{milestone.status}</span>
                            </span>
                        </div>
                        <DialogTitle className="text-3xl font-black text-zinc-900 dark:text-white leading-tight">
                            {milestone.title}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-lg mt-4 leading-relaxed font-medium">
                            {milestone.description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-white dark:hover:bg-zinc-900 hover:shadow-md group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    <Target className="w-4 h-4" />
                                </div>
                                <h4 className="font-bold text-sm tracking-tight">Focus Objectives</h4>
                            </div>
                            <ul className="space-y-2">
                                <li className="text-xs text-zinc-500 flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 text-blue-500" /> Deep Dive Research
                                </li>
                                <li className="text-xs text-zinc-500 flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 text-blue-500" /> Concept Mapping
                                </li>
                                <li className="text-xs text-zinc-500 flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 text-blue-500" /> Practical Execution
                                </li>
                            </ul>
                        </div>

                        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-white dark:hover:bg-zinc-900 hover:shadow-md group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <h4 className="font-bold text-sm tracking-tight">Potential Rewards</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-500">Mission Experience</span>
                                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 text-[10px]">500 XP</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-500">Specialization Skill</span>
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-500 text-[10px]">Unlocks</Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <RoadmapEngageButton
                            title={milestone.title}
                            isCompleted={isCompleted}
                            isCurrent={isCurrent}
                        />
                        <Button
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="rounded-xl h-12 px-6 text-sm font-bold text-zinc-500"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
