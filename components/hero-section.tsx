'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { ChevronDown } from 'lucide-react'

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Parallax calculations
  const parallaxBg = scrollY * 0.5
  const parallaxText = scrollY * 0.3
  const opacity = Math.max(1 - scrollY / 400, 0)

  return (
    <section className="relative bg-linear-to-br from-slate-900 to-slate-800 text-white h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax */}
      <div 
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${parallaxBg}px)` }}
      >
        <Image
          src="https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=2070"
          alt="Kelurahan Sendangan"
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-900/50 via-transparent to-slate-900/80" />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-soft animation-delay-1000" />

      {/* Content with parallax */}
      <div 
        className="mx-auto max-w-7xl text-center relative z-10 px-4"
        style={{ 
          transform: `translateY(${parallaxText}px)`,
          opacity: opacity
        }}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium">Website Resmi Kelurahan Sendangan</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance animate-fade-in-up animation-delay-200">
          Selamat Datang di
          <span className="block mt-2 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-float">
            Kelurahan Sendangan
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto text-balance animate-fade-in-up animation-delay-400">
          Akses informasi publik, berita, dan potensi kelurahan dalam satu tempat.
          Terhubung dengan layanan digital untuk kemudahan warga.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
          <Link href="/peta">
            <Button 
              size="lg" 
              className="text-white bg-blue-600 hover:bg-blue-700 hover-scale glow-on-hover group"
            >
              Lihat Peta
              <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
            </Button>
          </Link>
          <Link href="/profil">
            <Button 
              variant="outline" 
              size="lg" 
              className="text-white border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-slate-900"
            >
              Tentang Kami
            </Button>
          </Link>
          <Link href="/berita">
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-white hover:bg-white/10"
            >
              Lihat Berita
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce"
        style={{ opacity: opacity }}
      >
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs font-medium">Scroll untuk melihat lebih banyak</span>
          <ChevronDown className="h-5 w-5" />
        </div>
      </div>
    </section>
  )
}
