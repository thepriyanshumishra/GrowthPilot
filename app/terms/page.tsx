"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { GlassCard } from "@/components/GlassCard"
import { Scale } from "lucide-react"

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFF] dark:bg-black overflow-hidden font-geist">
            <Navbar />
            <section className="pt-44 pb-32 px-4 container mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-8">
                        <Scale className="w-3.5 h-3.5" />
                        Legal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white">
                        Terms of Service
                    </h1>
                    <p className="text-zinc-500">Last updated: February 20, 2026</p>
                </div>

                <GlassCard className="p-12 space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">1. Agreement to Terms</h2>
                    <p>
                        By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">2. Intellectual Property</h2>
                    <p>
                        The Service and its original content, features and functionality are and will remain the exclusive property of GrowthPilot and its licensors.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">3. Termination</h2>
                    <p>
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </GlassCard>
            </section>
            <Footer />
        </main>
    )
}
