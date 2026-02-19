"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { GlassCard } from "@/components/GlassCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageCircle, Twitter, Linkedin, Github, MapPin, Send } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function ContactPage() {
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            toast.success("Message sent! We'll get back to you soon.")
        }, 1500)
    }

    return (
        <main className="min-h-screen bg-[#FDFDFF] dark:bg-black overflow-hidden font-geist">
            <Navbar />

            <section className="pt-44 pb-20 px-4 container mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-8">
                    <Mail className="w-3.5 h-3.5" />
                    Get in Touch
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-zinc-900 dark:text-white">
                    We'd love to hear <br /> <span className="text-blue-600">from you.</span>
                </h1>
                <p className="text-zinc-500 text-xl max-w-2xl mx-auto mb-12">
                    Have a question about the roadmap generator? Want to partner with us? Or just want to say hi? drop us a line.
                </p>
            </section>

            <section className="pb-32 container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <GlassCard className="p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-900 dark:text-white">Full Name</label>
                                <Input placeholder="John Doe" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-12" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-900 dark:text-white">Email Address</label>
                                <Input type="email" placeholder="john@example.com" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-12" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-900 dark:text-white">Message</label>
                                <Textarea placeholder="Tell us how we can help..." className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 min-h-[150px]" required />
                            </div>
                            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg" disabled={loading}>
                                {loading ? "Sending..." : "Send Message"} <Send className="w-4 h-4 ml-2" />
                            </Button>
                        </form>
                    </GlassCard>

                    {/* Contact Info & Socials */}
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Other ways to reach us</h3>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Email Support</h4>
                                    <p className="text-zinc-500 mb-2">For general inquiries and support questions.</p>
                                    <a href="mailto:support@growthpilot.ai" className="text-blue-600 font-bold hover:underline">support@growthpilot.ai</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 flex-shrink-0">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Community Discord</h4>
                                    <p className="text-zinc-500 mb-2">Join our community of 5,000+ developers.</p>
                                    <a href="#" className="text-purple-600 font-bold hover:underline">Join Server -&gt;</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 flex-shrink-0">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Headquarters</h4>
                                    <p className="text-zinc-500">
                                        123 Innovation Drive, Suite 400 <br />
                                        San Francisco, CA 94103
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-lg">Follow our journey</h4>
                            <div className="flex gap-4">
                                {[Twitter, Linkedin, Github].map((Icon, i) => (
                                    <a key={i} href="#" className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-all">
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
