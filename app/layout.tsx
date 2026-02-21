import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { DynamicBackground } from "@/components/DynamicBackground";
import { FloatingThemeToggle } from "@/components/FloatingThemeToggle"
import { PWAHandler } from "@/components/PWAHandler";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { FocusProvider } from "@/context/FocusContext";
import { ThemeProvider } from "@/components/theme-provider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrowthPilot — AI Career Growth Copilot",
  description: "Navigate your career growth with precision using AI-native roadmaps and coaching.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <FocusProvider>
              <Toaster position="top-center" richColors />
              <PWAHandler />
              <DynamicBackground />
              {children}
              <FloatingThemeToggle />
            </FocusProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
