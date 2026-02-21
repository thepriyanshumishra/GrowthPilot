import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/server-auth"
import { GlassCard } from "@/components/GlassCard"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
    Map as MapIcon,
} from "lucide-react"
import { redirect } from "next/navigation"
import { RegenerateRoadmapButton } from "@/components/dashboard/RegenerateRoadmapButton"
import { MilestoneCard } from "@/components/roadmap/MilestoneCard"

export default async function RoadmapPage() {
    const user = await getServerUser()
    if (!user) return redirect("/")

    const roadmap = await prisma.roadmap.findFirst({
        where: { userId: user.id },
        include: { milestones: true }
    })

    if (!roadmap) {
        return (
            <div className="font-sans min-h-screen flex flex-col items-center justify-center p-4">
                <GlassCard className="max-w-md p-8 text-center space-y-6 bg-white/50 backdrop-blur-xl border-zinc-200 shadow-xl">
                    <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <MapIcon className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900">No Roadmap Found</h1>
                    <p className="text-zinc-500">Initialize your career mission to generate a strategic map.</p>
                    <Button className="clay-btn-primary w-full h-12 rounded-xl font-bold transition-all">Initialize Mission</Button>
                </GlassCard>
            </div>
        )
    }

    const milestones = roadmap.milestones.sort((a: any, b: any) => a.order - b.order)
    const completedCount = milestones.filter((m: any) => m.status === 'COMPLETED').length
    const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0

    return (
        <div className="font-sans h-[calc(100vh-2rem)] md:h-[calc(100vh-2rem)] flex flex-col relative bg-[#F5F5F7] dark:bg-black rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl">
            {/* Ultra-Premium Glass Header */}
            <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between bg-white/60 dark:bg-black/60 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 h-14 md:h-16">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
                        <MapIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-xs md:text-sm font-semibold text-zinc-900 dark:text-white leading-none truncate">Strategic Roadmap</span>
                        <span className="text-[9px] md:text-[10px] font-medium text-zinc-500 flex items-center gap-1 mt-0.5 truncate">
                            {roadmap.title}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Mission Progress</span>
                        <div className="flex items-center gap-2">
                            <Progress value={progress} className="w-24 h-1.5" />
                            <span className="text-xs font-bold text-zinc-700 dark:text-white">{progress}%</span>
                        </div>
                    </div>
                    <RegenerateRoadmapButton />
                </div>
            </div>

            {/* Main Scroll Area */}
            <ScrollArea className="flex-1 w-full bg-[#FAFAFA] dark:bg-black">
                <div className="max-w-4xl mx-auto w-full px-4 md:px-6 pt-20 md:pt-28 pb-32 md:pb-40">
                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[27px] md:left-[27px] top-4 bottom-4 w-[2px] bg-zinc-200 dark:bg-zinc-800" />

                        <div className="space-y-8 md:space-y-12">
                            {milestones.map((milestone, index) => {
                                const isCompleted = milestone.status === 'COMPLETED'
                                const isCurrent = milestone.status === 'IN_PROGRESS' || (!isCompleted && index === 0) || (milestones[index - 1]?.status === 'COMPLETED' && !isCompleted)
                                const isLocked = !isCompleted && !isCurrent

                                return (
                                    <MilestoneCard
                                        key={milestone.id}
                                        milestone={milestone}
                                        index={index}
                                        isCompleted={isCompleted}
                                        isCurrent={isCurrent}
                                        isLocked={isLocked}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
