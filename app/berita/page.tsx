"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BeritaPage() {
  const [activeTab, setActiveTab] = useState("semua")

  const posts = [
    {
      type: "pengumuman",
      title: "Kerja Bakti Lingkungan 3",
      date: "2025-11-02",
      body: "Pukul 07.00 WITA – titik kumpul Posko KKT. Kami mengajak seluruh warga untuk berpartisipasi dalam kegiatan pembersihan lingkungan.",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop",
    },
    {
      type: "pengumuman",
      title: "Posyandu Balita & Lansia",
      date: "2025-11-05",
      body: "Balai Kelurahan. Pelayanan kesehatan gratis untuk balita dan lansia. Silakan bawa kartu kesehatan Anda.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop",
    },
    {
      type: "berita",
      title: "Pelayanan Surat Massal",
      date: "2025-11-03",
      body: "Pelayanan administrasi di kantor kelurahan. Kami menyediakan layanan pembuatan surat dengan proses yang cepat dan mudah.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
    },
    {
      type: "berita",
      title: "Program Pemberdayaan UMKM",
      date: "2025-10-28",
      body: "Kelurahan Sendangan meluncurkan program baru untuk mendukung pengembangan UMKM lokal, khususnya produk kacang dan biapong.",
      image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=250&fit=crop",
    },
    {
      type: "pengumuman",
      title: "Rapat Koordinasi Lingkungan",
      date: "2025-10-25",
      body: "Rapat rutin bulanan dengan kepala lingkungan untuk membahas perkembangan dan tantangan di setiap lingkungan.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    },
    {
      type: "berita",
      title: "Kunjungan Wisata Goa Jepang",
      date: "2025-10-20",
      body: "Peningkatan kunjungan wisatawan ke Goa Jepang menunjukkan potensi pariwisata yang besar di Kelurahan Sendangan.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    },
  ]

  const filteredPosts = activeTab === "semua" ? posts : posts.filter((post) => post.type === activeTab)

  return (
    <div className="w-full">
      <section className="relative bg-slate-900 text-white py-12 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070"
            alt="Berita & Pengumuman"
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <h1 className="text-4xl font-bold">Berita & Pengumuman</h1>
          <p className="text-slate-300 mt-2">Informasi terkini dari Kelurahan Sendangan</p>
        </div>
      </section>

      {/* News Content */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="semua">Semua</TabsTrigger>
              <TabsTrigger value="berita">Berita</TabsTrigger>
              <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.title}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        post.type === "berita" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {post.type === "berita" ? "Berita" : "Pengumuman"}
                    </span>
                    <span className="text-xs text-slate-500">{post.date}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-2">{post.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{post.body}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600">Tidak ada postingan untuk kategori ini.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
