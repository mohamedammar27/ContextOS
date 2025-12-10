"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import Image from "next/image"

export function AnimatedHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl glass-strong p-12 glow"
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">AI-Powered Context</span>
          </motion.div>
          
          <motion.h1
            className="text-5xl font-bold mb-3 gradient-text-blue leading-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Welcome to ContextOS
          </motion.h1>
          
          <motion.p
            className="text-muted-foreground text-lg max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Your intelligent workspace for capturing, organizing, and leveraging context with AI
          </motion.p>
        </div>
        
        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative w-72 h-56 ml-24 flex-shrink-0"
        >
          <Image
            src="/assets/hero.png"
            alt="AI Illustration"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </div>
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-neon-blue/20 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-neon-purple/20 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-neon-blue rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  )
}
