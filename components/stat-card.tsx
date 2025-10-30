"use client"

import { useEffect, useState } from "react"
import { Users, Home, User } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

type IconName = "users" | "home" | "user-male" | "user-female"

interface StatCardProps {
  label: string
  value: string
  iconName: IconName
  gradient: string
  iconColor: string
  delay?: number
  trend?: {
    value: number
    label: string
  }
}

const iconMap = {
  "users": Users,
  "home": Home,
  "user-male": User,
  "user-female": User,
}

export function StatCard({ 
  label, 
  value, 
  iconName, 
  gradient, 
  iconColor,
  delay = 0,
  trend 
}: StatCardProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 })
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  const Icon = iconMap[iconName]

  // Parse numeric value for counter animation
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0

  useEffect(() => {
    if (isVisible && !hasAnimated && numericValue > 0) {
      setHasAnimated(true)
      let startTime: number | null = null
      const duration = 2000 // 2 seconds
      
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(easeOutQuart * numericValue))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }
  }, [isVisible, hasAnimated, numericValue])

  const displayValue = numericValue > 0 && hasAnimated 
    ? count.toLocaleString('id-ID')
    : value

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-xl bg-white border-2 border-slate-200 p-6 transition-all duration-300 hover:border-transparent hover:shadow-2xl hover:-translate-y-2 opacity-0-init ${
        isVisible ? "animate-fade-in-up" : ""
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${gradient}`} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon & Trend Row */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${gradient} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
            <Icon className={`h-6 w-6 ${iconColor}`} strokeWidth={2.5} />
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              trend.value >= 0 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              <span>{trend.value >= 0 ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <p className="text-4xl font-bold text-slate-900 group-hover:scale-105 transition-transform duration-300">
            {displayValue}
          </p>
        </div>

        {/* Label */}
        <p className="text-sm font-medium text-slate-600 group-hover:text-slate-700">
          {label}
        </p>

        {/* Trend Label */}
        {trend && (
          <p className="text-xs text-slate-500 mt-1">
            {trend.label}
          </p>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300" 
        style={{ 
          background: `radial-gradient(circle, currentColor 0%, transparent 70%)`,
          color: iconColor.replace('text-', '')
        }} 
      />

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </div>
    </div>
  )
}
