"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    User,
    Settings,
    LogOut,
    RefreshCcw,
    CreditCard,
    BrainCircuit
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { MemoriesDialog } from "@/components/dashboard/MemoriesDialog"
import { resetUserOnboarding } from "@/app/onboarding/actions"

export function SidebarProfile() {
    const { user, dbUser, logout, refreshUser } = useAuth()
    const router = useRouter()
    const [showResetAlert, setShowResetAlert] = useState(false)
    const [showMemories, setShowMemories] = useState(false)

    const handleRestartOnboarding = () => {
        setShowResetAlert(true)
    }

    const confirmReset = async () => {
        try {
            await resetUserOnboarding()
            await refreshUser() // Update context to reflect isOnboarded: false
            router.push("/onboarding?restart=true")
        } catch (error) {
            console.error("Failed to reset scope", error)
        }
    }

    const navigateToSettings = () => {
        router.push("/settings") // Assuming we will build this page or it exists
    }

    if (!user) return null

    const displayName = dbUser?.name || user.displayName || 'Explorer'
    const displayImage = dbUser?.image || user.photoURL || ""
    const displayEmail = dbUser?.email || user.email || ""

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 outline-none group">
                        <Avatar className="h-9 w-9 rounded-lg border border-zinc-200 dark:border-zinc-700">
                            <AvatarImage src={displayImage} alt={displayName} />
                            <AvatarFallback className="rounded-lg bg-indigo-50 text-indigo-600 font-bold">
                                {displayName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                {displayName}
                            </p>
                            <p className="text-[10px] text-zinc-500 truncate font-medium">
                                {displayEmail}
                            </p>
                        </div>
                        <Settings className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" align="start" side="right" sideOffset={12}>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">My Account</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                Profile & Preferences
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="cursor-pointer" onClick={navigateToSettings}>
                            <User className="mr-2 h-4 w-4 text-zinc-500" />
                            <span>Profile Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => setShowMemories(true)}>
                            <BrainCircuit className="mr-2 h-4 w-4 text-purple-500" />
                            <span>Memories</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/settings")}>
                            <CreditCard className="mr-2 h-4 w-4 text-zinc-500" />
                            <span>Billing</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={handleRestartOnboarding}>
                            <RefreshCcw className="mr-2 h-4 w-4 text-blue-500" />
                            <span className="text-blue-600 font-medium">Reset Career Scope</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <MemoriesDialog open={showMemories} onOpenChange={setShowMemories} />

            <AlertDialog open={showResetAlert} onOpenChange={setShowResetAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset Career Scope?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will restart your onboarding process. Your current roadmap and mission progress might be archived or reset depending on your selection in the new scope. Are you sure?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmReset} className="bg-blue-600 hover:bg-blue-700">
                            Yes, Reset Scope
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
