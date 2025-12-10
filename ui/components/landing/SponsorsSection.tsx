"use client"

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const sponsors = [
  {
    name: 'Groq',
    description: 'Lightning-fast LLM Inference',
    logo: '⚡',
    url: 'https://groq.com',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    name: 'Oumi',
    description: 'AI Agent Framework',
    logo: '🧠',
    url: 'https://oumi.ai',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Kestra',
    description: 'Workflow Orchestration',
    logo: '🔄',
    url: 'https://kestra.io',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Vercel',
    description: 'Deployment Platform',
    logo: '▲',
    url: 'https://vercel.com',
    gradient: 'from-slate-700 to-slate-900'
  },
  {
    name: 'ReactBits',
    description: 'Premium UI Components',
    logo: '⚛️',
    url: 'https://reactbits.dev',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    name: 'Next.js',
    description: 'React Framework',
    logo: '▲',
    url: 'https://nextjs.org',
    gradient: 'from-slate-800 to-black'
  }
]

export function SponsorsSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md border border-purple-500/20 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-200">Built with the Best</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6"
          >
            Powered By Industry Leaders
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg sm:text-xl text-slate-300/90 max-w-3xl mx-auto"
          >
            Built on cutting-edge technology from the best tools in the ecosystem
          </motion.p>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {sponsors.map((sponsor, index) => (
            <motion.a
              key={sponsor.name}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative p-8 lg:p-10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 h-full flex flex-col items-center justify-center text-center overflow-hidden">
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${sponsor.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500`} />
                
                {/* Logo with animated background */}
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1 + 0.3, 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 150
                  }}
                  className="relative mb-6"
                >
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${sponsor.gradient} flex items-center justify-center shadow-2xl relative z-10`}>
                    <span className="text-4xl">{sponsor.logo}</span>
                  </div>
                  {/* Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${sponsor.gradient} blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 rounded-2xl`} />
                </motion.div>

                {/* Name */}
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 relative z-10">
                  {sponsor.name}
                </h3>

                {/* Description */}
                <p className="text-slate-300/80 text-sm sm:text-base relative z-10">
                  {sponsor.description}
                </p>

                {/* Bottom Accent Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${sponsor.gradient} opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-slate-400 text-base">
            Standing on the shoulders of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 font-bold">
              giants
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
