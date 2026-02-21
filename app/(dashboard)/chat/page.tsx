"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Bot,
    Sparkles,
    CheckCircle2,
    BrainCircuit,
    ArrowRight,
    LayoutDashboard,
    Zap,
    Cpu,
    History
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { transcribeAudio } from "@/lib/ai/voice"
import {
    getCoachResponse,
    getChatHistory,
    approveAction,
    clearChatHistory,
    concludeSession,
    saveMemoriesAndReset,
    getChatSidebarData
} from "./actions"
import { VoiceEngine } from "@/lib/ai/voice-engine"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { ChatSidebar } from "@/components/chat/ChatSidebar"
import { ChatInput } from "@/components/chat/ChatInput"

type Message = {
    role: "user" | "assistant"
    content: string
    isAction?: boolean
}

type ConclusionData = {
    critique: string
    roadmapUpdates: any[]
    memories: any[]
}

export default function ChatCoach() {
    const { user: authUser } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [engineReady, setEngineReady] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isRecording, setIsRecording] = useState(false)

    // Sidebar Data
    const [sidebarData, setSidebarData] = useState<any>(null)

    const [isHistoryLoaded, setIsHistoryLoaded] = useState(false)
    const contextProcessed = useRef(false)

    // Conclusion State
    const [isConcluding, setIsConcluding] = useState(false)
    const [conclusionData, setConclusionData] = useState<ConclusionData | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [saveStep, setSaveStep] = useState(0)

    const mediaRecorder = useRef<MediaRecorder | null>(null)
    const audioChunks = useRef<Blob[]>([])

    const loadSidebarData = async () => {
        try {
            const data = await getChatSidebarData()
            setSidebarData(data)
        } catch {
            console.error("Failed to load sidebar data")
        }
    }

    useEffect(() => {
        const initEngine = async () => {
            try {
                const engine = VoiceEngine.getInstance()
                await engine.initialize()
                setEngineReady(true)
            } catch (error) {
                console.error("Voice engine failed", error)
            }
        }
        initEngine()

        const loadHistory = async () => {
            setIsLoading(true)
            try {
                const history = await getChatHistory()
                setMessages(history)
            } catch (error) {
                console.error("Failed to load history:", error)
            } finally {
                setIsLoading(false)
                setIsHistoryLoaded(true)
            }
        }
        loadHistory()
        loadSidebarData()
    }, [])

    useEffect(() => {
        if (isHistoryLoaded && !contextProcessed.current) {
            const params = new URLSearchParams(window.location.search)
            const context = params.get('context')
            if (context) {
                contextProcessed.current = true
                handleSend(context)
                window.history.replaceState({}, '', '/chat')
            }
        }
    }, [isHistoryLoaded])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'instant' })
        }
    }, [messages, isLoading])

    const handleSend = async (text: string, isVoice = false) => {
        if (!text.trim()) return

        const userMessage: Message = { role: "user", content: text }
        setMessages(prev => [...prev, userMessage])
        setIsLoading(true)

        try {
            const response = await getCoachResponse([...messages, userMessage].map(m => ({
                role: m.role,
                content: m.content
            })))

            const aiResponse: Message = {
                role: "assistant",
                content: response.content,
                isAction: response.isAction
            }
            setMessages(prev => [...prev, aiResponse])

            if (response.content.includes("```[MEMORY]")) loadSidebarData()

            if (isVoice) speakText(aiResponse.content)
        } catch (error: any) {
            toast.error(error.message || "Operation failed")
        } finally {
            setIsLoading(false)
        }
    }

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorder.current = new MediaRecorder(stream)
            mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data)
            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" })
                const formData = new FormData()
                formData.append("file", audioBlob, "audio.wav")
                setIsLoading(true)
                try {
                    const transcription = await transcribeAudio(formData)
                    handleSend(transcription, true)
                } catch {
                    toast.error("Transcription failed")
                } finally {
                    setIsLoading(false)
                    audioChunks.current = []
                }
            }
            audioChunks.current = []
            mediaRecorder.current.start()
            setIsRecording(true)
        } catch {
            toast.error("Microphone access denied")
        }
    }

    const stopRecording = () => {
        mediaRecorder.current?.stop()
        setIsRecording(false)
    }

    const speakText = async (text: string) => {
        if (engineReady) {
            try {
                const engine = VoiceEngine.getInstance()
                await engine.speak(text)
            } catch {
                speakBasic(text)
            }
        } else speakBasic(text)
    }

    const speakBasic = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.speak(utterance)
    }

    const handleApprove = async (content: string) => {
        const match = content.match(/```\[ACTION\]\s*([\s\S]*?)\s*```/)
        if (match && match[1]) {
            try {
                const res = await approveAction(match[1])
                if (res?.success) {
                    toast.success(res.message)
                    loadSidebarData()
                }
            } catch {
                toast.error("Action deployment failed")
            }
        }
    }

    const handleNewChat = async () => {
        if (messages.length === 0) return
        setIsLoading(true)
        await clearChatHistory()
        setMessages([])
        setIsLoading(false)
        toast.info("Workspace Reset")
    }

    const handleConcludeSession = async () => {
        setIsConcluding(true)
        try {
            const data = await concludeSession()
            if (data) setConclusionData(data)
            else setIsConcluding(false)
        } catch {
            setIsConcluding(false)
        }
    }

    const handleConfirmConclusion = async () => {
        if (!conclusionData) return
        setIsSaving(true)
        setSaveStep(1)
        await new Promise(r => setTimeout(r, 600))
        setSaveStep(2)
        await saveMemoriesAndReset({
            roadmapUpdates: conclusionData.roadmapUpdates,
            memories: conclusionData.memories
        })
        setSaveStep(3)
        await new Promise(r => setTimeout(r, 600))
        setMessages([])
        setConclusionData(null)
        setIsConcluding(false)
        setIsSaving(false)
        setSaveStep(0)
        loadSidebarData()
        toast.success("Intelligence Synchronized")
    }

    return (
        <div className="font-geist h-[calc(100vh-2rem)] md:h-[calc(100vh-2rem)] flex flex-col md:flex-row relative bg-white dark:bg-zinc-950 rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-[0_24px_80px_-16px_rgba(0,0,0,0.1)]">

            {/* Main Interaction Plane */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#F9F9FB] dark:bg-[#09090B] h-full">

                {/* Minimal Header */}
                <header className="px-4 md:px-8 h-14 md:h-16 flex items-center justify-between bg-white/60 dark:bg-zinc-900/40 backdrop-blur-3xl border-b border-zinc-200/50 dark:border-zinc-800/50 z-20 shrink-0">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="relative h-6 w-6 md:h-8 md:w-8 rounded-[8px] overflow-hidden shadow-md ring-1 ring-black/5 dark:ring-white/10 shrink-0">
                            <Image
                                src="/logo.png"
                                alt="GP"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex items-baseline gap-1.5 md:gap-2">
                            <h1 className="text-[12px] md:text-[14px] font-black tracking-tight text-zinc-900 dark:text-zinc-100 uppercase truncate max-w-[120px] sm:max-w-none">GrowthPilot Terminal</h1>
                            <span className="text-[8px] md:text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1.5 py-0.5 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 hidden sm:inline-block">L-70B</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Button
                            onClick={handleConcludeSession}
                            disabled={messages.length === 0}
                            variant="outline"
                            className="clay-btn h-8 px-3 rounded-[8px] border-none text-[11px] font-bold text-blue-600 dark:text-blue-400 transition-all shadow-sm"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            Finalize
                        </Button>
                        <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />
                        <Button
                            onClick={handleNewChat}
                            variant="ghost"
                            size="icon"
                            className="clay-btn bg-transparent border-none shadow-none h-8 w-8 rounded-[8px] text-zinc-400 hover:text-zinc-900 transition-all"
                        >
                            <History className="w-4 h-4" />
                        </Button>
                    </div>
                </header>

                <ScrollArea className="flex-1" ref={scrollRef}>
                    <div className="max-w-[800px] mx-auto w-full px-4 md:px-6 py-6 md:py-10 pb-32 md:pb-44">
                        {messages.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center min-h-[50vh] text-center"
                            >
                                <div className="mb-6 md:mb-8 p-3 md:p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 shadow-sm">
                                    <Bot className="w-8 h-8 md:w-10 md:h-10 text-zinc-400" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 mb-2">
                                    Commander <span className="text-blue-600">{authUser?.displayName?.split(' ')[0]}</span>
                                </h1>
                                <p className="text-[11px] md:text-[13px] text-zinc-400 font-medium max-w-[280px] leading-relaxed mb-6 md:mb-10">
                                    Systems calibrated. Initiate briefing or simulation whenever ready.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[500px]">
                                    {[
                                        { label: "Technical Interview", icon: BrainCircuit, color: "text-blue-500" },
                                        { label: "Milestone Debrief", icon: LayoutDashboard, color: "text-zinc-500" },
                                        { label: "Concept Mapping", icon: Cpu, color: "text-amber-500" },
                                        { label: "Profile Roast", icon: Sparkles, color: "text-purple-500" }
                                    ].map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(opt.label)}
                                            className="px-4 py-3 rounded-[12px] bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 hover:border-blue-500/30 transition-all text-left flex items-center gap-3 group shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                                        >
                                            <opt.icon className={cn("w-4 h-4 group-hover:scale-110 transition-transform", opt.color)} />
                                            <span className="text-[12px] font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                                                {opt.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {messages.map((msg, i) => (
                                        <ChatMessage key={i} message={msg} onApprove={handleApprove} />
                                    ))}
                                    {isLoading && (
                                        <div className="flex gap-4 items-center px-4 animate-in fade-in slide-in-from-left-2">
                                            <div className="w-8 h-8 rounded-[10px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200/50 dark:border-zinc-800">
                                                <Bot className="w-4.5 h-4.5 text-zinc-300" />
                                            </div>
                                            <div className="flex gap-1">
                                                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce" />
                                            </div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <ChatInput
                    onSend={handleSend}
                    isLoading={isLoading}
                    isRecording={isRecording}
                    onStartRecording={startRecording}
                    onStopRecording={stopRecording}
                />
            </div>

            {/* Context Panel */}
            <ChatSidebar
                profile={sidebarData?.profile}
                activeRoadmap={sidebarData?.roadmap}
                memories={sidebarData?.memories || []}
            />

            {/* Conclusion Intel Overlay */}
            <AnimatePresence>
                {isConcluding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-white/20 dark:bg-black/60 backdrop-blur-2xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.96, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-w-xl bg-white dark:bg-zinc-950 rounded-[32px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.4)] border border-zinc-200/50 dark:border-zinc-800 overflow-hidden flex flex-col"
                        >
                            {!conclusionData ? (
                                <div className="p-20 flex flex-col items-center gap-6">
                                    <Cpu className="w-10 h-10 text-blue-500 animate-pulse" />
                                    <div className="text-center">
                                        <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Analyzing Session</h3>
                                        <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Extracting Intelligence...</p>
                                    </div>
                                </div>
                            ) : isSaving ? (
                                <div className="p-20 flex flex-col items-center gap-8">
                                    <div className="space-y-4 w-full max-w-[240px]">
                                        {[1, 2, 3].map((step) => (
                                            <div key={step} className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                                    saveStep >= step ? "bg-blue-500 text-white" : "bg-zinc-100 dark:bg-zinc-900"
                                                )}>
                                                    <CheckCircle2 className={cn("w-3.5 h-3.5 transition-all opacity-0", saveStep >= step && "opacity-100")} />
                                                </div>
                                                <span className={cn("text-[11px] font-bold uppercase tracking-wider", saveStep >= step ? "text-zinc-900 dark:text-white" : "text-zinc-400")}>
                                                    {step === 1 ? "Mapping Logic" : step === 2 ? "Syncing Memory" : "Updating Roadmap"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="p-6 px-8 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none">Intelligence Debrief</h3>
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1.5">Mission Summary</p>
                                        </div>
                                    </div>
                                    <ScrollArea className="flex-1 p-8">
                                        <div className="space-y-8">
                                            <div>
                                                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Tactical Performance</h4>
                                                <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800 text-[13px] font-medium text-zinc-700 dark:text-zinc-400 italic leading-relaxed">
                                                    "{conclusionData.critique}"
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Roadmap Ops</h4>
                                                    <div className="space-y-2">
                                                        {conclusionData.roadmapUpdates.map((u, i) => (
                                                            <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800">
                                                                <Zap className="w-3 h-3 text-blue-500" />
                                                                <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 truncate">{u.title}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Memory Blocks</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {conclusionData.memories.map((m, i) => (
                                                            <div key={i} className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-[9px] font-bold text-zinc-500 uppercase tracking-tight">
                                                                {m.content}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                    <div className="p-6 px-8 border-t border-zinc-100 dark:border-zinc-900 flex gap-3 bg-zinc-50/20">
                                        <Button
                                            variant="ghost"
                                            className="clay-btn bg-transparent border-none shadow-none h-10 px-6 rounded-xl text-[12px] font-bold text-zinc-400 hover:text-zinc-900 transition-all"
                                            onClick={() => setIsConcluding(false)}
                                        >
                                            Dismiss
                                        </Button>
                                        <Button
                                            className="clay-btn flex-1 h-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-none rounded-xl font-black text-[12px] uppercase tracking-wider transition-all"
                                            onClick={handleConfirmConclusion}
                                        >
                                            Commit Changes <ArrowRight className="w-3.5 h-3.5 ml-2" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
