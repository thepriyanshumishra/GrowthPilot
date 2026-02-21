"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowRight, Check, Loader2, Upload, FileText, SkipForward } from "lucide-react"
import { startOnboarding, processAnswer, saveProfile, resetUserOnboarding, uploadResume } from "./actions"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

type Question = {
    question: string
    type: "text" | "select" | "multiselect" | "file"
    options?: string[]
    field?: string
}

export default function OnboardingPage() {
    const router = useRouter()
    const [history, setHistory] = useState<any[]>([]) // Full AI history
    const [currentQ, setCurrentQ] = useState<{
        question: string,
        type: "text" | "select" | "multiselect" | "file",
        options?: string[],
        field?: string
    } | null>(null)
    const [input, setInput] = useState("")
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isThinking, setIsThinking] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [direction, setDirection] = useState(1) // 1 for next, -1 for back
    const [steps, setSteps] = useState<Question[]>([])

    // Initial Load
    useEffect(() => {
        const init = async () => {
            const params = new URLSearchParams(window.location.search)
            const isRestart = params.get('restart') === 'true'

            const q = await startOnboarding() // This is called regardless, which is fine for now.

            if (isRestart) {
                const initialMsg = "Welcome back! Let's re-calibrate your mission parameters. Ready to set a new course?"
                const restartQ = {
                    question: initialMsg,
                    type: "select" as const,
                    options: ["Yes, Let's Reset", "No, Keep My Progress"],
                    field: "restartConfirmation"
                }
                setCurrentQ(restartQ)
                setHistory([{ role: "assistant", content: initialMsg }])
                setSteps([restartQ])
                setIsLoading(false)
                return
            }

            // Original logic for non-restart
            const initialMsg = q.question

            setHistory([{ role: "assistant", content: initialMsg }])
            setCurrentQ({
                question: initialMsg,
                type: q.type as "text" | "select" | "multiselect",
                options: q.options,
                field: q.field
            })
            setIsLoading(false)
        }
        init()
    }, [])

    // Update steps when currentQ changes
    useEffect(() => {
        if (currentQ) {
            setSteps(prev => {
                // Avoid duplicates if same question
                if (prev.length > 0 && prev[prev.length - 1].question === currentQ.question) return prev;
                return [...prev, currentQ]
            })
        }
    }, [currentQ])

    const handleNext = async (manualAnswer?: string) => {
        let finalAnswer = manualAnswer || input

        // Handle "Other" logic merging
        if (selectedOptions.includes("Other") && input.trim()) {
            const otherOptions = selectedOptions.filter(o => o !== "Other")
            finalAnswer = [...otherOptions, input.trim()].join(", ")
        } else if (selectedOptions.length > 0 && !finalAnswer) {
            finalAnswer = selectedOptions.join(", ")
        }

        if (!finalAnswer) return

        // SPECIAL CASE: Restart Confirmation
        if (currentQ?.field === "restartConfirmation") {
            if (finalAnswer.includes("No")) {
                router.push("/dashboard")
                return
            } else {
                // User said YES. We reset their data.
                await resetUserOnboarding()
                // Proceed to let the AI ask the first real question
            }
        }

        setDirection(1)
        setIsThinking(true)

        const newHistory = [...history, { role: "user", content: finalAnswer }]
        console.log("Client: Sending history to AI:", newHistory)
        setHistory(newHistory)

        try {
            const res = await processAnswer(newHistory)
            console.log("Client: AI Response:", res)

            if (res.is_complete) {
                console.log("Client: Onboarding Complete!")
                await saveProfile(res.collected_profile)
                router.push("/dashboard")
                return
            }

            setHistory(prev => [...prev, { role: "assistant", content: res.next_question }])

            // Artificial delay for smooth transition feel
            setTimeout(() => {
                setCurrentQ({
                    question: res.next_question,
                    type: res.type as "text" | "select" | "multiselect" | "file",
                    options: res.options,
                    field: res.field
                })
                setInput("")
                setSelectedOptions([])
                setFile(null)
                setIsThinking(false)
            }, 500)

        } catch (err: any) {
            console.error("Client: Server Action Error:", err.message)
            setIsThinking(false)
            // You could set an error state here to show a toast
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return
        setFile(selectedFile)
    }

    const handleUpload = async () => {
        if (!file) return
        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await uploadResume(formData)
            if (res.success) {
                handleNext("I have uploaded my resume. Please use the information from it to help with the onboarding.")
            }
        } catch (err) {
            console.error("Upload Error:", err)
        } finally {
            setIsUploading(false)
        }
    }

    const handleSkip = () => {
        handleNext("I'll skip the resume upload for now.")
    }



    const safeBack = () => {
        if (steps.length <= 1) return
        setDirection(-1)
        const prevStep = steps[steps.length - 2]
        setSteps(prev => prev.slice(0, -1))

        // Also sync history
        setHistory(prev => prev.slice(0, -2))

        setCurrentQ(prevStep)
        setInput("")
        setSelectedOptions([])
    }

    const toggleOption = (opt: string) => {
        if (opt === "Other") {
            if (currentQ?.type === "multiselect") {
                setSelectedOptions(prev => prev.includes("Other") ? prev.filter(o => o !== "Other") : [...prev, "Other"])
            } else {
                setSelectedOptions(["Other"])
            }
            return
        }

        if (currentQ?.type === "multiselect") {
            setSelectedOptions(prev =>
                prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
            )
        } else {
            handleNext(opt)
        }
    }

    const showInput = currentQ?.type === "text" || selectedOptions.includes("Other")

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black font-geist flex flex-col relative overflow-hidden">
            {/* Header / ProgressBar could go here */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-all duration-300 ring-1 ring-black/5 dark:ring-white/10">
                        <Image src="/logo.png" alt="GrowthPilot" fill className="object-cover" />
                    </div>
                    <span className="text-[15px] font-black tracking-tight text-zinc-900 dark:text-white uppercase">GrowthPilot</span>
                </Link>
                <div className="text-sm font-medium text-zinc-500">
                    Step {steps.length}
                </div>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full z-0">
                <AnimatePresence mode="wait" custom={direction}>
                    {currentQ && !isThinking ? (
                        <motion.div
                            key={currentQ.question}
                            custom={direction}
                            initial={{ opacity: 0, x: direction * 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: direction * -50 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full space-y-8"
                        >
                            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white leading-tight tracking-tight text-center">
                                {currentQ.question}
                            </h1>

                            <div className="space-y-6">
                                {/* Options Grid */}
                                {currentQ.options && currentQ.options.length > 0 && (
                                    <div className={`grid gap-3 w-full ${currentQ.options.length > 4 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                        {currentQ.options.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => toggleOption(opt)}
                                                className={`p-4 rounded-2xl text-left border-2 transition-all duration-200 flex items-center justify-between group ${selectedOptions.includes(opt)
                                                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm"
                                                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-300 dark:hover:border-zinc-700 hover:shadow-md"
                                                    }`}
                                            >
                                                <span className="font-medium">{opt}</span>
                                                {selectedOptions.includes(opt) && (
                                                    <Check className="w-5 h-5 text-blue-600" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Text Input */}
                                {showInput && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleNext()}
                                            placeholder={selectedOptions.includes("Other") ? "Please specify details..." : "Type your answer here..."}
                                            className="h-16 text-xl px-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-blue-600"
                                            autoFocus
                                        />
                                    </motion.div>
                                )}

                                {/* File Upload */}
                                {currentQ.type === "file" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="relative group cursor-pointer">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                                            />
                                            <div className={cn(
                                                "p-12 border-2 border-dashed rounded-[2rem] flex flex-col items-center gap-4 transition-all duration-300 bg-zinc-50 dark:bg-zinc-900",
                                                file
                                                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                                                    : "border-zinc-200 dark:border-zinc-800 group-hover:border-blue-400 group-hover:bg-zinc-100/50 dark:group-hover:bg-zinc-800/50"
                                            )}>
                                                <div className={cn(
                                                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300",
                                                    file ? "bg-blue-600 scale-110" : "bg-zinc-200 dark:bg-zinc-800 group-hover:scale-110"
                                                )}>
                                                    {file ? (
                                                        <FileText className="w-8 h-8 text-white" />
                                                    ) : (
                                                        <Upload className="w-8 h-8 text-zinc-500 dark:text-zinc-400" />
                                                    )}
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-bold text-zinc-900 dark:text-white">
                                                        {file ? file.name : "Drop your Resume here"}
                                                    </p>
                                                    <p className="text-sm text-zinc-500 mt-1">
                                                        {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Support PDF files only (max 5MB)"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <Button
                                                onClick={handleUpload}
                                                disabled={!file || isUploading}
                                                className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/20"
                                            >
                                                {isUploading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Parsing Intelligence...
                                                    </>
                                                ) : (
                                                    <>Analyze Resume</>
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={handleSkip}
                                                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2"
                                            >
                                                <SkipForward className="w-4 h-4" />
                                                Skip for now
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                            <p className="text-zinc-500 animate-pulse">Designing your path...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer Navigation */}
            <div className="w-full max-w-2xl mx-auto p-6 flex items-center justify-between pb-10">
                <Button
                    variant="ghost"
                    onClick={safeBack}
                    disabled={steps.length <= 1 || isThinking}
                    className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </Button>

                {(showInput || currentQ?.type === "multiselect") && (
                    <Button
                        onClick={() => handleNext()}
                        disabled={isThinking || (!input && selectedOptions.length === 0)}
                        className="rounded-full px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-semibold text-lg transition-transform active:scale-95"
                    >
                        Next
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    )
}
