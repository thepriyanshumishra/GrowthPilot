"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Zap, Loader2 } from "lucide-react"
import { generateRoadmap } from "@/app/onboarding/roadmap-action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function RegenerateRoadmapButton() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleRegenerate = () => {
        startTransition(async () => {
            const result = await generateRoadmap()
            if (result.success) {
                toast.success("Roadmap regenerated with new quests!")
                router.refresh()
            } else {
                toast.error("Failed to regenerate roadmap")
            }
        })
    }

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={handleRegenerate}
            disabled={isPending}
            className="h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
        >
            {isPending ? (
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
            ) : (
                <Zap className="w-3.5 h-3.5 mr-2" />
            )}
            Regenerate
        </Button>
    )
}
