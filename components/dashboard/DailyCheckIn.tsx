"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { getPendingPastTasks, updateTaskStatus, rescheduleTasksStart } from "@/app/actions/daily-checkin"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

export function DailyCheckIn() {
    const [open, setOpen] = useState(false)
    const [taskList, setTaskList] = useState<any[]>([])

    useEffect(() => {
        const check = async () => {
            const lastCheck = localStorage.getItem("lastDailyCheck")
            const today = new Date().toDateString()

            if (lastCheck === today) return; // Already checked today

            // Fetch pending tasks from server
            const tasks = await getPendingPastTasks()
            if (tasks.length > 0) {
                setTaskList(tasks)
                setOpen(true)
            } else {
                localStorage.setItem("lastDailyCheck", today)
            }
        }
        check()
    }, [])


    const handleRescheduleAll = async () => {
        await rescheduleTasksStart()
        toast.info("Tasks moved to Today's view.")
        closeModal()
    }


    const closeModal = () => {
        localStorage.setItem("lastDailyCheck", new Date().toDateString())
        setOpen(false)
    }

    // Individual Task Toggles
    const [completedIds, setCompletedIds] = useState<string[]>([])

    const handleToggle = (id: string) => {
        if (completedIds.includes(id)) {
            setCompletedIds(prev => prev.filter(p => p !== id))
        } else {
            setCompletedIds(prev => [...prev, id])
        }
    }

    const confirmSelection = async () => {
        if (completedIds.length === 0) {
            handleRescheduleAll()
            return
        }

        // Complete selected
        const promises = completedIds.map(id => updateTaskStatus(id, "DONE"))
        await Promise.all(promises)

        // Reschedule others
        await rescheduleTasksStart()

        toast.success(`${completedIds.length} tasks completed. ${taskList.length - completedIds.length} moved to today.`)
        closeModal()
    }

    if (!open) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md clay-panel overflow-hidden border-none sm:rounded-[2.5rem] p-6 sm:p-8">
                <DialogHeader className="mb-4 sm:mb-6 flex flex-col items-center text-center">
                    <DialogTitle className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center justify-center gap-2">
                        👋 Welcome back!
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 font-medium mt-2 text-[15px] sm:text-base leading-relaxed">
                        Before starting today, did you complete these pending tasks from yesterday?
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[50vh]">
                    <div className="space-y-4 px-1 py-1">
                        {taskList.map(task => (
                            <div
                                key={task.id}
                                className={`flex items-start gap-4 p-5 rounded-[1.5rem] cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${completedIds.includes(task.id)
                                    ? "bg-blue-50/50 dark:bg-blue-500/10 border-2 border-blue-500/30 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.05)]"
                                    : "clay-panel"
                                    }`}
                                onClick={() => handleToggle(task.id)}
                            >
                                <div className={`mt-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${completedIds.includes(task.id)
                                    ? "bg-blue-600 border-blue-600 shadow-md shadow-blue-500/30 scale-110"
                                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-inner"
                                    }`}>
                                    {completedIds.includes(task.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-[15px] font-bold ${completedIds.includes(task.id)
                                        ? "text-zinc-500 line-through dark:text-zinc-400"
                                        : "text-zinc-900 dark:text-white"
                                        }`}>{task.title}</p>
                                    <p className="text-sm text-zinc-500 mt-1 leading-snug">{task.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <DialogFooter className="flex-col sm:flex-col gap-3 mt-6">
                    <Button className="clay-btn-primary w-full h-14 rounded-2xl text-[17px] font-bold transition-all" onClick={confirmSelection}>
                        Confirm & Continue
                    </Button>
                    <Button variant="ghost" className="w-full text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-bold transition-all h-12 rounded-2xl text-[15px]" onClick={handleRescheduleAll}>
                        No, move all to today
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
