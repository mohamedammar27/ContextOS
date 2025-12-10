"use client"

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface SourceDistributionChartProps {
  data: Array<{ name: string; value: number }>
}

const COLORS = ['#3b82f6', '#a855f7', '#f59e0b', '#10b981', '#ef4444', '#06b6d4']

export function SourceDistributionChart({ data }: SourceDistributionChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Top Context Sources</h3>
        <p className="text-sm text-slate-400">Where your contexts come from</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
