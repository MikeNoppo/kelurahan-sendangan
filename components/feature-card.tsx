"use client"

import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface FeatureCardProps {
  emoji: string
  name: string
  desc: string
  delay?: number
}

export function FeatureCard({ emoji, name, desc, delay = 0 }: FeatureCardProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })

  return (
    <div
      ref={ref}
      className={`group relative bg-white border-2 border-slate-200 rounded-xl p-8 text-center transition-all duration-300 hover:border-secondary hover:shadow-2xl hover:-translate-y-2 overflow-hidden opacity-0-init ${
        isVisible ? "animate-fade-in-up" : ""
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-linear-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Top badge */}
      <div className="absolute top-4 right-4">
        <Badge variant="outline" className="border-secondary/30 text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
          <Sparkles className="h-3 w-3 mr-1" />
          Unggulan
        </Badge>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Emoji with animation */}
        <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
          {emoji}
        </div>
        
        <h3 className="font-bold text-slate-900 text-xl mb-3 group-hover:text-secondary transition-colors">
          {name}
        </h3>
        
        <p className="text-slate-600 text-sm leading-relaxed">
          {desc}
        </p>

        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-1 mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse animation-delay-100" />
          <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse animation-delay-200" />
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      </div>
    </div>
  )
}
