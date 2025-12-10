"use client"

import Link from 'next/link'
import { Github, FileText, Shield, Scale, BookOpen } from 'lucide-react'

export function Footer() {
  const footerLinks = {
    product: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Documentation', href: '#docs' },
      { name: 'About', href: '#about' }
    ],
    legal: [
      { name: 'Privacy', href: '#privacy' },
      { name: 'Terms', href: '#terms' }
    ],
    resources: [
      { name: 'GitHub', href: 'https://github.com/Yaser-123/ContextOS', external: true }
    ]
  }

  return (
    <footer className="relative border-t border-white/5 py-20 px-6 bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/5 to-black" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-2xl">C</span>
              </div>
              <div>
                <div className="text-white font-bold text-2xl">ContextOS</div>
                <div className="text-slate-500 text-sm">v2.1</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Your AI-powered context operating system. Capture everything, remember everything, accomplish everything.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-purple-300 text-xs font-medium">Hackathon Build</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-400" />
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-pink-400" />
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    {link.name === 'GitHub' && <Github className="w-4 h-4" />}
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-slate-500 text-sm text-center md:text-left">
            © 2025 ContextOS. All rights reserved.
          </div>

          {/* Creator Attribution */}
          <div className="text-center md:text-right">
            <p className="text-slate-400 text-sm mb-1">
              Built with <span className="text-red-500">❤️</span> for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 font-bold">
                Avengers 2025
              </span>
            </p>
            <p className="text-slate-500 text-xs">
              by{" "}
              <span className="text-white font-semibold">
                T Mohamed Yaser
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
