"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    Compass,
    Bot,
    Users,
    Settings,
    Search,
    Menu,
    CreditCard,
    Target as TargetIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PomodoroTimer } from "@/components/dashboard/Pomodoro"
import { NotificationToggle } from "@/components/dashboard/NotificationToggle"
import { ThemeToggle } from "@/components/dashboard/ThemeToggle"
import { SidebarProfile } from "@/components/dashboard/SidebarProfile"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"

export const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Strategic Map", href: "/roadmap", icon: Compass },
    { name: "AI Coach", href: "/chat", icon: Bot },
    { name: "Focus Zone", href: "/focus", icon: TargetIcon },
    { name: "Squads", href: "/squad", icon: Users },
]

export function SidebarContent() {
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = (command: () => void) => {
        setOpen(false)
        command()
    }

    return (
        <div className="h-full clay-panel rounded-[2.5rem] flex flex-col overflow-hidden">
            {/* Brand Area */}
            <div className="p-7 pb-4">
                <Link href="/" className="flex items-center gap-3 group transition-all active:scale-95">
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xl shadow-blue-500/20 ring-1 ring-white/10">
                        <Image
                            src="/logo.png"
                            alt="GrowthPilot"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-[17px] font-black tracking-tight text-zinc-900 dark:text-white uppercase">GrowthPilot</span>
                </Link>
            </div>

            {/* macOS-style search bar */}
            <div className="px-5 mb-6">
                <button
                    onClick={() => setOpen(true)}
                    className="w-full relative group flex items-center h-10 transition-all active:scale-[0.98]"
                >
                    <Search className="absolute left-3.5 w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-500 z-10 transition-colors" />
                    <div className="w-full clay-input rounded-xl h-full flex items-center pl-10 pr-4 text-[12.5px] font-semibold text-zinc-400/80 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        Search Intel...
                    </div>
                    <div className="absolute right-3 flex gap-1 items-center opacity-30 group-hover:opacity-60 transition-opacity">
                        <span className="text-[10px] font-bold border border-zinc-300 dark:border-zinc-700 px-1 rounded-sm">⌘</span>
                        <span className="text-[10px] font-bold border border-zinc-300 dark:border-zinc-700 px-1 rounded-sm">K</span>
                    </div>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8 no-scrollbar">
                {/* Navigation Section */}
                <div className="space-y-1">
                    <h3 className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] px-3 mb-2">Navigation</h3>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-[13.5px] font-bold",
                                    isActive
                                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-white/5"
                                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                                )}
                            >
                                <item.icon className={cn("w-4.5 h-4.5 transition-transform group-hover:scale-110", isActive ? "text-white dark:text-zinc-900" : "opacity-60")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </div>

                {/* Productivity Utilities */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-3">
                        <h3 className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Productivity</h3>
                        <div className="flex items-center gap-1">
                            <ThemeToggle />
                            <NotificationToggle />
                        </div>
                    </div>
                    <div className="px-1">
                        <PomodoroTimer />
                    </div>
                </div>
            </div>

            {/* Profile Bottom Section */}
            <div className="p-4 mt-auto border-t border-zinc-200/50 dark:border-white/5 bg-zinc-50/50 dark:bg-white/5">
                <SidebarProfile />
            </div>

            {/* Command Dialog Rendering */}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search system resources..." />
                <CommandList>
                    <CommandEmpty>No modules found.</CommandEmpty>
                    <CommandGroup heading="System Nodes">
                        {navigation.map((item) => (
                            <CommandItem key={item.href} onSelect={() => runCommand(() => router.push(item.href))} className="rounded-lg">
                                <item.icon className="mr-3 h-4 w-4 opacity-70" />
                                <span className="font-bold text-[13px]">{item.name}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandSeparator className="opacity-10" />
                    <CommandGroup heading="Utilities">
                        <CommandItem onSelect={() => runCommand(() => router.push("/settings"))} className="rounded-lg">
                            <Settings className="mr-3 h-4 w-4 opacity-70" />
                            <span className="font-bold text-[13px]">Preferences</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/billing"))} className="rounded-lg">
                            <CreditCard className="mr-3 h-4 w-4 opacity-70" />
                            <span className="font-bold text-[13px]">Subscription</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
    )
}

export function Sidebar() {
    return (
        <div className="hidden lg:block fixed left-6 top-6 bottom-6 w-64 z-50">
            <SidebarContent />
        </div>
    )
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()
    useEffect(() => { setOpen(false) }, [pathname])

    return (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-lg shadow-blue-500/10 ring-1 ring-black/5 dark:ring-white/10">
                    <Image src="/logo.png" alt="GrowthPilot" fill className="object-cover" />
                </div>
                <span className="text-sm font-black tracking-tight text-zinc-900 dark:text-white uppercase transition-colors group-hover:text-blue-600">GrowthPilot</span>
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl h-10 w-10">
                        <Menu className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-transparent border-none w-72 pt-4 pl-4 h-[calc(100vh-2rem)]">
                    <SidebarContent />
                </SheetContent>
            </Sheet>
        </div>
    )
}
