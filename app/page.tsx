import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StatCard } from "@/components/stat-card"
import { AnnouncementCard } from "@/components/announcement-card"
import { FeatureCard } from "@/components/feature-card"

export default function Home() {
  const stats = [
    { label: "Total Jiwa", value: "6.120" },
    { label: "Jumlah KK", value: "1.845" },
    { label: "Laki-laki", value: "3.080" },
    { label: "Perempuan", value: "3.040" },
  ]

  const announcements = [
    {
      title: "Kerja Bakti Lingkungan 3",
      date: "2025-11-02",
      body: "Pukul 07.00 WITA – titik kumpul Posko KKT.",
    },
    {
      title: "Posyandu Balita & Lansia",
      date: "2025-11-05",
      body: "Balai Kelurahan.",
    },
    {
      title: "Pelayanan Surat Massal",
      date: "2025-11-03",
      body: "Pelayanan administrasi di kantor kelurahan.",
    },
  ]

  const potentials = [
    {
      emoji: "🥜",
      name: "Kacang Kawangkoan",
      desc: "Produk unggulan sebagai oleh-oleh khas.",
    },
    {
      emoji: "🥟",
      name: "Biapong",
      desc: "Kuliner tradisional populer.",
    },
    {
      emoji: "🏛️",
      name: "Goa Jepang",
      desc: "Wisata sejarah & edukasi.",
    },
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
  <section className="bg-linear-to-br from-slate-900 to-slate-800 text-white h-screen px-4 flex items-center justify-center">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Selamat Datang di Website Kelurahan Sendangan
          </h1>
          <p className="text-lg text-slate-300 mb-8 text-balance">
            Akses informasi publik, berita, dan potensi kelurahan dalam satu tempat.
          </p>
          <Link href="/peta">
            <Button variant="outline" size="lg" className="text-slate-900 bg-transparent">
              Lihat Peta
            </Button>
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Sekilas Kependudukan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Pengumuman Terkini</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.title}
                title={announcement.title}
                date={announcement.date}
                body={announcement.body}
              />
            ))}
          </div>
          <div className="text-center">
            <Link href="/berita">
              <Button variant="default">Lihat Semua Berita</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Potential Section */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Potensi Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {potentials.map((potential) => (
              <FeatureCard key={potential.name} emoji={potential.emoji} name={potential.name} desc={potential.desc} />
            ))}
          </div>
          <div className="text-center">
            <Link href="/potensi">
              <Button variant="default">Lihat Semua Potensi</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
