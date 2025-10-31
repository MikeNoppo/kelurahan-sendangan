"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Loader2, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface Potential {
  id: number
  name: string
  desc: string | null
  emoji: string | null
  imageUrl: string | null
  createdAt: string
}

export default function PotensiPage() {
  const [items, setItems] = useState<Potential[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    fetchPotentials()
  }, [debouncedSearchQuery])

  const fetchPotentials = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery)

      const res = await fetch(`/api/admin/potentials?${params}`)
      const data = await res.json()
      setItems(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat potensi",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/potentials/${deleteId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast({
          title: "Berhasil",
          description: "Potensi berhasil dihapus",
        })
        fetchPotentials()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus potensi",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Potensi Management</h2>
          <p className="text-slate-600 mt-1">Kelola potensi unggulan kelurahan</p>
        </div>
        <Link href="/admin/potensi/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Potensi
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle>Potensi Unggulan</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Cari potensi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="rounded-lg border p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-5 w-3/4 mx-auto" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6 mx-auto" />
                    </div>
                    <div className="flex gap-2 w-full pt-2">
                      <Skeleton className="h-8 flex-1" />
                      <Skeleton className="h-8 flex-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 p-6 mb-4">
                <Sparkles className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {searchQuery ? 'Tidak ada hasil' : 'Belum ada potensi'}
              </h3>
              <p className="text-slate-600 mb-4">
                {searchQuery ? 'Coba kata kunci lain' : 'Tambahkan potensi unggulan kelurahan'}
              </p>
              {!searchQuery && (
                <Link href="/admin/potensi/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Potensi
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-16 h-16 flex items-center justify-center">
                        {item.emoji ? (
                          <span className="text-5xl">{item.emoji}</span>
                        ) : item.imageUrl ? (
                          <div className="relative w-16 h-16">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-slate-400" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 w-full">
                        <h3 className="font-semibold text-slate-900 line-clamp-1">
                          {item.name}
                        </h3>
                        {item.desc && (
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {item.desc}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 w-full pt-2">
                        <Link href={`/admin/potensi/${item.id}/edit`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteId(item.id)}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Potensi?</AlertDialogTitle>
            <AlertDialogDescription>
              Potensi akan dihapus permanen. Aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
