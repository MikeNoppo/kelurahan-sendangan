"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StructureMember {
  id: number
  jabatan: string
  nama: string
  nip: string | null
  lingkungan: string | null
  parentId: number | null
}

export default function EditStrukturPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<StructureMember[]>([])
  const [formData, setFormData] = useState({
    jabatan: "",
    nama: "",
    nip: "",
    lingkungan: "",
    parentId: "",
  })

  useEffect(() => {
    fetchMember()
    fetchMembers()
  }, [])

  const fetchMember = async () => {
    try {
      const res = await fetch(`/api/admin/structure/${id}`)
      const data = await res.json()
      
      setFormData({
        jabatan: data.jabatan,
        nama: data.nama,
        nip: data.nip || "",
        lingkungan: data.lingkungan || "",
        parentId: data.parentId?.toString() || "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data anggota",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/structure')
      const data = await res.json()
      setMembers(data.filter((m: StructureMember) => m.id !== parseInt(id)))
    } catch (error) {
      console.error('Failed to fetch members:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.jabatan.trim() || !formData.nama.trim()) {
      toast({
        title: "Error",
        description: "Jabatan dan Nama wajib diisi",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/structure/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jabatan: formData.jabatan,
          nama: formData.nama,
          nip: formData.nip || null,
          lingkungan: formData.lingkungan || null,
          parentId: formData.parentId ? parseInt(formData.parentId) : null,
        }),
      })

      if (res.ok) {
        toast({
          title: "Berhasil",
          description: "Anggota berhasil diupdate",
        })
        router.push('/admin/struktur')
      } else {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update member')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupdate anggota",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/struktur">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Edit Anggota</h2>
          <p className="text-slate-600 mt-1">Update data anggota struktur organisasi</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Anggota</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="jabatan">
                Jabatan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jabatan"
                placeholder="Contoh: Lurah / Sekretaris / Kasi Pemerintahan"
                value={formData.jabatan}
                onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama">
                Nama Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama"
                placeholder="Nama lengkap"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nip">NIP (opsional)</Label>
              <Input
                id="nip"
                placeholder="Nomor Induk Pegawai"
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lingkungan">Lingkungan (opsional)</Label>
              <Input
                id="lingkungan"
                placeholder="Contoh: Lingkungan 1"
                value={formData.lingkungan}
                onChange={(e) => setFormData({ ...formData, lingkungan: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Atasan / Parent</Label>
              <Select
                value={formData.parentId || "none"}
                onValueChange={(value) => setFormData({ ...formData, parentId: value === "none" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="- (Tidak ada / Top Level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">- (Tidak ada / Top Level)</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.jabatan} - {member.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-slate-500">
                Kosongkan jika ini adalah posisi tertinggi (Lurah)
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
              <Link href="/admin/struktur">
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
