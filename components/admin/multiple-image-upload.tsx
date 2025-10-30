"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Upload, X, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface UploadItem {
  id: string
  file: File
  preview: string
  caption: string
  uploading: boolean
  uploaded: boolean
  url?: string
}

interface MultipleImageUploadProps {
  onUploadComplete: () => void
}

export function MultipleImageUpload({ onUploadComplete }: MultipleImageUploadProps) {
  const [items, setItems] = useState<UploadItem[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    addFiles(files)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const addFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast({
        title: 'Error',
        description: 'Hanya file gambar yang diperbolehkan',
        variant: 'destructive'
      })
      return
    }

    const newItems: UploadItem[] = imageFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      caption: '',
      uploading: false,
      uploaded: false
    }))

    setItems(prev => [...prev, ...newItems])
  }

  const removeItem = (id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item) {
        URL.revokeObjectURL(item.preview)
      }
      return prev.filter(i => i.id !== id)
    })
  }

  const updateCaption = (id: string, caption: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, caption } : item
    ))
  }

  const uploadAll = async () => {
    setUploading(true)

    try {
      for (const item of items) {
        if (item.uploaded) continue

        setItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, uploading: true } : i
        ))

        const formData = new FormData()
        formData.append('file', item.file)

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        })

        if (!uploadRes.ok) throw new Error('Upload failed')

        const { url } = await uploadRes.json()

        const createRes = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            caption: item.caption
          })
        })

        if (!createRes.ok) throw new Error('Failed to save gallery item')

        setItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, uploading: false, uploaded: true, url } : i
        ))
      }

      toast({
        title: 'Berhasil',
        description: `${items.length} foto berhasil diupload`
      })

      setItems([])
      onUploadComplete()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal mengupload foto',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center cursor-pointer hover:border-slate-400 transition-colors"
      >
        <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
        <p className="text-slate-600 mb-2">Klik atau drag & drop untuk upload foto</p>
        <p className="text-sm text-slate-500">Mendukung multiple files</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {items.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {items.map(item => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-32 h-32 shrink-0">
                    <Image
                      src={item.preview}
                      alt="Preview"
                      fill
                      className="object-cover rounded"
                    />
                    {item.uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Label htmlFor={`caption-${item.id}`} className="text-sm">
                        Caption (opsional)
                      </Label>
                      {!item.uploaded && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      id={`caption-${item.id}`}
                      placeholder="Deskripsi foto..."
                      value={item.caption}
                      onChange={(e) => updateCaption(item.id, e.target.value)}
                      disabled={item.uploaded}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setItems([])}
              disabled={uploading}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={uploadAll}
              disabled={uploading || items.every(i => i.uploaded)}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengupload...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload {items.length} Foto
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
