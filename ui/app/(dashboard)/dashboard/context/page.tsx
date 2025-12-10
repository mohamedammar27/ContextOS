"use client";

import { Topbar } from "@/components/Topbar";
import { motion } from "framer-motion";
import { Save, Trash2, FileText, Type, ListOrdered, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { captureContext } from "@/lib/api";

export default function ContextPage() {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const handleClear = () => {
    setContent("");
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    setToast(null);

    try {
      const result = await captureContext(content);

      if (result.ok) {
        if (result.ignored) {
          setToast({ 
            type: 'info', 
            message: 'Content was captured but marked as irrelevant by AI' 
          });
        } else {
          setToast({ 
            type: 'success', 
            message: '✓ Context saved and parsed successfully!' 
          });
          setContent(""); // Clear textarea after successful save
        }
      } else {
        setToast({ 
          type: 'error', 
          message: result.error || 'Failed to save context' 
        });
      }
    } catch (error) {
      setToast({ 
        type: 'error', 
        message: 'Network error - is backend running?' 
      });
    } finally {
      setIsSaving(false);
      // Auto-hide toast after 5 seconds
      setTimeout(() => setToast(null), 5000);
    }
  };

  // Calculate stats
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lineCount = content.split('\n').length;
  const estimatedTokens = Math.ceil(charCount / 4); // Rough estimate: 1 token ≈ 4 chars

  return (
    <div className="min-h-screen">
      <Topbar title="Context" />
      
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text-blue">Manual Context Capture</h1>
            <p className="text-muted-foreground mt-1">
              Paste any text to save as a new context entry - same pipeline as extension
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="glass-strong text-white hover:bg-black hover:text-white transition-colors" 
              onClick={handleClear}
              disabled={!content.trim()}
            >
              <Trash2 className="mr-2 h-4 w-4 text-white" />
              Clear
            </Button>
          </div>
        </motion.div>

        {/* Toast Notification */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert className={`
              glass-strong border-2
              ${toast.type === 'success' ? 'border-green-500/50 bg-green-500/10' : ''}
              ${toast.type === 'error' ? 'border-red-500/50 bg-red-500/10' : ''}
              ${toast.type === 'info' ? 'border-blue-500/50 bg-blue-500/10' : ''}
            `}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{toast.message}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Context Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-neon-blue" />
            <h2 className="text-lg font-semibold">Paste Your Content</h2>
          </div>
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[400px] bg-background/50 border border-border/50 rounded-lg p-4 outline-none font-mono text-sm resize-none focus:ring-2 focus:ring-neon-blue/50 transition-all"
            placeholder="Paste any text here - meeting notes, articles, code snippets, emails, chat logs, etc.&#10;&#10;The system will:&#10;• Save it to context logs&#10;• Parse with AI to extract tasks&#10;• Add insights to your daily plan&#10;• Update task database&#10;&#10;Same pipeline as the Chrome extension!"
          />

          <Button 
            className="w-full glass-strong hover:glow bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 hover:from-neon-blue/30 hover:to-neon-purple/30 border border-neon-blue/50"
            onClick={handleSave}
            disabled={!content.trim() || isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving & Parsing...' : 'Save as New Context'}
          </Button>
        </motion.div>

        {/* Stats & Live Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: "Characters", value: charCount.toLocaleString() },
            { icon: Type, label: "Words", value: wordCount.toLocaleString() },
            { icon: ListOrdered, label: "Lines", value: lineCount.toLocaleString() },
            { icon: Sparkles, label: "Est. Tokens", value: estimatedTokens.toLocaleString() },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-strong rounded-xl p-4 hover:glow transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className="h-5 w-5 text-neon-blue" />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold gradient-text-blue">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6 border border-neon-blue/20"
        >
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-neon-purple" />
            How It Works
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <strong className="text-foreground">1. Save Context</strong>
              <p>Your text is saved to <code className="text-xs bg-background/50 px-1 py-0.5 rounded">context-log.json</code></p>
            </div>
            <div>
              <strong className="text-foreground">2. AI Parsing</strong>
              <p>LLM extracts tasks, summaries, and insights</p>
            </div>
            <div>
              <strong className="text-foreground">3. Task Extraction</strong>
              <p>Identified tasks added to your task database</p>
            </div>
            <div>
              <strong className="text-foreground">4. Daily Plan Integration</strong>
              <p>Context influences future daily plan generation</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
