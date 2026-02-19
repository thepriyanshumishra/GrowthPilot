"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface RoadmapEngageButtonProps {
    title: string
    isCompleted: boolean
    isCurrent: boolean
}

export function RoadmapEngageButton({ title, isCompleted, isCurrent }: RoadmapEngageButtonProps) {
    const router = useRouter()

    const handleClick = () => {
        if (isCompleted) {
            // Maybe handle review logic later, for now chat context
            router.push(`/chat?context=${encodeURIComponent(`I want to review my completed milestone: ${title}`)}`)
        } else {
            router.push(`/chat?context=${encodeURIComponent(`I am ready to start the milestone: "${title}". Please give me a specific, actionable mission plan to complete this phase.`)}`)
        }
    }

    return (
        <Button
            variant={isCurrent ? "default" : "outline"}
            onClick={handleClick}
            className={`rounded-xl h-10 px-5 text-xs font-bold uppercase tracking-wide transition-all active:scale-95 ${isCurrent ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20' : ''
                }`}
        >
            {isCompleted ? 'Review' : 'Engage'}
            <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
    )
}
