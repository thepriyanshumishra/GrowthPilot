"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { GlassCard } from "@/components/GlassCard"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, HelpCircle, Building2, Zap, Rocket, Star } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFF] dark:bg-black overflow-hidden font-geist">
            <Navbar />

            <section className="pt-44 pb-20 px-4 container mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider mb-8"
                >
                    <Zap className="w-3.5 h-3.5" />
                    Transparent Pricing
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-zinc-900 dark:text-white">
                    Start Your Growth <br /> <span className="text-green-600">For Free.</span>
                </h1>
                <p className="text-zinc-500 text-xl max-w-2xl mx-auto mb-10">
                    We're currently in Public Beta. That means you get all our premium features for $0.
                </p>

                {/* Monthly/Yearly Toggle (Visual Only for now) */}
                <div className="flex justify-center items-center gap-4 mb-12">
                    <span className="text-zinc-400 font-bold text-sm">Monthly</span>
                    <div className="w-14 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 cursor-pointer flex justify-start">
                        <motion.div className="w-6 h-6 bg-white rounded-full shadow-sm" layout transition={{ type: "spring", stiffness: 700, damping: 30 }} />
                    </div>
                    <span className="text-zinc-900 dark:text-white font-bold text-sm flex items-center gap-2">
                        Yearly <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Save 20%</span>
                    </span>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-32 container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {/* FREE TIER */}
                    <GlassCard className="p-10 flex flex-col justify-between border-t-4 border-t-zinc-200">
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-zinc-500">Starter</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-zinc-900 dark:text-white">$0</span>
                                <span className="text-zinc-500 font-medium text-sm">/forever</span>
                            </div>
                            <p className="text-sm text-zinc-500 mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-8">
                                Perfect for students and casual learners exploring new topics.
                            </p>
                            <ul className="space-y-4 text-sm">
                                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-white" /> 1 Active Roadmap</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-white" /> Basic AI Profiling</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-white" /> 5 Daily Tasks / Week</li>
                                <li className="flex gap-3 opactiy-50 text-zinc-400"><XCircle className="w-4 h-4" /> No Voice Mode</li>
                                <li className="flex gap-3 opactiy-50 text-zinc-400"><XCircle className="w-4 h-4" /> Community Support Only</li>
                            </ul>
                        </div>
                        <Button variant="outline" className="w-full mt-8" disabled>Coming Soon</Button>
                    </GlassCard>

                    {/* EXPERT TIER (Beta Highlight) */}
                    <GlassCard className="p-10 relative flex flex-col justify-between border-t-4 border-t-blue-600 bg-blue-50/50 dark:bg-blue-900/10 scale-105 shadow-2xl z-10">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                            Current Beta Status
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-600">Growth Copilot</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-black text-zinc-900 dark:text-white">$0</span>
                                <span className="text-zinc-500 font-medium text-sm line-through">($19/mo)</span>
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 border-b border-zinc-200 dark:border-zinc-700 pb-8">
                                Full access to our pro suite for serious career growth.
                            </p>
                            <ul className="space-y-4 text-sm font-medium">
                                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-blue-600" /> <strong>Unlimited</strong> AI Roadmaps</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-blue-600" /> <strong>Llama-3 70B</strong> Personalized Coach</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Unlimited Daily Tasks</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-blue-600" /> <strong>Voice Mode</strong> Interview Practice</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Resume & Portfolio Review</li>
                            </ul>
                        </div>
                        <Link href="/auth/signup">
                            <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white h-12 font-bold shadow-lg shadow-blue-500/25">
                                Join Beta Now
                            </Button>
                        </Link>
                        <p className="text-center text-[10px] text-zinc-400 mt-3">Limited time offer for early adopters</p>
                    </GlassCard>

                    {/* TEAM TIER */}
                    <GlassCard className="p-10 flex flex-col justify-between border-t-4 border-t-purple-600">
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-purple-600">Team / Squad</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-zinc-900 dark:text-white">$49</span>
                                <span className="text-zinc-500 font-medium text-sm">/mo</span>
                            </div>
                            <p className="text-sm text-zinc-500 mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-8">
                                For bootcamps, universities, and engineering teams.
                            </p>
                            <ul className="space-y-4 text-sm">
                                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Everything in Copilot</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Team Analytics Dashboard</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Shared Goals & Leaderboards</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Dedicated Success Manager</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Bulk Seat Management</li>
                            </ul>
                        </div>
                        <Link href="mailto:sales@growthpilot.ai" className="w-full mt-8">
                            <Button variant="outline" className="w-full">Contact Sales</Button>
                        </Link>
                    </GlassCard>
                </div>
            </section>

            {/* Enterprise Section */}
            <section className="py-24 bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto px-4 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-4 max-w-xl">
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> Enterprise
                        </div>
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Upskill your entire workforce?</h2>
                        <p className="text-lg text-zinc-500">
                            We offer custom API integrations, SSO, and private LLM instances for large organizations looking to accelerate their talent density.
                        </p>
                    </div>
                    <Button size="lg" className="bg-zinc-900 dark:bg-white text-white dark:text-black">
                        Schedule a Demo
                    </Button>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 max-w-3xl mx-auto container px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black tracking-tight mb-4">Frequently Asked Questions</h2>
                    <p className="text-zinc-500">Everything you need to know about our pricing and beta program.</p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {[
                        { q: "How long will the beta stay free?", a: "We plan to keep the public beta free for at least 6 months. Early adopters who sign up now will receive a lifetime discount when we launch paid plans." },
                        { q: "Is a credit card required?", a: "No. You can sign up and verify your email to get instant access. No credit card required." },
                        { q: "Can I upgrade to the Team plan later?", a: "Yes, you can upgrade your workspace to a Team plan at any time from the settings dashboard. We also offer easy migration tools." },
                        { q: "What happens to my data if I cancel?", a: "You can export all your roadmaps and progress data at any time. If you delete your account, we permanently wipe all your personal data from our servers." }
                    ].map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-b border-zinc-200 dark:border-zinc-800">
                            <AccordionTrigger className="text-left font-bold text-lg py-6 hover:no-underline hover:text-blue-600 transition-colors">
                                {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-zinc-500 leading-relaxed pb-6 text-base">
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            <Footer />
        </main>
    )
}
