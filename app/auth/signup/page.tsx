"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { GlassCard } from "@/components/GlassCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, ArrowRight, Chrome, User, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SignupPage() {
    const { signInWithGoogle } = useAuth()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(userCredential.user, { displayName: name })
            toast.success("Account created successfully!")
            router.push("/onboarding")
        } catch (err: any) {
            setError(err.message)
            toast.error(err.message || "Failed to create account")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-black flex flex-col items-center justify-center p-6 font-geist">
            <Link href="/" className="flex items-center gap-3 mb-12 group">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform ring-1 ring-black/5 dark:ring-white/10">
                    <Image src="/logo.png" alt="GrowthPilot" fill className="object-cover" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">GrowthPilot</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <GlassCard className="p-8 space-y-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-2xl border-white/20 dark:border-zinc-800/50 shadow-2xl">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Create Account</h1>
                        <p className="text-zinc-500 text-sm font-medium">Join the next generation of career growth</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    className="pl-10 h-10 rounded-xl bg-white/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    className="pl-10 h-10 rounded-xl bg-white/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 h-10 rounded-xl bg-white/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

                        <Button
                            disabled={loading}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-500/20"
                        >
                            {loading ? "Creating account..." : "Get Started"}
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#F5F5F7] dark:bg-[#09090b] px-2 text-zinc-500 font-bold">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        onClick={signInWithGoogle}
                        variant="outline"
                        type="button"
                        className="w-full h-12 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold hover:bg-white dark:hover:bg-zinc-800 transition-all"
                    >
                        <Chrome className="mr-2 w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                        Sign up with Google
                    </Button>

                    <p className="text-center text-sm text-zinc-500 font-medium">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">Sign in</Link>
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    )
}
