import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/server-auth"
import { GlassCard } from "@/components/GlassCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    CheckCircle2,
    Clock,
    Flame,
    Trophy,
    Zap,
    Star,
    Bot,
    ArrowRight
} from "lucide-react"
import { TimeChart, SkillRadar } from "@/components/dashboard/Charts"
import { TaskList } from "@/components/dashboard/TaskList"
import { MilestoneList } from "@/components/dashboard/MilestoneList"
import Link from "next/link"
import * as motion from "framer-motion/client"
import quotes from "@/lib/quotes.json"

export default async function Dashboard() {
    const user = await getServerUser()
    if (!user) return <div>Please sign in</div>

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
    const roadmap = await prisma.roadmap.findFirst({
        where: { userId: user.id },
        include: { milestones: true }
    })
    const tasks = await prisma.task.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    })

    const milestones = roadmap?.milestones || []
    const completedMilestones = milestones.filter((m: any) => m.status === 'COMPLETED').length
    const progress = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0

    const timeData = [
        { name: 'Mon', value: 40 },
        { name: 'Tue', value: 70 },
        { name: 'Wed', value: 45 },
        { name: 'Thu', value: 90 },
        { name: 'Fri', value: 65 },
        { name: 'Sat', value: 30 },
        { name: 'Sun', value: 80 },
    ]

    const radarData = (profile?.skills || []).slice(0, 5).map((skill: string, i: number) => ({
        name: skill.toUpperCase(),
        value: 60 + ((skill.length * 5) + (i * 10)) % 40 // Deterministic visual data
    }))

    // Random Quote for every visit
    const quoteIndex = Math.floor(Math.random() * quotes.length)
    const randomQuote = quotes[quoteIndex]

    return (
        <div className="min-h-screen font-geist selection:bg-blue-500/30 pb-20">
            <main className="space-y-6 md:space-y-8">
                {/* 1. HUD Area: Profile & Quick Stats - Asymmetric 8:4 Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <GlassCard className="lg:col-span-8 p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[250px] md:min-h-[280px] group border-zinc-200/50 dark:border-zinc-800/50">
                        <div className="absolute top-0 right-0 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-[80px] rounded-full pointer-events-none -z-0 transition-transform duration-700 group-hover:scale-110" />

                        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full sm:w-auto text-center sm:text-left">
                                <div className="relative">
                                    <div className="w-20 h-20 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 p-1 shadow-inner">
                                        <div className="w-full h-full rounded-xl overflow-hidden bg-white dark:bg-black">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name || "Pilot"} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-300">
                                                    {user.name?.[0] || "P"}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 sm:-right-2 sm:-bottom-2 left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg border-2 border-white dark:border-zinc-900 whitespace-nowrap">
                                        LVL {Math.floor((profile?.xp || 0) / 1000) + 1}
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-0">
                                    <div className="flex flex-col sm:flex-row items-center gap-2 mb-1">
                                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                            Hello, {user.name?.split(' ')[0]}
                                        </h1>
                                        <Badge variant="secondary" className="text-[10px] font-bold bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200/20">
                                            PRO
                                        </Badge>
                                    </div>
                                    <p className="text-zinc-500 font-medium text-sm md:text-base">Ready to deploy? Your mission objectives are updated.</p>
                                </div>
                            </div>

                            <div className="hidden sm:block text-right space-y-1">
                                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Current Streak</div>
                                <div className="text-2xl md:text-2xl font-black text-zinc-900 dark:text-white flex items-center justify-end gap-2">
                                    <Flame className="w-5 h-5 md:w-6 md:h-6 text-orange-500 fill-orange-500" />
                                    {profile?.streak || 0} <span className="text-xs md:text-sm font-medium text-zinc-400">days</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                            <div className="p-3 md:p-4 rounded-xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 backdrop-blur-sm flex sm:flex-col justify-between items-center sm:items-start">
                                <div className="text-xs text-zinc-500 font-medium sm:mb-1">Total XP</div>
                                <div className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white">{profile?.xp?.toLocaleString() || 0}</div>
                            </div>
                            <div className="p-3 md:p-4 rounded-xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 backdrop-blur-sm flex sm:flex-col justify-between items-center sm:items-start">
                                <div className="text-xs text-zinc-500 font-medium sm:mb-1">Focus Time</div>
                                <div className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white">12h 30m</div>
                            </div>
                            <div className="p-3 md:p-4 rounded-xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 backdrop-blur-sm flex sm:flex-col justify-between items-center sm:items-start">
                                <div className="text-xs text-zinc-500 font-medium sm:mb-1">Tasks Done</div>
                                <div className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white">{tasks.filter((t: any) => t.status === 'DONE').length}</div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="lg:col-span-4 p-6 flex flex-col justify-between bg-zinc-900 text-white border-zinc-800 relative overflow-hidden group min-h-[200px] md:min-h-auto">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                        <div className="absolute -top-10 -right-10 md:-top-20 md:-right-20 w-48 h-48 md:w-64 md:h-64 bg-blue-500/30 blur-[60px] rounded-full pointer-events-none" />

                        <div className="relative z-10 hidden md:block">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/50">
                                    <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Next Milestone</span>
                                    <span className="text-sm font-bold mt-1">Deploy MVP</span>
                                </div>
                            </div>

                            <h3 className="text-lg md:text-2xl font-medium leading-tight mb-2">
                                "{randomQuote.quote}"
                            </h3>
                            <p className="text-zinc-400 text-sm italic">— {randomQuote.author}</p>
                        </div>

                        <div className="relative z-10 mt-4 md:mt-6">
                            <h3 className="text-lg font-medium leading-tight mb-2 md:hidden italic text-zinc-300">
                                "{randomQuote.quote}"
                            </h3>
                            <Link href="/focus">
                                <Button className="clay-btn w-full border-none h-11 md:h-12 text-xs md:text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100">
                                    ENTER FOCUS MODE <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </GlassCard>
                </div>

                {/* 2. Mission Control: Asymmetric 4:8 Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Vertical Stack (Tasks & Actions) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <GlassCard className="p-5 md:p-6 h-[400px] md:h-[500px] flex flex-col relative overflow-hidden border-zinc-200/60 dark:border-zinc-800/60 order-2 lg:order-1">
                            <div className="flex items-center justify-between mb-4 md:mb-6 shrink-0 relative z-10">
                                <h3 className="text-base md:text-lg font-bold tracking-tight flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                                    Active Quests
                                </h3>
                                <Badge variant="outline" className="font-mono text-[10px]">{tasks.filter((t: any) => t.status !== 'DONE').length} PENDING</Badge>
                            </div>
                            <ScrollArea className="flex-1 -mr-4 pr-4 relative z-10">
                                <TaskList initialTasks={tasks} />
                            </ScrollArea>
                            {/* Decorative blur */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 md:w-48 md:h-48 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
                        </GlassCard>

                        <div className="grid grid-cols-2 gap-3 md:gap-4 order-1 lg:order-2">
                            <Link href="/chat" className="block group">
                                <GlassCard className="p-4 md:p-5 h-28 md:h-32 flex flex-col justify-between hover:border-blue-500/30 transition-all hover:-translate-y-1">
                                    <Bot className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                                    <div>
                                        <div className="text-sm font-bold text-zinc-900 dark:text-white">AI Coach</div>
                                        <div className="text-[10px] text-zinc-500 font-medium mt-0.5">Tactical Analysis</div>
                                    </div>
                                </GlassCard>
                            </Link>
                            <Link href="/squad" className="block group">
                                <GlassCard className="p-5 h-32 flex flex-col justify-between hover:border-purple-500/30 transition-all hover:-translate-y-1">
                                    <Trophy className="w-8 h-8 text-purple-600" />
                                    <div>
                                        <div className="text-sm font-bold text-zinc-900 dark:text-white">Squad</div>
                                        <div className="text-[10px] text-zinc-500 font-medium mt-0.5">Global Rank #42</div>
                                    </div>
                                </GlassCard>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Strategic Map (Large) */}
                    <div className="lg:col-span-8 grid grid-cols-1 gap-6">
                        <GlassCard className="p-6 md:p-8 min-h-[350px] md:min-h-[400px] border-zinc-200/60 dark:border-zinc-800/60 relative overflow-hidden flex flex-col">
                            <div className="flex items-start md:items-center justify-between mb-6 md:mb-8 relative z-10 flex-col md:flex-row gap-4 md:gap-0">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{roadmap?.title || "Operation: Growth"}</h2>
                                        <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                    <p className="text-zinc-500 text-xs md:text-sm font-medium">Strategic Roadmap • Phase {milestones.filter((m: any) => m.status === 'COMPLETED').length + 1}</p>
                                </div>
                                <div className="text-left md:text-right flex md:block items-end gap-3 flex-row-reverse w-full md:w-auto justify-end">
                                    <div className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white leading-none">{progress}%</div>
                                    <div className="text-[10px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-wider md:mt-1 pb-1 md:pb-0">Mission Complete</div>
                                </div>
                            </div>

                            <div className="relative mb-6 md:mb-8 h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-full"
                                />
                            </div>

                            <div className="flex-1 relative z-10">
                                <MilestoneList milestones={milestones} className="h-full" />
                            </div>

                            {/* Background Decor */}
                            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none" />
                        </GlassCard>

                        {/* Analytics Strip */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <GlassCard className="p-6 h-[280px] flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Skill Matrix</h4>
                                    <Star className="w-4 h-4 text-zinc-400" />
                                </div>
                                <div className="flex-1 min-h-0">
                                    <SkillRadar data={radarData} />
                                </div>
                            </GlassCard>
                            <GlassCard className="p-6 h-[280px] flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Temporal Data</h4>
                                    <Clock className="w-4 h-4 text-zinc-400" />
                                </div>
                                <div className="flex-1 min-h-0">
                                    <TimeChart data={timeData} />
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
