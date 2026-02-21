"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Send, Mic, StopCircle, Command as CommandIcon, Sparkles, Zap, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ChatInputProps {
    onSend: (text: string) => void
    isLoading: boolean
    isRecording: boolean
    onStartRecording: () => void
    onStopRecording: () => void
}

export function ChatInput({ onSend, isLoading, isRecording, onStartRecording, onStopRecording }: ChatInputProps) {
    const [input, setInput] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = () => {
        if (!input.trim() || isLoading) return
        onSend(input)
        setInput("")
    }

    const suggestions = [
        { text: "Update Roadmap", icon: Zap },
        { text: "Mock Interview", icon: Mic },
        { text: "Career Roast", icon: Sparkles },
        { text: "Skill Gaps", icon: Lightbulb }
    ]

    return (
        <div className="absolute bottom-4 md:bottom-6 left-0 right-0 px-4 md:px-6 z-30 pointer-events-none">
            <div className="max-w-3xl mx-auto w-full relative pointer-events-auto">

                {/* Minimal Suggestions Bar */}
                <AnimatePresence>
                    {isFocused && !input.trim() && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute -top-10 left-0 right-0 flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide"
                        >
                            {suggestions.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSend(item.text)}
                                    className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-[10px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 text-[10.5px] font-bold text-zinc-500 hover:text-blue-600 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.05)] active:scale-95"
                                >
                                    <item.icon className="w-3 h-3" />
                                    {item.text}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={cn(
                    "flex flex-col bg-white/80 dark:bg-zinc-900/90 backdrop-blur-2xl border transition-all duration-300 rounded-[22px] overflow-hidden",
                    isFocused ? "border-blue-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-blue-500/10" : "border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
                )}>
                    <div className="flex items-end gap-2 p-2 px-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 h-9 w-9 my-1"
                        >
                            <Plus className="w-4.5 h-4.5" />
                        </Button>

                        <div className="flex-1 min-w-0 pb-1">
                            <Input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                placeholder="Command GrowthPilot AI..."
                                className="bg-transparent border-none focus-visible:ring-0 text-[14.5px] font-medium h-auto py-3 placeholder:text-zinc-400 dark:text-zinc-500"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 pb-1 pr-1">
                            {input.trim() ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-full h-9 w-9 p-0 shadow-lg shadow-blue-500/20 active:scale-90 transition-transform"
                                >
                                    {isLoading ? <Sparkles className="w-4 h-4 animate-spin-slow" /> : <Send className="w-4 h-4 ml-0.5" />}
                                </Button>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <Button
                                        onClick={isRecording ? onStopRecording : onStartRecording}
                                        variant="ghost"
                                        disabled={isLoading}
                                        className={cn(
                                            "rounded-[10px] h-9 w-9 p-0 transition-all active:scale-90",
                                            isRecording ? "bg-red-500 text-white animate-pulse" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                        )}
                                    >
                                        {isRecording ? <StopCircle className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
                                    </Button>
                                    <div className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-[6px] border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950/30 opacity-40">
                                        <CommandIcon className="w-2.5 h-2.5" />
                                        <span className="text-[9px] font-bold">K</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <p className="mt-3 text-center text-[9.5px] font-semibold text-zinc-400 uppercase tracking-widest opacity-40">
                    Operation Secure • Strategic Insight Engine
                </p>
            </div>
        </div>
    )
}
