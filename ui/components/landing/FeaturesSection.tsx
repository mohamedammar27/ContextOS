"use client"
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, FileText, Brain, Calendar } from 'lucide-react';
import SpotlightCard from '@/components/reactbits/ui-components/SpotlightCard';
import ScrollReveal from '@/components/reactbits/animation/ScrollReveal';

const scrollContainerRef = useRef(null);

const features = [
  {
    icon: Zap,
    title: 'Auto-Capture Mode',
    description: 'Automatically capture context from your browser and applications. No manual input needed.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FileText,
    title: 'OCR Document Intelligence',
    description: 'Extract text from PDFs and images using advanced OCR technology with Oumi integration.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Brain,
    title: 'AI Task Extraction',
    description: 'Leverage Together AI and Groq LLMs to automatically extract tasks from your captured context.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Calendar,
    title: 'Daily Planner Engine',
    description: 'Get AI-generated daily plans with focus tasks, schedules, and smart reminders.',
    gradient: 'from-green-500 to-emerald-500',
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-32 bg-slate-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal scrollContainerRef={null}>
          <motion.div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Everything you need to transform scattered information into organized, actionable insights
            </p>
          </motion.div>
        </ScrollReveal>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.title} scrollContainerRef={scrollContainerRef}>
                <SpotlightCard className="h-full">
                  <div className="p-8 h-full flex flex-col">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-lg leading-relaxed flex-1">
                      {feature.description}
                    </p>

                    {/* Decorative Line */}
                    <div className={`mt-6 h-1 w-20 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
