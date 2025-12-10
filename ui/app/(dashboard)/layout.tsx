import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/Sidebar"
import { Toaster } from "@/components/ui/toaster"
import "primereact/resources/themes/lara-light-blue/theme.css"
import "primeicons/primeicons.css"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "ContextOS - AI-Powered Context Management",
  description: "Futuristic workspace for intelligent context capture and organization",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 ml-64 transition-all duration-300">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
