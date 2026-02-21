"use client"

import Link from "next/link"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-[#333333]">
            {/* Header / Navbar */}
            <header className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-8 md:py-12 gap-8 md:gap-0">
                <Link href="/" className="group">
                    <h1 className="font-serif text-[28px] tracking-[0.6em] ml-[0.3em] font-medium text-black">
                        P I X A R
                    </h1>
                </Link>

                <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-[11px] font-bold tracking-[0.15em] text-[#333333]">
                    <Link href="#" className="hover:text-black transition-colors">FEATURE FILMS</Link>
                    <Link href="#" className="hover:text-black transition-colors">SHORT FILMS</Link>
                    <Link href="#" className="hover:text-black transition-colors">TECHNOLOGY</Link>
                    <Link href="#" className="hover:text-black transition-colors">EXTRAS</Link>
                    <Link href="#" className="hover:text-black transition-colors">CAREERS</Link>
                    <Link href="/about" className="hover:text-black transition-colors">ABOUT</Link>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-8 md:px-24 max-w-7xl mx-auto w-full pb-12">

                {/* Left Side: Sadness Image */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end md:pr-12 relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                        {/* Using a reliable publicly available Sadness transparent PNG URL as a source, falling back nicely if broken */}
                        <img
                            src="https://static.wikia.nocookie.net/disney/images/5/54/Sadness_Inside_Out.png"
                            alt="Sadness from Inside Out crying"
                            className="object-contain w-full h-full drop-shadow-2xl"
                            onError={(e) => {
                                // Fallback if Wikia image blocks hotlinking
                                e.currentTarget.src = "https://lumiere-a.akamaihd.net/v1/images/open-uri20150422-20810-s1q5sn_36d19472.jpeg";
                                e.currentTarget.className = "object-contain w-full h-full rounded-2xl";
                            }}
                        />
                    </div>
                </div>

                {/* Right Side: Text */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mt-12 md:mt-0 space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 fill-mode-both">
                    <h2 className="text-4xl md:text-[54px] leading-tight font-medium text-[#222222]">
                        Awww...Don't Cry.
                    </h2>

                    <p className="text-[#555555] text-[15px] font-medium tracking-wide">
                        It's just a 404 Error!
                    </p>

                    <p className="text-[#555555] text-[15px] max-w-sm leading-relaxed">
                        What you're looking for may have been misplaced
                        in Long Term Memory.
                    </p>

                    <Link href="/">
                        <button className="mt-8 px-8 py-3 bg-[#f4f4f4] hover:bg-[#e4e4e4] text-[#333333] text-sm font-semibold tracking-wider transition-colors rounded">
                            GO HOME
                        </button>
                    </Link>
                </div>

            </main>
        </div>
    )
}
