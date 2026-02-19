"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Trash2, BrainCircuit, Loader2 } from "lucide-react"
import { getMemories, deleteMemory } from "@/app/actions/memory" // Assumed path
import { toast } from "sonner"
import { format } from "date-fns"

interface Memory {
    id: string
    content: string
    type: string
    createdAt: Date
}

interface MemoriesDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function MemoriesDialog({ open, onOpenChange }: MemoriesDialogProps) {
    const [memories, setMemories] = useState<Memory[]>([])
    const [loading, setLoading] = useState(false)

    const loadMemories = async () => {
        setLoading(true)
        const data = await getMemories()
        // Convert dates if needed (server actions usually return Dates but client boundaries can serialize to strings)
        // Prisma returns Dates, Next.js server actions serialize them? No, they stay Dates usually or strings.
        // Safer to handle.
        setMemories(data as any)
        setLoading(false)
    }

    useEffect(() => {
        if (open) {
            loadMemories()
        }
    }, [open])

    const handleDelete = async (id: string) => {
        const res = await deleteMemory(id)
        if (res.success) {
            setMemories(prev => prev.filter(m => m.id !== id))
            toast.success("Memory forgotten.")
        } else {
            toast.error("Could not delete memory.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-purple-600" />
                        Saved Memories
                    </DialogTitle>
                    <DialogDescription>
                        GrowthPilot remembers these details to offer better coaching.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                    </div>
                ) : memories.length === 0 ? (
                    <div className="text-center p-8 text-zinc-400 text-sm">
                        No memories saved yet. Chat with your coach to build context.
                    </div>
                ) : (
                    <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-3">
                            {memories.map((mem) => (
                                <div key={mem.id} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 group relative">
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 pr-6">
                                        {mem.content}
                                    </p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">
                                            {mem.type} • {format(new Date(mem.createdAt), 'MMM d, yyyy')}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-zinc-400 hover:text-red-500 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDelete(mem.id)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    )
}
