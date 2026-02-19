import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { GlassCard } from "@/components/GlassCard"
import { Shield, Trophy, Zap, Star } from "lucide-react"

export default async function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params
    const user = await prisma.user.findUnique({
        where: { username },
        include: { profile: true, roadmap: { include: { milestones: true } } }
    })

    if (!user) notFound()

    const xp = user.profile?.xp || 0
    const level = Math.floor(xp / 1000) + 1

    return (
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-black font-geist py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-purple-600 p-[3px] shadow-2xl">
                        <div className="w-full h-full rounded-[2.3rem] bg-white dark:bg-zinc-950 flex items-center justify-center overflow-hidden border-4 border-white dark:border-zinc-900">
                            {user.image ? (
                                <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600">
                                    {user.name?.[0].toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-2 justify-center">
                            {user.name} <Shield className="w-6 h-6 text-blue-500" />
                        </h1>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">LVL {level} {user.profile?.targetRole || "GrowthPilot Explorer"}</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-wider border border-blue-500/20">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            Elite Member
                        </div>
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 text-orange-600 rounded-2xl text-[11px] font-black uppercase tracking-wider border border-orange-500/20">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            {user.profile?.streak || 0} Day Streak
                        </div>
                    </div>
                </div>

                {/* Proof of Work Card */}
                <GlassCard className="p-10 rounded-[3rem] border-none shadow-2xl space-y-8 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic">Mission: {user.roadmap?.title}</h2>
                            <p className="text-zinc-500 max-w-lg font-medium">{user.roadmap?.description}</p>
                        </div>
                        <Trophy className="w-10 h-10 text-yellow-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {user.roadmap?.milestones.map((m: any) => (
                            <div key={m.id} className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 relative overflow-hidden group">
                                <div className={`absolute top-0 left-0 w-1 h-full ${m.status === 'COMPLETED' ? 'bg-green-500' : 'bg-zinc-300'}`} />
                                <h4 className={`font-black text-sm tracking-tight ${m.status === 'COMPLETED' ? 'text-zinc-400' : ''}`}>{m.title}</h4>
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-2 block">{m.status}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                <div className="text-center">
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">GrowthPilot Verified Tactical Portfolio v1.0</p>
                </div>
            </div>
        </div>
    )
}
