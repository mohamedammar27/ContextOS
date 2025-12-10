"use client"

import { motion } from 'framer-motion'
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TaskCompletionChartProps {
  data: Array<{ date: string; completed: number; extracted: number }>
}

export function TaskCompletionChart({ data }: TaskCompletionChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Tasks: Completed vs Extracted</h3>
        <p className="text-sm text-slate-400">Track your task completion rate</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="extracted" 
              fill="#a855f7" 
              radius={[8, 8, 0, 0]}
              name="Extracted"
            />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 4 }}
              name="Completed"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
