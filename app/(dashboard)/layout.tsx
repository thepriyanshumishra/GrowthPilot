import { Sidebar, MobileSidebar } from "@/components/Sidebar"
import { DailyCheckIn } from "@/components/dashboard/DailyCheckIn"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-[#F5F5F7] dark:bg-transparent">
            <DailyCheckIn />
            <MobileSidebar />
            <Sidebar />
            <div className="flex-1 lg:pl-80 pb-20 lg:pb-8 pt-20 lg:pt-8 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </div>
        </div>
    )
}
