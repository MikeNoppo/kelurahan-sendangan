"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/admin/image-upload"
import { NovelEditor } from "@/components/admin/novel-editor"

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editorContent, setEditorContent] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    type: "BERITA",
    status: "DRAFT",
    date: "",
    featuredImage: "",
  })

  useEffect(() => {
    fetchPost()
  }, [])

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/admin/posts/${id}`)
      const data = await res.json()
      
      setFormData({
        title: data.title,
        type: data.type,
        status: data.status,
        date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
        featuredImage: data.featuredImage || "",
      })

      if (data.body) {
        setEditorContent(data.body)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat post",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          body: editorContent,
        }),
      })

      if (res.ok) {
        toast({
          title: "Berhasil",
          description: "Post berhasil diupdate",
        })
        router.push('/admin/posts')
      } else {
        throw new Error('Failed to update post')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupdate post",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
            <div className="flex items-center gap-4 pt-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/posts">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Edit Post</h2>
          <p className="text-slate-600 mt-1">Update berita atau pengumuman</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                placeholder="Masukkan judul post"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipe</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BERITA">Berita</SelectItem>
                    <SelectItem value="PENGUMUMAN">Pengumuman</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Featured Image</Label>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                onRemove={() => setFormData({ ...formData, featuredImage: "" })}
              />
            </div>

            <div className="space-y-2">
              <Label>Konten</Label>
              <NovelEditor
                initialValue={editorContent}
                onChange={setEditorContent}
              />
              <p className="text-sm text-slate-500">
                Gunakan toolbar di atas untuk formatting (Bold, Italic, Heading, dll)
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
              <Link href="/admin/posts">
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
