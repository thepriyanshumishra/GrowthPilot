"use client"

import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#FDFDFF] dark:bg-black flex flex-col font-sans overflow-hidden">
            <Navbar />

            {/* Main Content Area */}
            <section className="flex-1 flex flex-col md:flex-row items-center justify-center px-4 md:px-24 max-w-7xl mx-auto w-full pt-32 pb-20">

                {/* Left Side: Sadness Image */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end md:pr-12 relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                        {/* Using the local image uploaded by the user */}
                        <img
                            src="/sadness.png"
                            alt="Sadness from Inside Out crying"
                            className="object-contain w-full h-full drop-shadow-2xl"
                        />
                    </div>
                </div>

                {/* Right Side: Text */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mt-12 md:mt-0 space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 fill-mode-both">
                    <h2 className="text-4xl md:text-[54px] leading-tight font-medium text-zinc-900 dark:text-white">
                        Awww...Don't Cry.
                    </h2>

                    <p className="text-zinc-600 dark:text-zinc-400 text-[15px] font-medium tracking-wide">
                        It's just a 404 Error!
                    </p>

                    <p className="text-zinc-600 dark:text-zinc-400 text-[15px] max-w-sm leading-relaxed">
                        What you're looking for may have been misplaced
                        in Long Term Memory.
                    </p>

                    <Link href="/">
                        <button className="mt-8 px-8 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-sm font-semibold tracking-wider transition-colors rounded-lg">
                            GO HOME
                        </button>
                    </Link>
                </div>

            </section>

            <Footer />
        </main>
    )
}
