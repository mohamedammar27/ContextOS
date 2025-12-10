"use client"

import { motion } from 'framer-motion'
import GradientText from '@/components/reactbits/text-animation/GradientText'
import ShinyText from '@/components/reactbits/text-animation/ShinyText'
import MagicBento from '@/components/reactbits/ui-components/MagicBento'
import { Cpu, Workflow, Zap, Database, Calendar, ScanText, Sparkles } from 'lucide-react'
import '@/components/reactbits/text-animation/GradientText.css'
import '@/components/reactbits/text-animation/ShinyText.css'
import '@/components/reactbits/ui-components/MagicBento.css'

const DeepTechSection = () => {
  const techStack = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Oumi Agents",
      description: "Structured outputs, multi-step reasoning, JSON-perfect task extraction",
      label: "AI Core",
      color: '#0a0015',
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Workflow className="w-6 h-6" />,
      title: "Kestra",
      description: "Production-grade workflows, scheduling, retries, observability",
      label: "Orchestration",
      color: '#0a0015',
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "LLM Engine",
      description: "Together AI for fast inference with Groq fallback",
      label: "Inference",
      color: '#0a0015',
      gradient: "from-orange-500 to-red-500",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop&q=80"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Memory Engine",
      description: "Intelligent log pruning and context storage",
      label: "Storage",
      color: '#0a0015',
      gradient: "from-green-500 to-emerald-500",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop&q=80"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Daily Planner",
      description: "Context-aware scheduling that learns your patterns",
      label: "Planning",
      color: '#0a0015',
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <ScanText className="w-6 h-6" />,
      title: "OCR Engine",
      description: "Advanced text extraction with 99% accuracy",
      label: "Vision",
      color: '#0a0015',
      gradient: "from-pink-500 to-rose-500"
    }
  ]

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Gradient Background with Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      
      {/* Animated Breathing Orbs */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_70%)]" />
      
      {/* Animated particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-20 left-20"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl bottom-20 right-20"
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md border border-purple-500/20 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <ShinyText 
              text="Enterprise Technology Stack"
              className="text-sm font-medium text-purple-200"
              speed={3}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <GradientText 
              className="text-5xl sm:text-6xl md:text-7xl font-black mb-6"
              colors={['#60a5fa', '#a78bfa', '#ec4899', '#f59e0b', '#10b981']}
              animationSpeed={6}
            >
              Powered by Production-Grade AI Infrastructure
            </GradientText>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg sm:text-xl text-slate-300/90 max-w-3xl mx-auto"
          >
            Enterprise-grade technology stack powering intelligent context capture and analysis
          </motion.p>
        </div>

        {/* MagicBento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <MagicBento 
            cards={techStack.map((tech, index) => ({
              color: tech.color,
              title: tech.title,
              description: tech.description,
              label: tech.label,
              icon: tech.icon,
              gradient: tech.gradient,
              image: tech.image
            }))}
            textAutoHide={false}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            clickEffect={true}
            enableMagnetism={true}
            spotlightRadius={350}
            particleCount={15}
            glowColor="132, 0, 255"
          />
        </motion.div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-slate-400 text-lg">
            Built with the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 font-bold">
              best tools
            </span>
            {" "}in the AI ecosystem
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default DeepTechSection
