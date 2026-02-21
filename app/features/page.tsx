"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { GlassCard } from "@/components/GlassCard"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, BrainCircuit, CheckCircle2, Map, Sparkles, Target, TrendingUp, Zap, BarChart3, Clock, Share2, Shield, User } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFF] dark:bg-black overflow-hidden font-geist">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 md:pt-44 md:pb-20 px-4 container mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 md:mb-8"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    Product Tour
                </motion.div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 md:mb-8 text-zinc-900 dark:text-white leading-[1.1]">
                    The Complete <br className="hidden sm:block" /> <span className="text-blue-600">Career OS.</span>
                </h1>
                <p className="text-zinc-500 text-base md:text-xl max-w-2xl mx-auto mb-10 md:mb-12 px-2">
                    GrowthPilot isn't just a roadmap generator. It's a comprehensive operating system for your professional development, powered by next-gen AI.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4 sm:px-0">
                    <Link href="/auth/signup" className="w-full sm:w-auto">
                        <Button className="clay-btn-primary h-12 px-8 rounded-xl font-bold w-full">Try It Free</Button>
                    </Link>
                    <Link href="#deep-dive" className="w-full sm:w-auto">
                        <Button variant="ghost" className="clay-btn border-none h-12 px-8 rounded-xl font-bold text-zinc-900 dark:text-zinc-100 w-full">Learn More</Button>
                    </Link>
                </div>
            </section>

            {/* Feature Deep Dive 1: The Roadmap */}
            <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50" id="deep-dive">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                <Map className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white leading-tight">
                                Dynamic Roadmaps that <br className="hidden sm:block" /> <span className="text-blue-600">Adapt to You.</span>
                            </h2>
                            <p className="text-lg text-zinc-500 leading-relaxed">
                                Forget static PDFs. Our roadmaps are living documents. As you complete tasks and learn new skills, the AI recalculates your optimal path forward in real-time.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Instant generation based on your specific role & level",
                                    "Automatic milestone re-calibration",
                                    "Project-based learning nodes",
                                    "Estimated time-to-completion analytics"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <GlassCard className="p-8 relative min-h-[400px] flex items-center justify-center bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                            {/* Mock UI Visual */}
                            <div className="w-full space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="h-2 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30" />
                                </div>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full border-2 border-blue-600 bg-white dark:bg-zinc-900 z-10" />
                                            {i !== 3 && <div className="w-0.5 h-16 bg-blue-200 dark:bg-blue-900/30 -my-2" />}
                                        </div>
                                        <div className="flex-1 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mb-4">
                                            <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
                                            <div className="h-2 w-1/2 bg-zinc-100 dark:bg-zinc-800/50 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </section>

            {/* Feature Deep Dive 2: AI Coaching */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <GlassCard className="order-2 lg:order-1 p-8 relative min-h-[400px] flex items-center justify-center bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 overflow-hidden">
                            {/* Mock Chat UI */}
                            <div className="w-full space-y-4 relative z-10">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0" />
                                    <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-xs text-zinc-600 dark:text-zinc-400">
                                        Based on your goal to become a Senior Engineer, let's focus on System Design today. Ready?
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none max-w-[80%] text-xs text-white">
                                        Yes, let's do it. What's the first concept?
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex-shrink-0" />
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0" />
                                    <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-xs text-zinc-600 dark:text-zinc-400">
                                        Let's start with Horizontal Scaling. Here's a quick definition...
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-black z-0" />
                        </GlassCard>
                        <div className="space-y-8 order-1 lg:order-2">
                            <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                                <Bot className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white leading-tight">
                                Your 24/7 AI <br className="hidden sm:block" /> <span className="text-purple-600">Career Mentor.</span>
                            </h2>
                            <p className="text-lg text-zinc-500 leading-relaxed">
                                Stuck on a concept? Need interview prep? Or just need a resume review? Your AI coach has full context of your journey and is ready to help instantly.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Powered by Llama-3.3-70B for deep reasoning",
                                    "Context-aware: remembers your past goals & struggles",
                                    "Mock Interview Mode for role-play practice",
                                    "Resume Roast & Optimization engine"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid of Secondary Features */}
            <section className="py-16 md:py-24 bg-zinc-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Everything else you need to win.</h2>
                        <p className="text-zinc-400">We didn't stop at just roadmaps. We built a complete suite of tools to ensure you execute.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                icon: <Clock className="text-blue-400 w-8 h-8" />,
                                title: "Daily Briefings",
                                desc: "Start your day with a curated summary of tasks, industry news, and motivation."
                            },
                            {
                                icon: <BarChart3 className="text-green-400 w-8 h-8" />,
                                title: "Progress Analytics",
                                desc: "Visual charts tracking your XP, streak, and skill acquisition velocity over time."
                            },
                            {
                                icon: <Share2 className="text-purple-400 w-8 h-8" />,
                                title: "Squad Mode",
                                desc: "Share your roadmap with friends, compare progress, and keep each other accountable."
                            },
                            {
                                icon: <Shield className="text-red-400 w-8 h-8" />,
                                title: "Verification",
                                desc: " earn verifyable badges for completed milestones to showcase on LinkedIn."
                            },
                            {
                                icon: <BrainCircuit className="text-yellow-400 w-8 h-8" />,
                                title: "Focus Mode",
                                desc: "Built-in Pomodoro timer with lofi beats to help you stay in the flow state."
                            },
                            {
                                icon: <User className="text-pink-400 w-8 h-8" />,
                                title: "Expert Personas",
                                desc: "Switch your AI coach's personality: from 'Supportive Mentor' to 'Drill Sergeant'."
                            }
                        ].map((feat, i) => (
                            <div key={i} className="p-8 rounded-3xl clay-panel transition-colors hover:scale-[1.02]">
                                <div className="mb-6">{feat.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                                <p className="text-zinc-400 leading-relaxed text-sm">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-32 container mx-auto px-4 max-w-4xl text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Ready to upgrade your career?</h2>
                <Link href="/auth/signup" className="block w-full sm:w-auto px-4 sm:px-0">
                    <Button className="clay-btn h-12 md:h-14 px-8 md:px-12 rounded-2xl text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 border-none active:scale-95 transition-all w-full sm:w-auto">
                        Get Started Now
                    </Button>
                </Link>
            </section>

            <Footer />
        </main>
    )
}
