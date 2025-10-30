"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/admin/image-upload"

export default function CreatePotensiPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    emoji: "",
    imageUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.name.trim().length < 3) {
      toast({
        title: "Error",
        description: "Nama potensi minimal 3 karakter",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/potentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast({
          title: "Berhasil",
          description: "Potensi berhasil dibuat",
        })
        router.push('/admin/potensi')
      } else {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create potential')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat potensi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/potensi">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Tambah Potensi</h2>
          <p className="text-slate-600 mt-1">Tambah potensi unggulan baru</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Potensi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nama Potensi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Contoh: Kacang Bogor"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Deskripsi (opsional)</Label>
              <Textarea
                id="desc"
                placeholder="Deskripsi potensi unggulan..."
                rows={4}
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji (opsional)</Label>
              <Input
                id="emoji"
                placeholder="Contoh: 🥜"
                maxLength={10}
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              />
              <p className="text-sm text-slate-500">
                Gunakan emoji untuk ikon. Jika tidak diisi, akan menggunakan gambar di bawah.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Gambar (opsional)</Label>
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                onRemove={() => setFormData({ ...formData, imageUrl: "" })}
              />
              <p className="text-sm text-slate-500">
                Gambar akan digunakan jika emoji tidak diisi.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Menyimpan..." : "Simpan Potensi"}
              </Button>
              <Link href="/admin/potensi">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
