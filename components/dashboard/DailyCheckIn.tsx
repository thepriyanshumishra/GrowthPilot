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
import { getPendingPastTasks, updateTaskStatus } from "@/app/actions/daily-checkin"
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

        // Reschedule others (i.e., do nothing as they stay TODO)
        toast.success(`${completedIds.length} tasks completed. ${taskList.length - completedIds.length} moved to today.`)
        closeModal()
    }

    if (!open) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">☀️ Good Morning!</DialogTitle>
                    <DialogDescription>
                        Before starting today, did you complete these pending tasks from yesterday?
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[50vh] pr-4 py-2">
                    <div className="space-y-2">
                        {taskList.map(task => (
                            <div
                                key={task.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${completedIds.includes(task.id)
                                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                                    }`}
                                onClick={() => handleToggle(task.id)}
                            >
                                <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${completedIds.includes(task.id)
                                    ? "bg-green-500 border-green-500"
                                    : "border-zinc-300 dark:border-zinc-600"
                                    }`}>
                                    {completedIds.includes(task.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${completedIds.includes(task.id) ? "text-green-800 dark:text-green-300 line-through" : "text-zinc-900 dark:text-white"
                                        }`}>{task.title}</p>
                                    <p className="text-xs text-zinc-500 truncate mt-0.5">{task.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <DialogFooter className="flex-col sm:flex-col gap-2">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={confirmSelection}>
                        Confirm & Continue
                    </Button>
                    <Button variant="ghost" className="w-full text-zinc-500" onClick={handleRescheduleAll}>
                        No, move all to today
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
