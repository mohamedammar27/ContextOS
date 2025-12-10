"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Calendar, Settings, Sparkles, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"

const navItems = [
  { name: "Overview", href: "/dashboard/overview", icon: Home },
  { name: "Daily Planner", href: "/dashboard", icon: Sparkles },
  { name: "Context", href: "/dashboard/context", icon: FileText },
  { name: "AI Chatbot", href: "/dashboard/chatbot", icon: Bot },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen glass-strong transition-all duration-300 border-r border-white/5",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text-blue">
                ContextOS
              </h1>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 relative overflow-hidden",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-muted-foreground hover:text-white hover:bg-white/5",
                    collapsed && "justify-center"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={cn(
                    "h-5 w-5 shrink-0 relative z-10 transition-all",
                    isActive && "text-neon-blue"
                  )} />
                  {!collapsed && (
                    <span className="relative z-10">{item.name}</span>
                  )}
                  {isActive && !collapsed && (
                    <motion.div
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <motion.div 
            className="pt-4 border-t border-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-muted-foreground text-center">
              v2.0 • Futuristic AI
            </p>
          </motion.div>
        )}
      </div>
    </motion.aside>
  )
}
