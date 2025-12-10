"use client";

import { Topbar } from "@/components/Topbar";
import { motion } from "framer-motion";
import { Send, Bot, User, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { getBaseUrl } from "@/lib/settings";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const baseUrl = await getBaseUrl();
      const response = await fetch(`${baseUrl}/api/chatbot?loadHistory=true`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const baseUrl = await getBaseUrl();
      const response = await fetch(`${baseUrl}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('Are you sure you want to clear all chat history?')) return;

    try {
      const baseUrl = await getBaseUrl();
      await fetch(`${baseUrl}/api/chatbot/history`, {
        method: 'DELETE',
      });
      setMessages([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar title="AI Chatbot" />
      
      <div className="flex-1 flex flex-col p-6 animate-fade-in">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text-blue flex items-center gap-3">
              <Bot className="h-8 w-8 text-neon-blue" />
              ContextOS AI Assistant
            </h1>
            <p className="text-muted-foreground mt-1">
              Ask me about your tasks, plans, and productivity
            </p>
          </div>
          <Button
            className="glass-strong hover:glow text-white hover:bg-black"
            onClick={clearHistory}
            disabled={messages.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear History
          </Button>
        </motion.div>

        {/* Chat Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 glass-strong rounded-2xl p-6 mb-6 overflow-y-auto max-h-[calc(100vh-350px)]"
        >
          {isLoadingHistory ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 text-neon-blue animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="h-16 w-16 text-neon-blue mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">
                No messages yet. Start a conversation!
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Try asking: "What tasks do I have for today?" or "Summarize my week"
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-neon-blue to-neon-purple'
                          : 'bg-gradient-to-br from-green-500 to-emerald-500'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Bot className="h-5 w-5 text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30'
                          : 'bg-background/50 border border-border/50'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-background/50 border border-border/50">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-neon-blue animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-neon-blue animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-neon-blue animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </motion.div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-4"
        >
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your tasks, plans, or productivity..."
              className="flex-1 bg-background/50 border border-border/50 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-neon-blue/50 transition-all"
              rows={1}
              disabled={isLoading}
            />
            <Button
              className="glass-strong hover:bg-black px-6"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5 text-white" />
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
