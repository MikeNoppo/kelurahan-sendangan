"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Loader2, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import StructureModal from "./components/structure-modal"

const StructureCanvas = dynamic(() => import('./components/structure-canvas'), {
  ssr: false,
})

interface StructureMember {
  id: string
  jabatan: string
  nama: string
  nip: string | null
  fotoUrl: string | null
  positionX: number
  positionY: number
  parentId: string | null
}

export default function StrukturPage() {
  const [members, setMembers] = useState<StructureMember[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editMember, setEditMember] = useState<StructureMember | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchStructure()
  }, [])

  const fetchStructure = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/structure')
      const data = await res.json()
      setMembers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat struktur",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const childrenCount = members.filter(m => m.parentId === deleteId).length

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/structure/${deleteId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast({
          title: "Berhasil",
          description: childrenCount > 0 
            ? `Anggota dan ${childrenCount} bawahan berhasil dihapus`
            : "Anggota berhasil dihapus",
        })
        fetchStructure()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus anggota",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const handleEdit = (id: string) => {
    const member = members.find(m => m.id === id)
    if (member) {
      setEditMember(member)
      setShowModal(true)
    }
  }

  const handleAddNew = () => {
    setEditMember(null)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditMember(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Struktur Management</h2>
          <p className="text-slate-600 mt-1">Kelola struktur organisasi pemerintahan</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Anggota
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Struktur Organisasi</CardTitle>
        </CardHeader>
        <CardContent className="p-0" style={{ height: 'calc(100vh - 300px)' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="rounded-full bg-slate-100 p-6 mb-4">
                <Users className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada anggota</h3>
              <p className="text-slate-600 mb-4">Tambahkan anggota struktur organisasi</p>
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Anggota
              </Button>
            </div>
          ) : (
            <StructureCanvas
              members={members}
              onRefresh={fetchStructure}
              onEdit={handleEdit}
              onDelete={setDeleteId}
            />
          )}
        </CardContent>
      </Card>

      <StructureModal
        open={showModal}
        onClose={handleModalClose}
        member={editMember}
        onSuccess={fetchStructure}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Anggota?</AlertDialogTitle>
            <AlertDialogDescription>
              {(() => {
                const childrenCount = members.filter(m => m.parentId === deleteId).length
                
                if (childrenCount > 0) {
                  return `Anggota ini memiliki ${childrenCount} bawahan. Semua bawahan juga akan dihapus. Aksi ini tidak dapat dibatalkan.`
                }
                return 'Anggota akan dihapus permanen. Aksi ini tidak dapat dibatalkan.'
              })()}
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
