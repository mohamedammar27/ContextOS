"use client";

import { Topbar } from "@/components/Topbar";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const initialTasks = [
  { id: 1, title: "Review captured contexts from GitHub", priority: "high", status: "pending", date: "2025-12-07" },
  { id: 2, title: "Process daily summaries with AI", priority: "medium", status: "done", date: "2025-12-07" },
  { id: 3, title: "Update API keys in settings", priority: "high", status: "pending", date: "2025-12-07" },
  { id: 4, title: "Backup context database", priority: "low", status: "done", date: "2025-12-06" },
  { id: 5, title: "Generate weekly report", priority: "medium", status: "pending", date: "2025-12-08" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks)

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: task.status === 'done' ? 'pending' : 'done' } : task
    ));
  };

  return (
    <div className="min-h-screen">
      <Topbar title="Tasks" />
      
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text-blue">Task Management</h1>
            <p className="text-muted-foreground mt-1">Organize and track your daily tasks</p>
          </div>
          <Button className="glass-strong hover:glow">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </motion.div>

        {/* Tasks List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-6 space-y-3"
        >
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`glass rounded-xl p-5 hover:glass-strong transition-all group cursor-pointer ${
                task.status === 'done' ? 'opacity-60' : ''
              }`}
              onClick={() => toggleTask(task.id)}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="mt-0.5"
                >
                  {task.status === 'done' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground group-hover:text-neon-blue transition-colors" />
                  )}
                </motion.div>

                {/* Task Content */}
                <div className="flex-1">
                  <div className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-muted-foreground">{task.date}</span>
                  </div>
                </div>

                {/* Delete Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    setTasks(tasks.filter(t => t.id !== task.id))
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: tasks.length },
            { label: "Completed", value: tasks.filter(t => t.status === 'done').length },
            { label: "Pending", value: tasks.filter(t => t.status === 'pending').length },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="glass-strong rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold gradient-text-blue">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
