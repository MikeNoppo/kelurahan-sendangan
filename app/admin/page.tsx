"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Image as ImageIcon, Sparkles, Users } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Posts",
      value: "0",
      icon: FileText,
      description: "Berita & Pengumuman",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Galeri",
      value: "0",
      icon: ImageIcon,
      description: "Foto kegiatan",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Potensi",
      value: "3",
      icon: Sparkles,
      description: "Unggulan kelurahan",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Users",
      value: "1",
      icon: Users,
      description: "Admin users",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-600 mt-1">Selamat datang di panel admin Kelurahan Sendangan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Sistem dimulai</p>
                  <p className="text-slate-500">Panel admin siap digunakan</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="/admin/posts"
                className="block p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <p className="font-medium text-slate-900">Buat Post Baru</p>
                <p className="text-sm text-slate-500">Tambah berita atau pengumuman</p>
              </a>
              <a
                href="/admin/galeri"
                className="block p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <p className="font-medium text-slate-900">Upload Galeri</p>
                <p className="text-sm text-slate-500">Tambah foto kegiatan</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
