"use client"

import { Bot, CheckCircle2, User } from "lucide-react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Message {
    role: "user" | "assistant"
    content: string
    isAction?: boolean
}

interface ChatMessageProps {
    message: Message
    onApprove: (content: string) => void
}

export function ChatMessage({ message, onApprove }: ChatMessageProps) {
    const isAssistant = message.role === "assistant"

    const cleanContent = (content: string) => {
        return content.replace(/```\[ACTION\][\s\S]*?```/g, "").replace(/```\[MEMORY\][\s\S]*?```/g, "").trim()
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
                "flex w-full gap-4 px-4 py-2",
                isAssistant ? "justify-start" : "justify-end"
            )}
        >
            {isAssistant && (
                <div className="w-8 h-8 rounded-[10px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-zinc-200/50 dark:border-zinc-700/50">
                    <Bot className="w-4.5 h-4.5 text-zinc-600 dark:text-zinc-400" />
                </div>
            )}

            <div className={cn(
                "relative group max-w-[85%] sm:max-w-[70%]",
                !isAssistant
                    ? "bg-[#007AFF] text-white rounded-[18px] rounded-tr-[4px] px-4 py-2.5 shadow-[0_2px_8px_rgba(0,122,255,0.15)]"
                    : "bg-white dark:bg-zinc-900/80 backdrop-blur-md text-zinc-900 dark:text-zinc-100 px-5 py-3.5 rounded-[18px] rounded-tl-[4px] border border-zinc-200/80 dark:border-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            )}>

                <div className={cn(
                    "prose prose-sm max-w-none leading-normal font-sans",
                    !isAssistant ? "prose-invert text-[14.5px]" : "dark:prose-invert text-[14px]",
                    "prose-p:my-1.5 prose-headings:my-2 prose-headings:font-bold prose-headings:tracking-tight prose-ul:my-1.5 prose-li:my-0.5"
                )}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {cleanContent(message.content)}
                    </ReactMarkdown>
                </div>

                {message.isAction && isAssistant && (
                    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-2">
                        <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">TACTICAL PROPOSAL</div>
                        <Button
                            onClick={() => onApprove(message.content)}
                            size="sm"
                            className="w-fit h-8 bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90 rounded-[10px] text-[11px] font-semibold transition-all active:scale-[0.97]"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Approve Action
                        </Button>
                    </div>
                )}
            </div>

            {!isAssistant && (
                <div className="w-8 h-8 rounded-[10px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-zinc-200/50 dark:border-zinc-700/50">
                    <User className="w-4.5 h-4.5 text-zinc-600 dark:text-zinc-400" />
                </div>
            )}
        </motion.div>
    )
}
