"use client"

import { useState } from "react"
import { CheckCircle2, Zap, Loader2, BookOpen, ExternalLink, Target, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { completeTaskAction } from "@/app/(dashboard)/dashboard/actions"
import confetti from "canvas-confetti"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function TaskList({ initialTasks }: { initialTasks: any[] }) {
    const [tasks, setTasks] = useState(initialTasks)
    const [loadingIds, setLoadingIds] = useState<string[]>([])
    const [selectedTask, setSelectedTask] = useState<any>(null)

    const handleComplete = async (taskId: string) => {
        setLoadingIds(prev => [...prev, taskId])
        try {
            await completeTaskAction(taskId)
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'DONE' } : t))

            // Celebration!
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#2563eb', '#9333ea', '#10b981']
            })

            // Close modal if open
            if (selectedTask?.id === taskId) {
                setTimeout(() => setSelectedTask(null), 1000)
            }
        } catch (error) {
            console.error("Failed to complete task:", error)
        } finally {
            setLoadingIds(prev => prev.filter(id => id !== taskId))
        }
    }

    const getDifficultyColor = (diff: string) => {
        switch (diff?.toLowerCase()) {
            case 'easy': return 'text-green-500 bg-green-500/10 border-green-500/20'
            case 'medium': return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
            case 'hard': return 'text-purple-500 bg-purple-500/10 border-purple-500/20'
            default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20'
        }
    }

    return (
        <>
            <ScrollArea className="flex-1">
                <div className="space-y-3 pr-4 py-2">
                    <AnimatePresence mode="popLayout">
                        {tasks.map((task, i) => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedTask(task)}
                                className={`group flex items-center gap-4 p-4 rounded-2xl transition-all border cursor-pointer ${task.status === 'DONE'
                                    ? 'bg-zinc-50/50 dark:bg-zinc-900/20 border-transparent opacity-60 grayscale'
                                    : 'bg-white dark:bg-zinc-900/80 border-zinc-100 dark:border-zinc-800 hover:border-blue-500/20 hover:shadow-md hover:-translate-y-0.5'
                                    }`}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleComplete(task.id)
                                    }}
                                    disabled={task.status === 'DONE' || loadingIds.includes(task.id)}
                                    className="relative flex-shrink-0"
                                >
                                    {task.status === 'DONE' ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-sm"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                        </motion.div>
                                    ) : loadingIds.includes(task.id) ? (
                                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 group-hover:border-blue-600 transition-colors bg-white dark:bg-zinc-950 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                                            <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-blue-600 transition-colors" />
                                        </div>
                                    )}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-semibold text-[15px] tracking-tight truncate leading-tight ${task.status === 'DONE' ? 'text-zinc-400' : 'text-zinc-900 dark:text-white'}`}>
                                        {task.title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide border ${getDifficultyColor(task.difficulty)}`}>
                                            {task.difficulty || "Quest"}
                                        </div>
                                        <div className="flex items-center gap-1 text-zinc-400">
                                            <Zap className="w-3 h-3 text-blue-600" />
                                            <span className="text-[10px] font-medium uppercase tracking-wide">
                                                +{task.difficulty === 'Hard' ? '150' : task.difficulty === 'Medium' ? '100' : '50'} XP
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </ScrollArea>

            <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
                <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide border ${getDifficultyColor(selectedTask?.difficulty)}`}>
                                {selectedTask?.difficulty || "Quest"}
                            </div>
                            <span className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                                <Zap className="w-3 h-3 text-orange-500" />
                                +{selectedTask?.difficulty === 'Hard' ? '150' : selectedTask?.difficulty === 'Medium' ? '100' : '50'} XP Reward
                            </span>
                        </div>
                        <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">
                            {selectedTask?.title}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 text-sm mt-2">
                            {selectedTask?.description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* 1. How to do (Instructions) */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-500" />
                                Mission Briefing
                            </h4>
                            <div className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                                {selectedTask?.metadata?.instructions || "No specific briefing available. Use your best judgment to complete this objective."}
                            </div>
                        </div>

                        {/* 2. Where to do (Resources) */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                <ExternalLink className="w-4 h-4 text-purple-500" />
                                Intel & Resources
                            </h4>
                            <div className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                {selectedTask?.metadata?.resources ? (
                                    <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/20 text-purple-900 dark:text-purple-100">
                                        {selectedTask.metadata.resources}
                                    </div>
                                ) : (
                                    <p className="text-zinc-400 italic">No external intel required.</p>
                                )}
                            </div>
                        </div>

                        {/* 3. Outcome (What you should be able to do) */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-500" />
                                Success Criteria
                            </h4>
                            <div className="text-sm text-zinc-600 dark:text-zinc-300 bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                                {selectedTask?.metadata?.outcome || "Objective is complete when the task is marked done."}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-between gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-2">
                        <div className="hidden sm:flex items-center text-xs text-zinc-400 italic">
                            Estimated time: {selectedTask?.estimatedMinutes || 30} mins
                        </div>
                        <Button
                            onClick={() => selectedTask && handleComplete(selectedTask.id)}
                            disabled={selectedTask?.status === 'DONE' || loadingIds.includes(selectedTask?.id || '')}
                            className={`w-full sm:w-auto ${selectedTask?.status === 'DONE' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {selectedTask?.status === 'DONE' ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Mission Accomplished
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Mark as Complete ({selectedTask?.difficulty === 'Hard' ? '+150' : selectedTask?.difficulty === 'Medium' ? '+100' : '+50'} XP)
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
