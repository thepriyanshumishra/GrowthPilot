"use client"

import { GlassCard } from "@/components/GlassCard"
import { Flame, Star } from "lucide-react"
import { motion } from "framer-motion"

interface ProfileHeaderProps {
    user: {
        name: string | null;
        image: string | null;
    };
    profile: {
        xp: number;
        streak: number;
        level?: number;
    } | null;
}

export function ProfileHeader({ user, profile }: ProfileHeaderProps) {
    const xp = profile?.xp || 0
    const level = Math.floor(xp / 1000) + 1
    const progress = (xp % 1000) / 10

    return (
        <header className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-12 w-full">
            <div className="flex gap-6 items-center">
                <div className="relative group">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-[2px] shadow-sm relative z-10"
                    >
                        <div className="w-full h-full rounded-[14px] bg-white dark:bg-zinc-950 flex items-center justify-center overflow-hidden">
                            {user.image ? (
                                <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-semibold text-blue-600">
                                    {user.name?.[0].toUpperCase() || "P"}
                                </span>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 z-20 bg-blue-600 text-white text-[11px] font-bold w-9 h-9 rounded-xl border-4 border-white dark:border-zinc-900 flex flex-col items-center justify-center shadow-lg leading-none"
                    >
                        {level}
                    </motion.div>
                </div>

                <div className="space-y-1">
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                        {user.name?.split(' ')[0] || 'Explorer'}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg text-xs font-medium border border-zinc-200/50 dark:border-zinc-700/50">
                            <Flame className="w-3.5 h-3.5" />
                            {profile?.streak || 0} Day Streak
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium border border-blue-100 dark:border-blue-800/30">
                            <Star className="w-3.5 h-3.5" />
                            Elite Member
                        </div>
                    </div>
                </div>
            </div>

            <GlassCard className="w-full md:w-80 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm bg-white/80 dark:bg-zinc-900/50 backdrop-blur-3xl">
                <div className="flex justify-between items-end mb-4">
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Experience</span>
                        <div className="text-xl font-semibold text-zinc-900 dark:text-white leading-none">
                            {xp % 1000} <span className="text-xs text-zinc-400 font-normal">/ 1000 XP</span>
                        </div>
                    </div>
                </div>

                <div className="relative h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-blue-600 rounded-full"
                    />
                </div>

                <div className="flex justify-between mt-3 px-0.5">
                    <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Level {level}</span>
                    <span className="text-[10px] font-medium text-blue-600 uppercase tracking-wider">Level {level + 1}</span>
                </div>
            </GlassCard>
        </header>
    )
}
