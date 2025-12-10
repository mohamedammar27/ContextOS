"use client"

import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import Aurora from '@/components/reactbits/backgrounds/Aurora';
import SplitText from '@/components/reactbits/text-animation/SplitText';
import ShinyText from '@/components/reactbits/text-animation/ShinyText';
import GlareHover from '@/components/reactbits/animation/GlareHover';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Animated Headline with SplitText */}
        <div className="mb-8">
          <SplitText
            text="Your AI-Powered Context Operating System"
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
            delay={50}
            duration={0.8}
          onLetterAnimationComplete={() => {
            console.log("SplitText animation finished!");
          }}
          />
        </div>

        {/* Subheadline with ShinyText */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mb-12"
        >
          <ShinyText
            text="Capture everything automatically. Turn it into tasks, summaries, and daily AI plans."
            className="text-xl md:text-2xl lg:text-3xl text-slate-300 max-w-4xl mx-auto"
          />
        </motion.div>

        {/* CTA Buttons with GlareHover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/dashboard/overview">
            <GlareHover className="group relative px-10 py-5 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:from-blue-600 group-hover:to-purple-600 transition-all" />
              <div className="relative flex items-center gap-3 text-white text-lg font-semibold">
                Open Dashboard
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </GlareHover>
          </Link>

          <a
            href="https://github.com/Yaser-123/ContextOS"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlareHover className="group relative px-10 py-5 rounded-2xl overflow-hidden border border-slate-700">
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xl group-hover:bg-slate-800/70 transition-all" />
              <div className="relative flex items-center gap-3 text-white text-lg font-semibold">
                <Github className="h-5 w-5" />
                View on GitHub
              </div>
            </GlareHover>
          </a>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {[
            { label: 'Auto Capture', value: 'Context', gradient: 'from-blue-400 to-cyan-400' },
            { label: 'AI Task', value: 'Extraction', gradient: 'from-purple-400 to-pink-400' },
            { label: 'Daily AI', value: 'Plans', gradient: 'from-green-400 to-emerald-400' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.7 + index * 0.1 }}
              className="p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3`}>
                {stat.value}
              </div>
              <div className="text-slate-400 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
}
