"use client"

import { motion } from 'framer-motion'
import GradientText from '@/components/reactbits/text-animation/GradientText'
import ShinyText from '@/components/reactbits/text-animation/ShinyText'
import ChromaGrid from '@/components/reactbits/backgrounds/ChromaGrid'
import { Shield, Sparkles, Brain, Clock } from 'lucide-react'
import '@/components/reactbits/text-animation/GradientText.css'
import '@/components/reactbits/text-animation/ShinyText.css'
import '@/components/reactbits/backgrounds/ChromaGrid.css'

const WhySection = () => {
  const reasons = [
    {
      image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400&q=80',
      title: "Never lose context again",
      subtitle: "Everything captured automatically, timestamped, searchable. Your entire digital workflow becomes your memory.",
      handle: "Auto-Capture",
      borderColor: '#3B82F6',
      gradient: 'linear-gradient(145deg, #3B82F6, #000)',
      icon: Clock
    },
    {
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80',
      title: "LLM-powered task extraction",
      subtitle: "Eliminates manual planning. AI reads your screens, extracts tasks, summaries, and action items automatically.",
      handle: "AI Analysis",
      borderColor: '#A855F7',
      gradient: 'linear-gradient(210deg, #A855F7, #EC4899, #000)',
      icon: Brain
    },
    {
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80',
      title: "AI daily planner that adapts to you",
      subtitle: "Wake up to a perfectly organized day. AI understands your patterns, priorities, and deadlines.",
      handle: "Smart Planning",
      borderColor: '#F59E0B',
      gradient: 'linear-gradient(165deg, #F59E0B, #EAB308, #000)',
      icon: Sparkles
    },
    {
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=80',
      title: "Privacy-first local processing",
      subtitle: "With memory lifecycle pruning. Your data stays yours. Smart cleanup keeps storage efficient.",
      handle: "Secure & Private",
      borderColor: '#10B981',
      gradient: 'linear-gradient(195deg, #10B981, #000)',
      icon: Shield
    }
  ]

  return (
    <section className="relative py-32 px-6 bg-black">
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-black to-black" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with Enhanced Animations */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md border border-purple-500/20 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <ShinyText 
              text="The Problem We're Solving"
              className="text-sm font-medium text-purple-200"
              speed={3}
            />
          </motion.div>

          <GradientText
            className="text-5xl sm:text-6xl md:text-7xl font-black mb-6"
            colors={['#60a5fa', '#a78bfa', '#ec4899', '#f59e0b', '#10b981']}
            animationSpeed={5}
          >
            Why ContextOS Exists
          </GradientText>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-xl text-slate-300/90 max-w-3xl mx-auto"
          >
            Built to solve the context-switching nightmare that plagues modern knowledge work
          </motion.p>
        </div>

        {/* ChromaGrid Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ChromaGrid 
            items={reasons}
            columns={2}
            rows={2}
            radius={400}
            damping={0.5}
            fadeOut={0.8}
            className="max-w-6xl mx-auto"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default WhySection
