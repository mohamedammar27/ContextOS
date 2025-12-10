"use client"

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Github, Zap, FileText, Brain, Calendar, Sparkles, CheckCircle2 } from 'lucide-react'
import Lenis from 'lenis'
import Hyperspeed from '@/components/reactbits/backgrounds/Hyperspeed'
import ShinyText from '@/components/reactbits/text-animation/ShinyText'
import GradientText from '@/components/reactbits/text-animation/GradientText'
import SpotlightCard from '@/components/reactbits/ui-components/SpotlightCard'
import WhySection from '@/components/landing/WhySection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import DeepTechSection from '@/components/landing/DeepTechSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import { SponsorsSection } from '@/components/landing/SponsorsSection'
import PricingSection from '@/components/landing/PricingSection'
import FinalCTASection from '@/components/landing/FinalCTASection'
import { Footer } from '@/components/landing/Footer'
import '@/components/reactbits/backgrounds/Hyperspeed.css'
import '@/components/reactbits/text-animation/ShinyText.css'
import '@/components/reactbits/text-animation/GradientText.css'
import '@/components/reactbits/ui-components/SpotlightCard.css'
import 'lenis/dist/lenis.css'

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])
  const features = [
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Auto-Capture Mode",
      description: "Continuously captures your screen context - windows, tabs, code, meetings. Never lose track of what you're working on.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FileText className="w-10 h-10" />,
      title: "OCR Intelligence",
      description: "Advanced OCR extracts text from images, PDFs, and screenshots. Context never slips through the cracks.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Brain className="w-10 h-10" />,
      title: "AI Task Extraction",
      description: "LLM-powered analysis identifies actionable tasks, summaries, and insights from your captured context.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Calendar className="w-10 h-10" />,
      title: "Daily AI Planner",
      description: "Every morning, get a personalized daily plan based on your captured context, tasks, and priorities.",
      gradient: "from-green-500 to-emerald-500"
    }
  ]

  return (
    <>
      {/* Hero Section with Hyperspeed Background */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-20 bg-black overflow-hidden">
        <div id="lights" className="absolute inset-0 w-full h-full opacity-100">
          <Hyperspeed />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">New: AI-Powered Daily Planner</span>
          </motion.div>

          {/* Main Headline - Static for immediate visibility */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-white"
          >
            Your AI-Powered Context <br /> Operating System
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto mb-12"
          >
            Capture everything you see. Turn it into summaries, tasks, and daily AI plans.
          </motion.p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link
              href="/dashboard/overview"
              className="group relative px-8 py-3 bg-white text-black font-bold rounded-full text-base flex items-center gap-2 hover:scale-105 transition-all shadow-2xl hover:shadow-white/20"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="https://github.com/Yaser-123/ContextOS"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-3 bg-white/5 backdrop-blur-md border-2 border-white/20 text-white font-bold rounded-full text-base flex items-center gap-2 hover:scale-105 hover:border-white/40 hover:bg-white/10 transition-all"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm sm:text-base">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-slate-300">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300">24/7 Auto-Capture</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300">Smart Planning</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6 bg-black">
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/5 to-black" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <GradientText 
                className="text-5xl sm:text-6xl md:text-7xl font-black mb-6"
                colors={['#60a5fa', '#a78bfa', '#ec4899', '#a78bfa', '#60a5fa']}
                animationSpeed={6}
              >
                Powerful Features
              </GradientText>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-slate-300/90 max-w-3xl mx-auto"
            >
              Everything you need to capture, organize, and act on your digital context
            </motion.p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.7 }}
                className="h-full"
              >
                <SpotlightCard
                  className="p-8 sm:p-10 h-full bg-black/60 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/20 transition-all group"
                  spotlightColor={
                    feature.gradient.includes('blue') ? 'rgba(96, 165, 250, 0.15)' :
                    feature.gradient.includes('purple') ? 'rgba(167, 139, 250, 0.15)' :
                    feature.gradient.includes('orange') ? 'rgba(251, 146, 60, 0.15)' :
                    'rgba(52, 211, 153, 0.15)'
                  }
                >
                  {/* Animated Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.6, type: "spring" }}
                    className="relative inline-block mb-6"
                  >
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-2xl relative z-10`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} blur-2xl opacity-40 rounded-2xl group-hover:opacity-60 transition-opacity`} />
                  </motion.div>
                  
                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-300/90 text-base sm:text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Bottom Accent Line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl`} />
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ContextOS Section */}
      <WhySection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Deep Tech Section */}
      <DeepTechSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Sponsors/Integrations Section */}
      <SponsorsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Final CTA Section */}
      <FinalCTASection />

      {/* Footer */}
      <Footer />
    </>
  )
}
