"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { GlassCard } from "@/components/GlassCard"
import { Shield } from "lucide-react"

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFF] dark:bg-black overflow-hidden font-geist">
            <Navbar />
            <section className="pt-44 pb-32 px-4 container mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-8">
                        <Shield className="w-3.5 h-3.5" />
                        Legal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white">
                        Privacy Policy
                    </h1>
                    <p className="text-zinc-500">Last updated: February 20, 2026</p>
                </div>

                <GlassCard className="p-12 space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">1. Introduction</h2>
                    <p>
                        Welcome to GrowthPilot. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">2. Data We Collect</h2>
                    <p>
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows: Identity Data, Contact Data, Technical Data, and Usage Data.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">3. How We Use Your Data</h2>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: Where we need to perform the contract we are about to enter into or have entered into with you.
                    </p>
                </GlassCard>
            </section>
            <Footer />
        </main>
    )
}
