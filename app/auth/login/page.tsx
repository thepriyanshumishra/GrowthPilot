"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { GlassCard } from "@/components/GlassCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, ArrowRight, Chrome, Eye, EyeOff, Wand2, Loader2, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/app/actions/user"
import { toast } from "sonner"

export default function LoginPage() {
    const { signInWithGoogle } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [loginMethod, setLoginMethod] = useState<"password" | "magic-link">("password")
    const [linkSent, setLinkSent] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Handle magic link logic if we just landed here from a link
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let emailForLink = window.localStorage.getItem('emailForSignIn');
            if (!emailForLink) {
                emailForLink = window.prompt('Please provide your email for confirmation');
            }
            if (emailForLink) {
                setLoading(true);
                signInWithEmailLink(auth, emailForLink, window.location.href)
                    .then(async () => {
                        window.localStorage.removeItem('emailForSignIn');
                        toast.success("Successfully signed in!");
                        const dbUser = await getCurrentUser()
                        if (dbUser?.isOnboarded) {
                            router.push("/dashboard")
                        } else {
                            router.push("/onboarding")
                        }
                    })
                    .catch((error) => {
                        toast.error(error.message);
                        setLoading(false);
                    });
            }
        }
    }, [router]);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (loginMethod === "magic-link") {
            try {
                const actionCodeSettings = {
                    url: `${window.location.origin}/auth/login`,
                    handleCodeInApp: true,
                };
                await sendSignInLinkToEmail(auth, email, actionCodeSettings);
                window.localStorage.setItem('emailForSignIn', email);
                setLinkSent(true);
                toast.success("Magic link sent to your email!");
            } catch (err: any) {
                setError(err.message);
                toast.error(err.message || "Failed to send magic link");
            } finally {
                setLoading(false);
            }
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            const token = await user.getIdToken()
            document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Lax`
            toast.success("Welcome back!")
            const dbUser = await getCurrentUser()
            if (dbUser?.isOnboarded) {
                router.push("/dashboard")
            } else {
                router.push("/onboarding")
            }
        } catch (err: any) {
            setError(err.message)
            toast.error(err.message || "Failed to sign in")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-black flex flex-col items-center justify-center p-6 font-geist relative overflow-hidden">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="z-10"
            >
                <Link href="/" className="flex flex-col items-center gap-4 mb-8 group">
                    <div className="relative w-16 h-16 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-500 ring-2 ring-white/50 dark:ring-white/10">
                        <Image src="/logo.png" alt="GrowthPilot" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent" />
                    </div>
                    <div className="text-center">
                        <span className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white block">GrowthPilot</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 mt-1 block">Career Intelligence</span>
                    </div>
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full max-w-md z-10 px-4 sm:px-0"
            >
                <GlassCard className="p-6 sm:p-8 space-y-8 clay-panel rounded-[2rem] sm:rounded-[2.5rem]">
                    <AnimatePresence mode="wait">
                        {!linkSent ? (
                            <motion.div
                                key="login-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                <div className="text-center space-y-2">
                                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Welcome Back</h1>
                                    <p className="text-zinc-500 text-xs sm:text-sm font-medium">Elevate your professional trajectory</p>
                                </div>

                                <div className="flex p-1 bg-zinc-100/50 dark:bg-white/5 rounded-2xl border border-zinc-200/50 dark:border-white/5">
                                    <button
                                        onClick={() => setLoginMethod("password")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${loginMethod === "password" ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600"}`}
                                    >
                                        <Lock className="w-3.5 h-3.5" />
                                        Password
                                    </button>
                                    <button
                                        onClick={() => setLoginMethod("magic-link")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${loginMethod === "magic-link" ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600"}`}
                                    >
                                        <Wand2 className="w-3.5 h-3.5" />
                                        Magic Link
                                    </button>
                                </div>

                                <form onSubmit={handleEmailLogin} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="commander@enterprise.com"
                                                className="clay-input pl-11 h-12 rounded-2xl transition-all"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {loginMethod === "password" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="space-y-2"
                                        >
                                            <div className="flex justify-between items-center ml-1">
                                                <Label htmlFor="password" className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Security Key</Label>
                                                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">Lost Key?</button>
                                            </div>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="clay-input pl-11 pr-11 h-12 rounded-2xl transition-all"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required={loginMethod === "password"}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-[11px] text-red-500 font-bold uppercase tracking-wider text-center bg-red-500/5 py-2 rounded-lg border border-red-500/10"
                                        >
                                            {error}
                                        </motion.p>
                                    )}

                                    <Button
                                        disabled={loading}
                                        className="clay-btn-primary w-full h-12 rounded-2xl font-black uppercase tracking-widest transition-all"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                {loginMethod === "password" ? "Initiate Login" : "Send Magic Link"}
                                                <ArrowRight className="ml-2 w-4 h-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>

                                <div className="space-y-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-zinc-200/50 dark:border-white/5" />
                                        </div>
                                        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                                            <span className="bg-[#ffffffcc] dark:bg-[#121212cc] px-4 text-zinc-400 font-black">Unified Auth</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={signInWithGoogle}
                                        variant="outline"
                                        type="button"
                                        className="clay-btn w-full h-12 rounded-2xl border-none font-bold transition-all flex items-center justify-center gap-3 text-zinc-900 dark:text-zinc-100"
                                    >
                                        <Chrome className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                                        <span className="text-xs uppercase tracking-widest font-black">Sync with Google</span>
                                    </Button>
                                </div>

                                <p className="text-center text-[11px] text-zinc-400 font-black uppercase tracking-widest">
                                    New to the Fleet?{" "}
                                    <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500 border-b-2 border-blue-600/20 hover:border-blue-600 transition-all pb-0.5 ml-1">Join Now</Link>
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success-state"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8 space-y-6"
                            >
                                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-10 h-10 text-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white">Transmission Sent</h3>
                                    <p className="text-zinc-500 text-sm font-medium">Check your inbox at <span className="text-blue-600 font-bold">{email}</span> to continue.</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => setLinkSent(false)}
                                    className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                                >
                                    Use another method
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </GlassCard>
            </motion.div>

            {/* Footer Tagline */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 text-center"
            >
                Source Powered • Reality Grounded • AI Driven
            </motion.p>
        </div>
    )
}
