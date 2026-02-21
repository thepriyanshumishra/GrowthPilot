"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, ArrowRight, Eye, EyeOff, Wand2, Loader2, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/app/actions/user"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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
        <div className="min-h-screen bg-gradient-to-b from-[#E0F2FE] to-white dark:from-zinc-950 dark:to-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Soft Ambient Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[60%] h-[40%] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 mb-8"
            >
                <Link href="/" className="flex flex-col items-center gap-3 group">
                    <div className="relative w-20 h-20 rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center p-4 clay-panel group-hover:scale-105 transition-transform duration-500">
                        <div className="w-full h-full relative">
                            <Image src="/logo.png" alt="GrowthPilot" fill className="object-contain" />
                        </div>
                    </div>
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <div className="clay-panel p-8 sm:p-12 rounded-[3.5rem] space-y-8">
                    <AnimatePresence mode="wait">
                        {!linkSent ? (
                            <motion.div
                                key="login-form"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-8"
                            >
                                <div className="text-center space-y-2">
                                    <h1 className="text-3xl font-black tracking-tight text-[#0F172A] dark:text-white">Welcome back</h1>
                                    <p className="text-zinc-500 text-sm font-medium">Enter your credentials to access your account</p>
                                </div>

                                <div className="flex p-1.5 bg-zinc-100/80 dark:bg-white/5 rounded-[1.5rem] clay-input border-none">
                                    <button
                                        onClick={() => setLoginMethod("password")}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
                                            loginMethod === "password"
                                                ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-white"
                                                : "text-zinc-400 hover:text-zinc-600"
                                        )}
                                    >
                                        <Lock className="w-3.5 h-3.5" />
                                        Password
                                    </button>
                                    <button
                                        onClick={() => setLoginMethod("magic-link")}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
                                            loginMethod === "magic-link"
                                                ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-white"
                                                : "text-zinc-400 hover:text-zinc-600"
                                        )}
                                    >
                                        <Wand2 className="w-3.5 h-3.5" />
                                        Magic Link
                                    </button>
                                </div>

                                <form onSubmit={handleEmailLogin} className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="relative group">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 clay-icon-box">
                                                <Mail className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                className="clay-input pl-14 h-14 rounded-[1.25rem] text-zinc-900 dark:text-white font-medium border-none"
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
                                            className="space-y-3"
                                        >
                                            <div className="relative group">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 clay-icon-box">
                                                    <Lock className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    className="clay-input pl-14 pr-12 h-14 rounded-[1.25rem] text-zinc-900 dark:text-white font-medium border-none"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required={loginMethod === "password"}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {error && (
                                        <p className="text-xs text-red-500 font-bold text-center px-4">
                                            {error}
                                        </p>
                                    )}

                                    <Button
                                        disabled={loading}
                                        className="clay-btn-primary w-full h-14 rounded-[1.25rem] font-black text-lg transition-all"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                        ) : (
                                            <>
                                                {loginMethod === "password" ? "Sign in" : "Send Magic Link"}
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </>
                                        )}
                                    </Button>
                                </form>

                                <div className="space-y-6">
                                    <div className="relative h-px bg-zinc-100 dark:bg-white/5 mx-8">
                                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">
                                            OR
                                        </span>
                                    </div>

                                    <Button
                                        onClick={signInWithGoogle}
                                        variant="outline"
                                        type="button"
                                        className="clay-btn w-full h-14 rounded-[1.25rem] border-none font-bold transition-all flex items-center justify-center gap-3 text-zinc-900 dark:text-zinc-100"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        <span className="text-xs uppercase tracking-widest font-black">Continue with Google</span>
                                    </Button>
                                </div>

                                <div className="text-center pt-2 space-y-4">
                                    <p className="text-[11px] text-zinc-400 font-black uppercase tracking-widest">
                                        New to Pilot?{" "}
                                        <Link href="/auth/signup" className="text-blue-500 hover:text-blue-600 border-b-2 border-blue-500/10 hover:border-blue-500 transition-all pb-0.5 ml-1">Create Account</Link>
                                    </p>
                                    <button
                                        type="button"
                                        className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-500 transition-colors"
                                    >
                                        Forgot your password? <span className="text-blue-400 ml-1 underline decoration-blue-400/30 underline-offset-4">Reset password</span>
                                    </button>
                                </div>
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
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 text-center"
                >
                    Source Powered • Reality Grounded • AI Driven
                </motion.p>
            </motion.div>
        </div>
    )
}
