"use client"

import { motion } from 'framer-motion'
import { Activity, Clock, CheckCircle2, TrendingUp, Target, Zap } from 'lucide-react'
import { EnhancedKPICard } from '@/components/dashboard/EnhancedKPICard'
import { ContextCaptureChart } from '@/components/dashboard/ContextCaptureChart'
import { TaskCompletionChart } from '@/components/dashboard/TaskCompletionChart'
import { SourceDistributionChart } from '@/components/dashboard/SourceDistributionChart'
import { WeeklySummary } from '@/components/dashboard/WeeklySummary'
import { AIInsightsSection } from '@/components/dashboard/AIInsightsSection'

export default function OverviewPage() {
  // KPI data with sparklines
  const stats = [
    {
      title: "Total Context Captured",
      value: "1,284",
      change: "12.5%",
      trend: 'up' as const,
      icon: Activity,
      color: "from-blue-500 to-cyan-500",
      sparklineData: [45, 52, 48, 65, 72, 68, 85, 92, 88, 95, 102, 98, 110, 125]
    },
    {
      title: "Tasks Completed",
      value: "156",
      change: "8.2%",
      trend: 'up' as const,
      icon: CheckCircle2,
      color: "from-purple-500 to-pink-500",
      sparklineData: [10, 15, 12, 18, 22, 19, 25, 28, 24, 30, 35, 32, 38, 42]
    },
    {
      title: "Active Sessions",
      value: "42",
      change: "3.1%",
      trend: 'up' as const,
      icon: Clock,
      color: "from-orange-500 to-red-500",
      sparklineData: [5, 6, 7, 6, 8, 9, 8, 10, 9, 11, 10, 12, 11, 12]
    },
    {
      title: "Productivity Score",
      value: "94%",
      change: "5.7%",
      trend: 'up' as const,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      sparklineData: [75, 78, 80, 82, 85, 83, 87, 89, 88, 90, 92, 91, 93, 94]
    }
  ]

  // Context capture timeline data
  const contextData = [
    { date: 'Mon', contexts: 145 },
    { date: 'Tue', contexts: 178 },
    { date: 'Wed', contexts: 192 },
    { date: 'Thu', contexts: 165 },
    { date: 'Fri', contexts: 210 },
    { date: 'Sat', contexts: 98 },
    { date: 'Sun', contexts: 125 }
  ]

  // Task completion data
  const taskData = [
    { date: 'Mon', completed: 18, extracted: 25 },
    { date: 'Tue', completed: 22, extracted: 28 },
    { date: 'Wed', completed: 25, extracted: 30 },
    { date: 'Thu', completed: 20, extracted: 26 },
    { date: 'Fri', completed: 28, extracted: 32 },
    { date: 'Sat', completed: 15, extracted: 18 },
    { date: 'Sun', completed: 17, extracted: 20 }
  ]

  // Source distribution data
  const sourceData = [
    { name: 'Chrome', value: 385 },
    { name: 'VS Code', value: 298 },
    { name: 'Notion', value: 187 },
    { name: 'Slack', value: 156 },
    { name: 'WhatsApp', value: 142 },
    { name: 'Other', value: 116 }
  ]

  // Weekly summary data
  const weeklyData = {
    totalContexts: 1113,
    totalTasks: 179,
    totalSummaries: 42,
    totalPlans: 7
  }

  // Recent activity
  const recentActivities = [
    { action: "Captured meeting notes", time: "2 minutes ago", color: "bg-blue-500" },
    { action: "Completed 3 tasks", time: "1 hour ago", color: "bg-purple-500" },
    { action: "Analyzed document context", time: "3 hours ago", color: "bg-orange-500" },
    { action: "Generated daily plan", time: "Today at 9:00 AM", color: "bg-green-500" },
    { action: "Extracted 12 tasks from meeting", time: "Yesterday at 4:30 PM", color: "bg-cyan-500" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Dashboard Overview
        </h1>
        <p className="text-slate-400 text-lg">Your productivity analytics at a glance</p>
      </motion.div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <EnhancedKPICard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContextCaptureChart data={contextData} />
        <TaskCompletionChart data={taskData} />
      </div>

      {/* Source Distribution & Weekly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SourceDistributionChart data={sourceData} />
        <WeeklySummary data={weeklyData} />
      </div>

      {/* AI Insights */}
      <AIInsightsSection />

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:bg-slate-800/70 hover:border-slate-600 transition-all group"
            >
              <div className={`w-2 h-2 rounded-full ${activity.color} shadow-lg`}>
                <div className={`w-2 h-2 rounded-full ${activity.color} animate-ping absolute`} />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium group-hover:text-blue-300 transition-colors">
                  {activity.action}
                </p>
                <p className="text-sm text-slate-400">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
