"use client"

import { useEffect } from "react"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { GlassCard } from "@/components/GlassCard"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    GraduationCap,
    Search,
    Briefcase,
    PenTool,
    Play,
    Sparkles
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

const careerStages = [
    {
        icon: <GraduationCap className="w-5 h-5 text-blue-500" />,
        title: "For Students",
        description: "Crush your first job hunt by turning industry requirements into interactive study guides and projects."
    },
    {
        icon: <Search className="w-5 h-5 text-purple-500" />,
        title: "For Job Seekers",
        description: "Analyze market trends, extract key skills from job descriptions, and organize cross-role insights effortlessly."
    },
    {
        icon: <Briefcase className="w-5 h-5 text-green-500" />,
        title: "For Professionals",
        description: "Stay ahead in your field by summarizing long industry reports and staying sharp on emerging tech knowledge."
    },
    {
        icon: <PenTool className="w-5 h-5 text-orange-500" />,
        title: "For Career Switchers",
        description: "Synthesize background experience and brainstorming notes into clear, structured career pivot outlines."
    }
]

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push("/dashboard");
        }
    }, [user, loading, router]);

    if (loading) return null;

    return (
        <main className="min-h-screen bg-[#FDFDFF] dark:bg-black overflow-hidden font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 px-4 container mx-auto flex flex-col items-center text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] md:h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent blur-[80px] md:blur-[120px] -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-8"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    100% Free During Beta
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1] md:leading-[1.05] max-w-4xl mb-6 md:mb-8"
                >
                    Turn Chaos Into <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Growth Roadmaps.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12"
                >
                    GrowthPilot uses Llama-3.3-70B to instantly convert your career goals into personalized, structured learning paths, daily tasks, and interactive AI coaching.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4 sm:px-0"
                >
                    {user ? (
                        <Link href="/dashboard">
                            <Button className="clay-btn-primary h-14 px-10 rounded-2xl text-lg font-bold w-full sm:w-auto">
                                Go to Dashboard
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/auth/signup" className="w-full sm:w-auto">
                            <Button
                                className="clay-btn-primary h-14 px-10 rounded-2xl text-lg font-bold w-full sm:w-auto"
                            >
                                Start Learning Free
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    )}
                    <Button variant="outline" className="clay-btn h-14 px-10 rounded-2xl border-none text-lg font-bold w-full sm:w-auto text-zinc-800 dark:text-zinc-200">
                        <Play className="mr-2 w-5 h-5 fill-current" />
                        Watch Demo
                    </Button>
                </motion.div>
            </section>

            {/* Designed for Every Learning Style */}
            <section className="py-16 md:py-24 container mx-auto px-6 max-w-6xl">
                <div className="text-center space-y-4 mb-12 md:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
                        Designed for every <br className="hidden sm:block" />
                        <span className="text-blue-600 italic">career stage.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {careerStages.map((stage, i) => (
                        <GlassCard key={i} className="p-6 flex flex-col items-center text-center space-y-4 group hover:border-blue-500/30 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform">
                                {stage.icon}
                            </div>
                            <h4 className="font-bold text-zinc-900 dark:text-white">{stage.title}</h4>
                            <p className="text-zinc-500 text-xs leading-relaxed">{stage.description}</p>
                        </GlassCard>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 md:py-32 container mx-auto px-4 max-w-5xl mb-12">
                <GlassCard className="p-8 py-12 md:p-24 relative overflow-hidden text-center space-y-6 md:space-y-8">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 md:w-64 md:h-64 bg-blue-600/20 blur-[60px] md:blur-[80px]" />
                    <div className="mx-auto w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-xl shadow-blue-500/40">
                        <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight relative z-10">
                        Ready to master your <br className="hidden sm:block" /> career path?
                    </h2>
                    <p className="text-zinc-500 text-base md:text-lg relative z-10 max-w-xl mx-auto px-2">
                        Join thousands of students and researchers who are transforming their study workflow with GrowthPilot AI.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-6 md:pt-8 relative z-10 px-4 sm:px-0">
                        <Link href="/onboarding" className="w-full sm:w-auto">
                            <Button className="clay-btn-primary h-12 md:h-14 px-8 md:px-10 rounded-2xl text-base md:text-lg font-bold w-full">
                                Get Started for Free
                            </Button>
                        </Link>
                        <Link href="/auth/login" className="w-full sm:w-auto">
                            <Button variant="outline" className="clay-btn border-none h-12 md:h-14 px-8 md:px-10 rounded-2xl text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 w-full">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                    <p className="text-blue-600 font-semibold text-[10px] md:text-xs pt-4 uppercase tracking-widest px-4">
                        Limited time offer: All features are 100% free during our public beta.
                    </p>
                </GlassCard>
            </section>

            <Footer />
        </main>
    )
}
