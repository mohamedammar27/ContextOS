"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import GradientText from '@/components/reactbits/text-animation/GradientText'
import PixelCard from '@/components/reactbits/ui-components/PixelCard'
import '@/components/reactbits/text-animation/GradientText.css'
import '@/components/reactbits/ui-components/PixelCard.css'

const FinalCTASection = () => {
  return (
    <section className="relative py-40 px-6 overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.2),transparent_60%)]" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(124, 58, 237, 0.3) 2px, transparent 2px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.3) 2px, transparent 2px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 25s linear infinite'
        }} />
      </div>

      {/* Floating particles with rotation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-3xl top-20 left-[10%]"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl bottom-20 right-[10%]"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute w-80 h-80 bg-pink-500/15 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md border border-purple-500/30 rounded-full mb-12"
        >
          <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          <span className="text-base font-medium text-purple-200">
            Join 1000+ Early Adopters
          </span>
        </motion.div>

        {/* Main CTA Card with Electric Border */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <PixelCard
            colors="#a78bfa,#ec4899,#8b5cf6"
            speed={35}
            gap={5}
            className="relative"
            noFocus={true}
          >
            <div className="relative p-12 sm:p-16">
              <div className="relative z-10">
                {/* Headline with Gradient Text */}
                <GradientText 
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight"
                  colors={['#60a5fa', '#a78bfa', '#ec4899', '#f97316', '#a78bfa', '#60a5fa']}
                  animationSpeed={8}
                >
                  Start Capturing Context Today
                </GradientText>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-xl sm:text-2xl md:text-3xl text-slate-200 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
                >
                  Transform your workflow with AI-powered context capture
                </motion.p>
                
                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.6, type: "spring", stiffness: 150 }}
                >
                  <Link
                    href="/dashboard"
                    className="group relative inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white font-black rounded-full text-xl hover:scale-105 transition-all duration-300 shadow-2xl overflow-hidden border border-slate-500/30"
                  >
                    {/* Animated Background Shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <span className="relative z-10">Launch Dashboard</span>
                    <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                    
                    {/* Outer Glow Effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity -z-10" />
                  </Link>
                </motion.div>

                {/* Sub-text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="text-slate-400 text-sm mt-8"
                >
                  No credit card required • Free to start • Cancel anytime
                </motion.p>
              </div>
            </div>
          </PixelCard>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 text-slate-400 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Privacy-First</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-300" />
            <span>Local Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-600" />
            <span>Open Source</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FinalCTASection
