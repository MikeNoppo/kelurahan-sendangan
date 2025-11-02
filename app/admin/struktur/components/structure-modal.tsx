"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Upload, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

type StructureMember = {
  id: string
  jabatan: string
  nama: string
  nip: string | null
  fotoUrl: string | null
  isDraft?: boolean
}

type StructureModalProps = {
  open: boolean
  onClose: () => void
  member?: StructureMember | null
  onSuccess: () => void
}

export default function StructureModal({
  open,
  onClose,
  member,
  onSuccess,
}: StructureModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    jabatan: '',
    nama: '',
    nip: '',
  })

  // Reset form when modal opens or member changes
  useEffect(() => {
    if (open) {
      setFormData({
        jabatan: member?.jabatan || '',
        nama: member?.nama || '',
        nip: member?.nip || '',
      })
      setFotoPreview(member?.fotoUrl || null)
      setFotoFile(null)
    } else {
      // Reset form when modal closes
      setFormData({ jabatan: '', nama: '', nip: '' })
      setFotoPreview(null)
      setFotoFile(null)
    }
  }, [open, member])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Ukuran file maksimal 5MB',
          variant: 'destructive',
        })
        return
      }
      setFotoFile(file)
      setFotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault()
    
    if (!formData.jabatan.trim() || !formData.nama.trim()) {
      toast({
        title: 'Error',
        description: 'Jabatan dan Nama wajib diisi',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      let fotoUrl = member?.fotoUrl || null

      if (fotoFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', fotoFile)
        
        const uploadRes = await fetch('/api/admin/structure/upload', {
          method: 'POST',
          body: uploadFormData,
        })
        
        if (uploadRes.ok) {
          const { url } = await uploadRes.json()
          fotoUrl = url
        }
      }

      const url = member 
        ? `/api/admin/structure/${member.id}` 
        : '/api/admin/structure'
      
      const method = member ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jabatan: formData.jabatan,
          nama: formData.nama,
          nip: formData.nip || null,
          fotoUrl,
        }),
      })

      if (res.ok) {
        toast({
          title: 'Berhasil',
          description: member ? 'Anggota berhasil diupdate' : 'Anggota berhasil ditambahkan',
        })
        onSuccess()
        onClose()
      } else {
        throw new Error('Failed to save member')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyimpan anggota',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {member ? 'Edit Anggota' : 'Tambah Anggota'}
          </DialogTitle>
          <DialogDescription>
            {member ? 'Update informasi anggota struktur organisasi' : 'Tambahkan anggota baru ke struktur organisasi'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Foto (Opsional)</Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded flex items-center justify-center overflow-hidden">
                {fotoPreview ? (
                  <Image
                    src={fotoPreview}
                    alt="Preview"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="foto-upload"
                />
                <Label htmlFor="foto-upload">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 cursor-pointer"
                    onClick={() => document.getElementById('foto-upload')?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    Upload Foto
                  </Button>
                </Label>
                <p className="text-xs text-slate-500 mt-1">
                  Max 5MB (JPG, PNG)
                </p>
              </div>
            </div>
          </div>

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
            <Label htmlFor="nip">NIP (Opsional)</Label>
            <Input
              id="nip"
              placeholder="Nomor Induk Pegawai"
              value={formData.nip}
              onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button 
              type="button" 
              disabled={isLoading} 
              className="gap-2"
              onClick={(e) => handleSubmit(e, false)}
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Batal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
