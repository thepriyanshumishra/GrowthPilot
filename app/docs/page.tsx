"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { GlassCard } from "@/components/GlassCard"
import { FileText } from "lucide-react"

export default function DocsPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFF] dark:bg-black overflow-hidden font-sans">
            <Navbar />
            <section className="pt-44 pb-32 px-4 container mx-auto max-w-4xl text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-8">
                    <FileText className="w-3.5 h-3.5" />
                    Knowledge Base
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-zinc-900 dark:text-white">
                    Documentation.
                </h1>
                <GlassCard className="text-center p-12 space-y-6">
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                        Our full documentation portal is currently under construction as we prepare for our public launch.
                    </p>
                    <p className="text-zinc-500">
                        In the meantime, our <span className="font-bold text-blue-600">How It Works</span> page covers the core concepts.
                    </p>
                </GlassCard>
            </section>
            <Footer />
        </main>
    )
}
