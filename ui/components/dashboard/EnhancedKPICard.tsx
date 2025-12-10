"use client"

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface EnhancedKPICardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
  color: string
  sparklineData: number[]
  index: number
}

export function EnhancedKPICard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
  sparklineData,
  index
}: EnhancedKPICardProps) {
  const isPositive = trend === 'up'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600 transition-all group overflow-hidden"
    >
      {/* Glowing background effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Animated glow orb */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${color} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {/* Icon with glow */}
          <div className={`relative p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-xl blur-md opacity-50`} />
            <Icon className="relative w-6 h-6 text-white" />
          </div>
          
          {/* Trend percentage */}
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
            isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{change}</span>
          </div>
        </div>
        
        {/* Value */}
        <h3 className="text-3xl font-black text-white mb-1 tracking-tight">{value}</h3>
        
        {/* Title */}
        <p className="text-sm text-slate-400 mb-4">{title}</p>
        
        {/* Sparkline */}
        <div className="h-12 -mx-2">
          <svg width="100%" height="48" className="overflow-visible">
            <defs>
              <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: "easeOut" }}
              d={generateSparklinePath(sparklineData, 100, 48)}
              fill={`url(#gradient-${index})`}
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

// Helper function to generate SVG path for sparkline
function generateSparklinePath(data: number[], width: number, height: number): string {
  if (data.length === 0) return ''
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const padding = 8
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - padding - ((value - min) / range) * (height - padding * 2)
    return { x, y }
  })
  
  // Create area path
  let path = `M 0,${height}`
  points.forEach((point, index) => {
    if (index === 0) {
      path += ` L ${point.x},${point.y}`
    } else {
      path += ` L ${point.x},${point.y}`
    }
  })
  path += ` L ${width},${height} Z`
  
  return path
}
