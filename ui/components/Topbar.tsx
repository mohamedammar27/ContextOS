"use client"

import { Search, Bell, Settings as SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"

interface TopbarProps {
  title: string
}

export function Topbar({ title }: TopbarProps) {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="flex h-16 items-center justify-between px-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-64 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all"
            />
          </div>
          
          {/* Icons */}
          <Button variant="ghost" size="icon" className="glass rounded-xl hover:glass-strong">
            <SettingsIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="glass rounded-xl relative hover:glass-strong">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* Profile Picture */}
          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-neon-blue/30 hover:ring-neon-blue/50 transition-all cursor-pointer">
            <Image
              src="/assets/pfp.jpg"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
