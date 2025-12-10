"use client"

import { motion } from 'framer-motion'
import GlassSurface from '@/components/reactbits/ui-components/GlassSurface'
import ShinyText from '@/components/reactbits/text-animation/ShinyText'
import GradientText from '@/components/reactbits/text-animation/GradientText'
import { Check, X, Sparkles } from 'lucide-react'
import '@/components/reactbits/ui-components/GlassSurface.css'
import '@/components/reactbits/text-animation/ShinyText.css'
import '@/components/reactbits/text-animation/GradientText.css'

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "Coming Soon",
      description: "Perfect for individuals getting started with context capture",
      features: [
        "1,000 captures/month",
        "Basic OCR",
        "7-day context history",
        "Daily AI planner",
        "Community support"
      ],
      notIncluded: [
        "Advanced analytics",
        "Priority AI processing",
        "Custom workflows"
      ],
      gradient: "from-blue-500 to-cyan-500",
      popular: false
    },
    {
      name: "Pro",
      price: "Coming Soon",
      description: "For professionals who need unlimited context and advanced features",
      features: [
        "Unlimited captures",
        "Advanced OCR with 99% accuracy",
        "Unlimited context history",
        "Priority AI processing",
        "Advanced analytics",
        "Custom workflows",
        "Priority support"
      ],
      notIncluded: [],
      gradient: "from-purple-500 to-pink-500",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Coming Soon",
      description: "Custom solutions for teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "SSO & SAML",
        "Custom AI models",
        "On-premise deployment",
        "SLA guarantee",
        "Dedicated support"
      ],
      notIncluded: [],
      gradient: "from-orange-500 to-red-500",
      popular: false
    }
  ]

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-black to-orange-900/20" />
      
      {/* Radial Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.08),transparent_60%)]" />
      
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
              text="Simple, Transparent Pricing"
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
              colors={['#60a5fa', '#a78bfa', '#ec4899', '#f59e0b']}
              animationSpeed={6}
            >
              Choose Your Plan
            </GradientText>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg sm:text-xl text-slate-300/90 max-w-3xl mx-auto"
          >
            Launch pricing coming soon. Join the waitlist to get early access
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: index * 0.15, 
                duration: 0.7,
                type: "spring"
              }}
              className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className={`px-6 py-2 bg-gradient-to-r ${plan.gradient} rounded-full shadow-lg`}>
                    <span className="text-white font-bold text-sm">Most Popular</span>
                  </div>
                </div>
              )}

              {/* Glass Card */}
              <div className={`relative h-full p-8 lg:p-10 bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-xl rounded-3xl border-2 ${
                plan.popular ? 'border-purple-500/50' : 'border-white/10'
              } hover:border-white/20 transition-all duration-500 group`}>
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-3xl pointer-events-none`} />
                
                <div className="relative z-10">
                  {/* Plan Name */}
                  <h3 className="text-3xl font-black text-white mb-2">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-4">
                    <div className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${plan.gradient}`}>
                      {plan.price}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-300/80 text-sm mb-8 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* CTA Button */}
                  <button
                    disabled
                    className={`w-full py-4 rounded-xl font-bold text-white mb-8 transition-all duration-300 ${
                      plan.popular
                        ? `bg-gradient-to-r ${plan.gradient} hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20`
                        : 'bg-white/10 hover:bg-white/15 border border-white/20'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Notify Me
                  </button>

                  {/* Features List */}
                  <div className="space-y-4 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center mt-0.5`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-200 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 opacity-40">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center mt-0.5">
                          <X className="w-3 h-3 text-slate-400" />
                        </div>
                        <span className="text-slate-400 text-sm leading-relaxed line-through">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${plan.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
            </motion.div>
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
            All plans include{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 font-bold">
              end-to-end encryption
            </span>
            {" "}and local-first data processing
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default PricingSection
