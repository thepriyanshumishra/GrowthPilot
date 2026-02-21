"use client"

import { GlassCard } from "@/components/GlassCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/context/AuthContext"
import { User, Bell, Shield, Save, Loader2, AtSign } from "lucide-react"
import { useState, useEffect } from "react"
import { getProfileData, updateProfile } from "./actions"
import { toast } from "sonner"

export default function SettingsPage() {
    const { user: authUser, refreshUser } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        bio: "",
        dailyBriefing: true,
        milestoneAlerts: true,
        emailUpdates: false
    })

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getProfileData()
                if (data) {
                    setFormData({
                        name: data.name || "",
                        username: data.username || "",
                        bio: data.bio || "",
                        dailyBriefing: data.dailyBriefing,
                        milestoneAlerts: data.milestoneAlerts,
                        emailUpdates: data.emailUpdates
                    })
                }
            } catch {
                toast.error("Failed to load profile data")
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await updateProfile(formData)
            if (res.success) {
                await refreshUser()
                toast.success("Settings updated successfully")
            } else {
                toast.error(res.error || "Failed to update settings")
            }
        } catch {
            toast.error("An unexpected error occurred")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="font-geist max-w-4xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8 pb-20">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Settings</h1>
                <p className="text-zinc-500 text-sm md:text-base">Manage your profile, preferences, and account security.</p>
            </div>

            <div className="grid gap-6 md:gap-8">
                {/* Profile Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-base md:text-lg font-semibold text-zinc-900 dark:text-white">
                        <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        <h2>Profile</h2>
                    </div>
                    <GlassCard className="p-4 md:p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                            <div className="h-20 w-20 shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-700 shadow-sm">
                                {authUser?.photoURL ? (
                                    <img src={authUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-zinc-400" />
                                )}
                            </div>
                            <div className="space-y-2 sm:space-y-1 mt-2 sm:mt-0">
                                <Button variant="outline" size="sm" className="clay-btn border-none font-bold text-zinc-700 dark:text-zinc-300 transition-all text-xs md:text-sm">Change Avatar</Button>
                                <p className="text-xs text-zinc-400">Linked to your Google Account</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm">Display Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Your name"
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm">Username (for Public Profile)</Label>
                                <div className="relative">
                                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <Input
                                        id="username"
                                        className="pl-9 h-11"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                                        placeholder="unique_handle"
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-400">pilot/${formData.username || '...'}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm">Email</Label>
                                <Input id="email" defaultValue={authUser?.email || ""} disabled className="bg-zinc-50 dark:bg-zinc-900/50 h-11" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="bio" className="text-sm">Bio</Label>
                                <Input
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell us a little about yourself"
                                    className="h-11"
                                />
                            </div>
                        </div>
                    </GlassCard>
                </section>

                {/* Notifications */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-base md:text-lg font-semibold text-zinc-900 dark:text-white">
                        <Bell className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        <h2>Notifications</h2>
                    </div>
                    <GlassCard className="p-4 md:p-6 divide-y divide-zinc-100 dark:divide-zinc-800">
                        <div className="flex items-center justify-between py-3 gap-4">
                            <div className="space-y-0.5 min-w-0">
                                <Label className="text-sm md:text-base pr-2 truncate block">Daily Briefing</Label>
                                <p className="text-xs md:text-sm text-zinc-500 truncate block">Receive a morning summary of tasks.</p>
                            </div>
                            <Switch
                                checked={formData.dailyBriefing}
                                onCheckedChange={(val) => setFormData({ ...formData, dailyBriefing: val })}
                                className="shrink-0"
                            />
                        </div>
                        <div className="flex items-center justify-between py-3 gap-4">
                            <div className="space-y-0.5 min-w-0">
                                <Label className="text-sm md:text-base pr-2 truncate block">Milestone Alerts</Label>
                                <p className="text-xs md:text-sm text-zinc-500 truncate block">Get notified when you unlock new roadmap nodes.</p>
                            </div>
                            <Switch
                                checked={formData.milestoneAlerts}
                                onCheckedChange={(val) => setFormData({ ...formData, milestoneAlerts: val })}
                                className="shrink-0"
                            />
                        </div>
                        <div className="flex items-center justify-between py-3 gap-4">
                            <div className="space-y-0.5 min-w-0">
                                <Label className="text-sm md:text-base pr-2 truncate block">Email Updates</Label>
                                <p className="text-xs md:text-sm text-zinc-500 truncate block">Receive weekly progress reports via email.</p>
                            </div>
                            <Switch
                                checked={formData.emailUpdates}
                                onCheckedChange={(val) => setFormData({ ...formData, emailUpdates: val })}
                                className="shrink-0"
                            />
                        </div>
                    </GlassCard>
                </section>

                {/* Security */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-base md:text-lg font-semibold text-zinc-900 dark:text-white">
                        <Shield className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        <h2>Security</h2>
                    </div>
                    <GlassCard className="p-4 md:p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                            <div className="space-y-0.5">
                                <Label className="text-sm md:text-base">Account Protection</Label>
                                <p className="text-xs md:text-sm text-zinc-500">Your account is secured via Firebase Authentication.</p>
                            </div>
                            <Button variant="outline" size="sm" className="clay-btn border-none font-bold text-zinc-500 transition-all text-xs w-full sm:w-auto" disabled>Manage Auth</Button>
                        </div>
                        <Separator />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-red-600 gap-4 sm:gap-0">
                            <div className="space-y-0.5">
                                <Label className="text-sm md:text-base text-red-600">Danger Zone</Label>
                                <p className="text-xs md:text-sm text-zinc-500">Actions here are permanent.</p>
                            </div>
                            <Button variant="destructive" size="sm" className="font-bold border-none transition-all text-xs w-full sm:w-auto">Delete Account</Button>
                        </div>
                    </GlassCard>
                </section>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 mt-4">
                    <Button variant="ghost" className="clay-btn bg-transparent shadow-none border-none text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-bold transition-all w-full sm:w-auto text-sm h-11" disabled={isSaving} onClick={() => window.location.reload()}>Cancel</Button>
                    <Button
                        className="clay-btn-primary min-w-[140px] font-bold transition-all w-full sm:w-auto text-sm h-11"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
