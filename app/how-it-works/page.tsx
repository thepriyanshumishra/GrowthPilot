"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { GlassCard } from "@/components/GlassCard"
import { Button } from "@/components/ui/button"
import { Zap, CheckCircle2, TrendingUp, User, Cpu } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFF] dark:bg-black overflow-hidden font-geist">
            <Navbar />

            <section className="pt-32 pb-16 md:pt-44 md:pb-32 px-4 container mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-6 md:mb-8"
                >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Our Methodology
                </motion.div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 md:mb-8 text-zinc-900 dark:text-white leading-[1.1]">
                    Science of <br className="hidden sm:block" /> <span className="text-purple-600">Career Growth.</span>
                </h1>
                <p className="text-zinc-500 text-base md:text-xl max-w-2xl mx-auto mb-8 md:mb-12 px-2">
                    GrowthPilot combines proven educational psychology with state-of-the-art AI to create a learning loop that actually works.
                </p>
            </section>

            {/* Detailed Step-by-Step Visualization */}
            <section className="py-16 md:py-24 container mx-auto px-4 max-w-5xl space-y-24 md:space-y-32">
                {/* Step 1: Profiling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                    <div className="space-y-6">
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Phase 01</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">Deep Profiling</h2>
                        <p className="text-base md:text-lg text-zinc-500 leading-relaxed">
                            It starts with understanding YOU. Our AI doesn't just ask "What do you want to be?". It conducts a deep interview to understand:
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Your current skill proficiency (0-10)",
                                "Past project experience & github portfolio",
                                "Learning style (Visual, Text, Interactive)",
                                "Availability (Hours/Week)"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 flex-shrink-0 text-xs font-bold">{i + 1}</div>
                                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <GlassCard className="p-10 flex flex-col items-center justify-center min-h-[300px] border-purple-500/20">
                        <User className="w-16 h-16 text-purple-200 mb-6" />
                        <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-4 w-full max-w-xs space-y-3 border border-zinc-100 dark:border-zinc-800">
                            <div className="text-xs text-zinc-400 font-bold uppercase">Resume Parsing</div>
                            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1.5 }} className="h-full bg-purple-600" />
                            </div>
                            <div className="flex justify-between text-xs font-medium">
                                <span>Scanning...</span>
                                <span className="text-purple-600">Complete</span>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Step 2: Generation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                    <GlassCard className="order-2 md:order-1 p-8 md:p-10 flex flex-col items-center justify-center min-h-[250px] md:min-h-[300px] border-blue-500/20">
                        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                            <div className="bg-blue-600 text-white p-4 rounded-xl text-center shadow-lg transform -rotate-3">
                                <span className="block text-xl md:text-2xl font-bold mb-1">45</span>
                                <span className="text-[10px] uppercase font-bold opacity-80">Days</span>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl text-center shadow-lg border border-zinc-100 dark:border-zinc-800 transform rotate-3">
                                <span className="block text-xl md:text-2xl font-bold mb-1 text-zinc-900 dark:text-white">12</span>
                                <span className="text-[10px] uppercase font-bold text-zinc-400">Milestones</span>
                            </div>
                        </div>
                    </GlassCard>
                    <div className="space-y-6 order-1 md:order-2">
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Phase 02</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">Generative Synthesis</h2>
                        <p className="text-base md:text-lg text-zinc-500 leading-relaxed">
                            Using the Llama-3-70B parameter model, we synthesize your profile against thousands of job descriptions and industry standards to generate a bespoke curriculum.
                        </p>
                        <p className="text-base md:text-lg text-zinc-500 leading-relaxed">
                            This isn't a template. It's a graph of dependencies, ensuring you learn "React" only after you've mastered "JavaScript Closures".
                        </p>
                    </div>
                </div>

                {/* Step 3: Execution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                    <div className="space-y-6">
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Phase 03</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">Daily Execution Loop</h2>
                        <p className="text-base md:text-lg text-zinc-500 leading-relaxed">
                            A roadmap is useless without action. We break milestones down into atomic daily tasks that take &lt; 45 mins to complete.
                        </p>
                        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                            <h4 className="font-bold mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                The Growth Loop
                            </h4>
                            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                                <li>1. Receive Daily Task (Concept + Exercise)</li>
                                <li>2. Submit Proof of Work (Code, Text, Video)</li>
                                <li>3. AI Validates & Provides Feedback</li>
                                <li>4. Unlock XP & Proceed to Next Task</li>
                            </ul>
                        </div>
                    </div>
                    <GlassCard className="p-10 flex flex-col items-center justify-center min-h-[300px] border-amber-500/20 relative overflow-hidden">
                        <CheckCircle2 className="w-24 h-24 text-green-500 relative z-10" />
                        <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full transform scale-50 animate-pulse" />
                    </GlassCard>
                </div>
            </section>

            {/* Technical Underpinnings */}
            <section className="py-16 md:py-24 bg-zinc-950 text-white">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <Cpu className="w-10 h-10 md:w-12 md:h-12 text-blue-500 mx-auto mb-6 md:mb-8" />
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">Under the Hood</h2>
                    <p className="text-zinc-400 mb-8 md:mb-12 text-base md:text-lg px-2">GrowthPilot is built on a sophisticated stack of modern technologies.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {[
                            { title: "Llama-3 70B", desc: "Reasoning Engine" },
                            { title: "Groq Cloud", desc: "Low-Latency Inference" },
                            { title: "Supabase", desc: "Vector Database" },
                            { title: "Next.js 14", desc: "React Framework" }
                        ].map(tech => (
                            <div key={tech.title} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                                <div className="font-bold text-white mb-1">{tech.title}</div>
                                <div className="text-xs text-zinc-500 uppercase">{tech.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-24 text-center px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-zinc-900 dark:text-white">Experience the difference.</h2>
                <Link href="/auth/signup" className="block w-full sm:w-auto px-4 sm:px-0">
                    <Button className="clay-btn h-12 md:h-14 px-8 md:px-12 rounded-2xl text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 border-none transition-all active:scale-95 w-full sm:w-auto">
                        Start Your Journey
                    </Button>
                </Link>
            </section>

            <Footer />
        </main>
    )
}
