"use client"

import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Zap, Timer, ChevronDown, Flame } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useFocus, TIMER_MODES } from "@/context/FocusContext"

export function PomodoroTimer() {
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
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 space-y-4">

            {/* Header / Selector */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Timer className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Focus Tech</span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-400 transition-colors">
                            <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-200 truncate max-w-[80px]">
                                {selectedMode.name}
                            </span>
                            <ChevronDown className="w-3 h-3 text-zinc-400" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-xs text-zinc-500">Select Technique</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {TIMER_MODES.map((mode) => (
                            <DropdownMenuItem
                                key={mode.id}
                                onClick={() => handleModeSelect(mode)}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                <span className={cn("text-xs font-medium", selectedMode.id === mode.id && "text-blue-600")}>{mode.name}</span>
                                <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded ml-2">
                                    {Math.floor(mode.duration / 60)}m
                                </span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Timer Display */}
            <div className="flex flex-col gap-4 relative">
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold tracking-tighter tabular-nums text-zinc-900 dark:text-white leading-none">
                            {formatTime(timeLeft)}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium mt-1 pl-0.5">
                            {isActive ? 'In Session' : 'Ready'}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={toggleTimer}
                            className={cn(
                                "w-10 h-10 flex items-center justify-center rounded-xl text-white shadow-lg shadow-blue-500/10 active:scale-95 transition-all",
                                selectedMode.color
                            )}
                        >
                            {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current pl-0.5" />}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600 active:scale-95 transition-all"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={false}
                        animate={{ width: `${progress}%` }}
                        className={cn("h-full rounded-full", selectedMode.color)}
                        transition={{ ease: "linear", duration: 1 }}
                    />
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between text-[10px] font-medium text-zinc-500">
                    <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded-md">
                        <Zap className={cn("w-3 h-3", selectedMode.xp > 0 ? "text-yellow-500 fill-yellow-500" : "text-zinc-400")} />
                        <span>+{selectedMode.xp > 0 ? selectedMode.xp : 0} XP</span>
                    </div>
                    {sessionCount > 0 && (
                        <div className="flex items-center gap-1 text-orange-500">
                            <Flame className="w-3 h-3 fill-current" />
                            <span>{sessionCount}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Mode Description */}
            {!isActive && timeLeft === selectedMode.duration && (
                <div className="text-[10px] text-center text-zinc-400 italic">
                    "{selectedMode.description}"
                </div>
            )}
        </div>
    )
}
