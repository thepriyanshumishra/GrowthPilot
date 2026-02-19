"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { addXP } from "@/app/actions/gamification"
import { toast } from "sonner"

export type TimerMode = {
    id: string
    name: string
    duration: number
    xp: number
    color: string
    description: string
}

export const TIMER_MODES: TimerMode[] = [
    { id: "pomodoro", name: "Pomodoro", duration: 25 * 60, xp: 25, color: "bg-blue-600", description: "Classic 25m focus" },
    { id: "shortBox", name: "Short Burst", duration: 15 * 60, xp: 10, color: "bg-indigo-500", description: "Quick 15m task" },
    { id: "deepWork", name: "Deep Work", duration: 45 * 60, xp: 50, color: "bg-purple-600", description: "Intense 45m session" },
    { id: "rule135", name: "1-3-5 Rule", duration: 90 * 60, xp: 100, color: "bg-rose-600", description: "90m Major Task" },
    { id: "breakShort", name: "Short Break", duration: 5 * 60, xp: 0, color: "bg-green-500", description: "5m relax" },
    { id: "breakLong", name: "Long Break", duration: 15 * 60, xp: 0, color: "bg-emerald-600", description: "15m recharge" },
]

type FocusContextType = {
    selectedMode: TimerMode
    timeLeft: number // in seconds
    isActive: boolean
    sessionCount: number
    toggleTimer: () => void
    resetTimer: () => void
    handleModeSelect: (mode: TimerMode) => void
    formatTime: (seconds: number) => string
    progress: number
}

const FocusContext = createContext<FocusContextType | undefined>(undefined)

export function FocusProvider({ children }: { children: ReactNode }) {
    const [selectedMode, setSelectedMode] = useState<TimerMode>(TIMER_MODES[0])
    const [timeLeft, setTimeLeft] = useState(selectedMode.duration)
    const [isActive, setIsActive] = useState(false)
    const [sessionCount, setSessionCount] = useState(0)

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, timeLeft])

    // Separate effect for completion to avoid lint warnings and separate concerns
    useEffect(() => {
        if (timeLeft === 0 && isActive) {
            setIsActive(false)
            if (selectedMode.xp > 0) {
                setSessionCount(prev => prev + 1)
                addXP(selectedMode.xp).then((res) => {
                    if (res.success) {
                        toast.success(`Session Complete! +${selectedMode.xp} XP Earned`)
                    }
                })
            } else {
                toast.info("Break complete! Ready to focus?")
            }
        }
    }, [timeLeft, isActive, selectedMode.xp])

    const handleModeSelect = (mode: TimerMode) => {
        setSelectedMode(mode)
        setIsActive(false)
        setTimeLeft(mode.duration)
    }

    const toggleTimer = () => setIsActive(!isActive)

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(selectedMode.duration)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const progress = ((selectedMode.duration - timeLeft) / selectedMode.duration) * 100

    return (
        <FocusContext.Provider value={{
            selectedMode,
            timeLeft,
            isActive,
            sessionCount,
            toggleTimer,
            resetTimer,
            handleModeSelect,
            formatTime,
            progress
        }}>
            {children}
        </FocusContext.Provider>
    )
}

export function useFocus() {
    const context = useContext(FocusContext)
    if (context === undefined) {
        throw new Error("useFocus must be used within a FocusProvider")
    }
    return context
}
