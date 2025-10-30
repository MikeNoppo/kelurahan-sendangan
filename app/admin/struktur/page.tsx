"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function StrukturPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Struktur Management</h2>
          <p className="text-slate-600 mt-1">Kelola struktur organisasi pemerintahan</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Anggota
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Struktur Organisasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-slate-100 p-6 mb-4">
              <Plus className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Coming Soon</h3>
            <p className="text-slate-600 mb-4">Fitur manajemen struktur akan segera hadir</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
