"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { GlassCard } from "@/components/GlassCard"
import { Button } from "@/components/ui/button"
import { Users, Heart, Target, Rocket, Globe } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFF] dark:bg-black overflow-hidden font-geist">
            <Navbar />

            <section className="pt-44 pb-20 px-4 container mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-8"
                >
                    <Users className="w-3.5 h-3.5" />
                    Our Story
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-zinc-900 dark:text-white">
                    Democratizing <br /> <span className="text-blue-600">Career Mentorship.</span>
                </h1>
                <p className="text-zinc-500 text-xl max-w-2xl mx-auto mb-12">
                    We believe that high-quality career guidance shouldn't be a luxury. It should be accessible to everyone, everywhere.
                </p>
            </section>

            {/* Mission Statement */}
            <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Why we built GrowthPilot</h2>
                            <p className="text-lg text-zinc-500 leading-relaxed">
                                The modern career landscape is overwhelming. New technologies emerge every week. Job descriptions are vague. And traditional education is often years behind industry needs.
                            </p>
                            <p className="text-lg text-zinc-500 leading-relaxed">
                                We built GrowthPilot to bridge this gap. By leveraging the reasoning capabilities of Llama-3, we can provide the same level of personalized, actionable guidance that a $500/hr career coach would provide — instantly and for free.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-3 h-40">
                                <Target className="w-8 h-8 text-blue-600" />
                                <div className="font-bold text-2xl">10k+</div>
                                <div className="text-xs text-zinc-500 uppercase font-bold">Roadmaps Generated</div>
                            </GlassCard>
                            <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-3 h-40 mt-8">
                                <Globe className="w-8 h-8 text-green-600" />
                                <div className="font-bold text-2xl">50+</div>
                                <div className="text-xs text-zinc-500 uppercase font-bold">Countries Reached</div>
                            </GlassCard>
                            <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-3 h-40 -mt-8">
                                <Rocket className="w-8 h-8 text-purple-600" />
                                <div className="font-bold text-2xl">1M+</div>
                                <div className="text-xs text-zinc-500 uppercase font-bold">Tasks Completed</div>
                            </GlassCard>
                            <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-3 h-40">
                                <Heart className="w-8 h-8 text-red-600" />
                                <div className="font-bold text-2xl">4.9/5</div>
                                <div className="text-xs text-zinc-500 uppercase font-bold">User Satisfaction</div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black tracking-tight mb-4">Our Core Values</h2>
                    <p className="text-zinc-500">The principles that guide every feature we build.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "User Obsession", desc: "We don't build features. We solve problems. Every line of code must directly improve your career outcome." },
                        { title: " Radical Transparency", desc: "No hidden fees. No dark patterns. We are open about our pricing, our roadmap, and our mistakes." },
                        { title: "AI for Good", desc: "We believe AI should empower humans, not replace them. our tools are designed to augment your natural intelligence." }
                    ].map((val, i) => (
                        <div key={i} className="p-8 border-l-4 border-blue-600 bg-zinc-50 dark:bg-zinc-900">
                            <h3 className="text-xl font-bold mb-4">{val.title}</h3>
                            <p className="text-zinc-500 leading-relaxed text-sm">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team Section (Placeholder) */}
            <section className="py-24 bg-zinc-900 text-white text-center">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold mb-16">Meet the Builders</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                        {[
                            { name: "Priyanshu Mishra", role: "Founder & Lead Engineer", img: "https://github.com/thepriyanshumishra.png" },
                            { name: "AI Agent", role: "Co-Founder (Literally)", img: "https://i.pravatar.cc/150?u=ai" },
                            { name: "Open Source", role: "Community", img: "https://i.pravatar.cc/150?u=os" }
                        ].map((member, i) => (
                            <div key={i} className="flex flex-col items-center space-y-4 group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-800 group-hover:border-blue-600 transition-colors">
                                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{member.name}</h3>
                                    <div className="text-zinc-500 text-sm uppercase tracking-widest">{member.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 text-center">
                <h2 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">Join our mission.</h2>
                <div className="flex justify-center gap-4">
                    <Link href="/contact">
                        <Button className="h-14 px-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90 text-lg font-bold">
                            Work With Us
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    )
}
