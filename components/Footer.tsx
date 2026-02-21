"use client"

import Link from "next/link"
import Image from "next/image"

export function Footer() {
    return (
        <footer className="clay-panel rounded-t-[3rem] mt-12 pt-24 pb-12 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-black/5 dark:border-white/5 pb-16">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/20 shadow-xl shadow-blue-500/10">
                            <Image src="/logo.png" alt="GrowthPilot" fill className="object-cover" />
                        </div>
                        <span className="text-xl font-black tracking-tight uppercase">GrowthPilot</span>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                        Empowering professionals to master any career path with the power of source-grounded AI.
                    </p>
                    <div className="flex gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-5 h-5 bg-zinc-800 rounded-sm" />
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-bold">Core</h4>
                    <ul className="space-y-2 text-zinc-500 text-sm">
                        <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                        <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
                        <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                        <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="font-bold">Company</h4>
                    <ul className="space-y-2 text-zinc-500 text-sm">
                        <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="font-bold">Legal</h4>
                    <ul className="space-y-2 text-zinc-500 text-sm">
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
                <p>© 2026 GrowthPilot. All rights reserved.</p>
                <p>Made with ❤️ for the Hackathon</p>
            </div>
        </footer>
    )
}
