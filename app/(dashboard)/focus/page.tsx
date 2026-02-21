"use client"

import { GlassCard } from "@/components/GlassCard"
import { useFocus, TIMER_MODES } from "@/context/FocusContext"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Play, Pause, RotateCcw, Zap, Target } from "lucide-react"

export default function FocusPage() {
    const {
        selectedMode,
        timeLeft,
        isActive,
        sessionCount,
        toggleTimer,
        resetTimer,
        handleModeSelect,
        formatTime,
        progress
    } = useFocus()

    return (
        <div className="font-geist h-full flex flex-col p-4 md:p-6 max-w-7xl mx-auto space-y-6 md:space-y-8 pb-20">
            <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2 md:gap-3">
                    <Target className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                    Focus Zone
                </h1>
                <p className="text-zinc-500 text-sm md:text-base">Enter a state of deep flow with specialized timer techniques.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 md:gap-8 flex-1">
                {/* Main Timer */}
                <GlassCard className="lg:col-span-2 p-6 md:p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
                    {/* Background Glow */}
                    <div className={cn(
                        "absolute inset-0 opacity-10 blur-3xl transition-colors duration-1000",
                        selectedMode.color.replace("bg-", "bg-") // Simplify, use color class
                    )} style={{ background: isActive ? `var(--${selectedMode.color})` : undefined }} />

                    <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8 w-full">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-sm md:text-lg font-medium text-zinc-500 uppercase tracking-widest text-center">
                                {isActive ? "Flow State Active" : selectedMode.name}
                            </span>
                            <h2 className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tighter tabular-nums text-zinc-900 dark:text-white">
                                {formatTime(timeLeft)}
                            </h2>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
                            <button
                                onClick={toggleTimer}
                                className={cn(
                                    "clay-btn px-8 md:px-12 py-3 md:py-4 rounded-2xl text-lg md:text-xl font-bold text-white border-none shadow-xl transition-all flex items-center justify-center gap-3 w-full sm:w-auto",
                                    selectedMode.color
                                )}
                            >
                                {isActive ? <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" /> : <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />}
                                {isActive ? "PAUSE" : "START SESSION"}
                            </button>
                            <button
                                onClick={resetTimer}
                                className="clay-btn px-6 py-3 md:py-4 rounded-2xl text-zinc-500 font-bold border-none transition-all flex items-center justify-center w-full sm:w-auto"
                            >
                                <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>

                        <div className="text-xs md:text-sm text-zinc-500 font-medium bg-zinc-100 dark:bg-zinc-800/50 px-4 py-2 rounded-full flex items-center gap-2">
                            <Zap className="w-3 h-3 md:w-4 md:h-4 text-amber-500 fill-amber-500" />
                            Reward: +{selectedMode.xp} XP per session
                        </div>
                    </div>

                    {/* Progress Circle or Bar */}
                    <div className="absolute inset-x-0 bottom-0 h-2 bg-zinc-100 dark:bg-zinc-800">
                        <motion.div
                            initial={false}
                            animate={{ width: `${progress}%` }}
                            className={cn("h-full", selectedMode.color)}
                            transition={{ ease: "linear", duration: 1 }}
                        />
                    </div>
                </GlassCard>

                {/* Techniques List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white px-2">Select Technique</h3>
                    <div className="space-y-3">
                        {TIMER_MODES.map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => handleModeSelect(mode)}
                                className={cn(
                                    "w-full p-4 rounded-2xl text-left transition-all relative overflow-hidden group",
                                    selectedMode.id === mode.id
                                        ? "clay-panel border-blue-500 ring-1 ring-blue-500/20"
                                        : "clay-panel opacity-60 hover:opacity-100"
                                )}
                            >
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <span className={cn(
                                            "text-sm font-bold block mb-1",
                                            selectedMode.id === mode.id ? "text-blue-700 dark:text-blue-300" : "text-zinc-700 dark:text-zinc-200"
                                        )}>{mode.name}</span>
                                        <span className="text-xs text-zinc-500 block">{mode.description}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-xs font-mono font-medium text-zinc-400">
                                            {Math.floor(mode.duration / 60)}m
                                        </span>
                                        {mode.xp > 0 && <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-600 px-1.5 py-0.5 rounded font-bold">+{mode.xp} XP</span>}
                                    </div>
                                </div>

                                {/* Interactive Active State Indicator */}
                                {selectedMode.id === mode.id && isActive && (
                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats / Info */}
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-0">
                <GlassCard className="p-4 md:p-6 flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <Target className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                        <p className="text-xs md:text-sm font-medium text-zinc-500">Daily Focus</p>
                        <p className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">{sessionCount} <span className="text-xs md:text-sm font-normal text-zinc-400">sessions</span></p>
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}
