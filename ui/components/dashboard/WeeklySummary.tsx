"use client"

import { motion } from 'framer-motion'
import { Calendar, FileText, CheckCircle2, Sparkles } from 'lucide-react'

interface WeeklySummaryProps {
  data: {
    totalContexts: number
    totalTasks: number
    totalSummaries: number
    totalPlans: number
  }
}

export function WeeklySummary({ data }: WeeklySummaryProps) {
  const items = [
    {
      label: 'Contexts Captured',
      value: data.totalContexts,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      label: 'Tasks Extracted',
      value: data.totalTasks,
      icon: CheckCircle2,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    },
    {
      label: 'Summaries Generated',
      value: data.totalSummaries,
      icon: Sparkles,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-400'
    },
    {
      label: 'Daily Plans',
      value: data.totalPlans,
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Weekly Summary</h3>
          <p className="text-sm text-slate-400">Your productivity this week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
              className={`relative p-4 rounded-xl ${item.bgColor} border border-slate-700/30 hover:border-slate-600 transition-all group overflow-hidden`}
            >
              {/* Subtle glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative z-10 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-400 mb-1">{item.label}</p>
                  <p className={`text-2xl font-black ${item.textColor}`}>{item.value}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom stat */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Average Daily Activity</span>
          <span className="text-lg font-bold text-white">
            {Math.round((data.totalContexts + data.totalTasks) / 7)} items/day
          </span>
        </div>
      </div>
    </motion.div>
  )
}
