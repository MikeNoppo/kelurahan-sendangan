"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { Users } from "lucide-react"
import CanvasSkeleton from "@/app/admin/struktur/components/canvas-skeleton"

const PublicStructureCanvas = dynamic(() => import('./components/public-structure-canvas'), {
  ssr: false,
  loading: () => <CanvasSkeleton />,
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

  useEffect(() => {
    const fetchStructure = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/public/structure")
        if (!res.ok) throw new Error("Failed to fetch structure")

        const data = await res.json()
        setMembers(data)
      } catch (error) {
        console.error("Error fetching structure:", error)
        setMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchStructure()
  }, [])

  return (
    <div className="w-full">
      <section className="relative bg-slate-900 text-white py-12 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070"
            alt="Struktur Organisasi"
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <h1 className="text-4xl font-bold">Struktur Pemerintahan</h1>
          <p className="text-slate-300 mt-2">Bagan organisasi Kelurahan Sendangan</p>
        </div>
      </section>

      <section className="py-8 px-4 bg-white">
        <div className="mx-auto max-w-7xl" style={{ height: 'calc(100vh - 200px)' }}>
          {loading ? (
            <CanvasSkeleton />
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">Belum ada data struktur organisasi</p>
            </div>
          ) : (
            <PublicStructureCanvas members={members} />
          )}
        </div>
      </section>
    </div>
  )
}
