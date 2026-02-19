"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Loader2 } from "lucide-react"

export function NotificationToggle() {
    const [permission, setPermission] = useState<NotificationPermission>("default")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if ("Notification" in window) {
            setPermission(Notification.permission)
        }
    }, [])

    const requestPermission = async () => {
        if (!("Notification" in window)) return
        setLoading(true)
        const result = await Notification.requestPermission()
        setPermission(result)
        setLoading(false)

        if (result === "granted") {
            new Notification("GrowthPilot AI", {
                body: "Notifications are now active! We'll keep you on track.",
                icon: "/manifest.json" // Placeholder
            })
        }
    }

    if (permission === "granted") return (
        <div className="flex items-center gap-2 text-[10px] font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-800">
            <Bell className="w-3 h-3" />
            <span className="hidden group-hover:block">On</span>
        </div>
    )

    return (
        <button
            onClick={requestPermission}
            disabled={loading || permission === "denied"}
            className="flex items-center gap-2 text-[10px] font-medium text-zinc-400 hover:text-zinc-600 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded-lg transition-colors"
        >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <BellOff className="w-3 h-3" />}
            <span className="hidden group-hover:block">{permission === "denied" ? "Off" : "Enable"}</span>
        </button>
    )
}
