"use client"

import { motion } from 'framer-motion'
import { Brain, Lightbulb, TrendingUp, Zap } from 'lucide-react'

interface AIInsight {
  title: string
  description: string
  icon: any
  color: string
  recommendation: string
}

export function AIInsightsSection() {
  const insights: AIInsight[] = [
    {
      title: 'Peak Productivity Hours',
      description: 'You\'re most productive between 9-11 AM',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      recommendation: 'Schedule complex tasks during this window'
    },
    {
      title: 'Context Patterns',
      description: 'You switch between projects 12 times daily',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      recommendation: 'Try time-blocking to reduce context switches'
    },
    {
      title: 'Task Completion Rate',
      description: '87% completion rate this week',
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
      recommendation: 'Great momentum! Keep up the consistency'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">AI Insights</h3>
          <p className="text-sm text-slate-400">Personalized productivity recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
              className="relative p-5 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600 transition-all group overflow-hidden"
            >
              {/* Animated gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${insight.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Glow orb */}
              <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${insight.color} rounded-full blur-2xl opacity-20`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${insight.color} mb-4 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                {/* Title */}
                <h4 className="text-lg font-bold text-white mb-2">{insight.title}</h4>
                
                {/* Description */}
                <p className="text-sm text-slate-300 mb-3">{insight.description}</p>
                
                {/* Recommendation */}
                <div className="pt-3 border-t border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">💡 Recommendation:</p>
                  <p className="text-sm text-slate-300 font-medium">{insight.recommendation}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
