"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog"

interface Post {
  id: number
  title: string
  type: string
  status: string
  body: string | null
  featuredImage: string | null
  date: string | null
  createdAt: string
  updatedAt: string
}

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const stripHtml = (html: string | null) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    fetchPosts()
  }, [activeTab, statusFilter, debouncedSearchQuery])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeTab !== 'all') params.append('type', activeTab)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery)

      const res = await fetch(`/api/admin/posts?${params}`)
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeleting(true)

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast({
          title: "Berhasil",
          description: "Post berhasil dihapus",
        })
        setDeleteDialogOpen(false)
        setPostToDelete(null)
        fetchPosts()
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus post",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const openDeleteDialog = (post: Post) => {
    setPostToDelete(post)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Posts Management</h2>
          <p className="text-slate-600 mt-1">Kelola berita dan pengumuman</p>
        </div>
        <Link href="/admin/posts/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buat Post Baru
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Semua</TabsTrigger>
                  <TabsTrigger value="berita">Berita</TabsTrigger>
                  <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
                </TabsList>
              </Tabs>

              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList>
                  <TabsTrigger value="all">Semua Status</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Cari posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                  <Skeleton className="w-32 h-32 rounded shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 p-6 mb-4">
                <Plus className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada posts</h3>
              <p className="text-slate-600 mb-4">
                Mulai dengan membuat post pertama Anda
              </p>
              <Link href="/admin/posts/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Post Baru
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 rounded-lg border p-4 hover:bg-slate-50 transition-colors"
                >
                  {post.featuredImage && (
                    <div className="relative w-32 h-32 rounded overflow-hidden shrink-0">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{post.title}</h3>
                      <Badge 
                        variant="outline"
                        className={post.type === "BERITA" ? "border-blue-500 text-blue-700 bg-blue-50" : "border-orange-500 text-orange-700 bg-orange-50"}
                      >
                        {post.type}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={post.status === "PUBLISHED" ? "border-primary text-primary bg-primary/10" : "border-slate-400 text-slate-700 bg-slate-50"}
                      >
                        {post.status}
                      </Badge>
                    </div>
                    {post.body && (
                      <p className="text-sm text-slate-600 line-clamp-2">{stripHtml(post.body)}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(post.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openDeleteDialog(post)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => postToDelete && handleDelete(postToDelete.id)}
        title="Yakin ingin menghapus post ini?"
        description="Tindakan ini tidak dapat dibatalkan. Post akan dihapus secara permanen dari database."
        itemName={postToDelete?.title}
        loading={deleting}
      />
    </div>
  )
}
