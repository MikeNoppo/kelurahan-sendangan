"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Link from "next/link"

interface AnnouncementCardProps {
  id: number
  title: string
  date: string
  body: string
  delay?: number
}

export function AnnouncementCard({ id, title, date, body, delay = 0 }: AnnouncementCardProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })

  return (
    <Link href={`/berita/${id}`}>
      <div
        ref={ref}
        className={`group relative bg-white border-2 border-slate-200 rounded-xl p-6 transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-1 overflow-hidden opacity-0-init cursor-pointer ${
          isVisible ? "animate-fade-in-up" : ""
        }`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Decorative corner gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/5 to-transparent rounded-bl-full" />
        
        {/* Date Badge - Corner positioned */}
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="outline" className="bg-white shadow-sm flex items-center gap-1.5 px-3 py-1.5 border-slate-300">
            <Calendar className="h-3 w-3 text-slate-600" />
            <span className="text-xs font-medium text-slate-700">{date}</span>
          </Badge>
        </div>

        {/* Content */}
        <div className="relative z-10 pt-2">
          {/* Category badge */}
          <Badge variant="outline" className="mb-3 border-orange-400 text-orange-700 bg-orange-50">
            <Clock className="h-3 w-3 mr-1" />
            Pengumuman
          </Badge>

          <h3 className="font-bold text-slate-900 text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
            {body}
          </p>

          {/* Read more indicator */}
          <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Baca selengkapnya</span>
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </div>
    </Link>
  )
}
