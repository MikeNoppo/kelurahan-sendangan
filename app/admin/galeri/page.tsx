"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"

export default function GaleriPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Galeri Management</h2>
          <p className="text-slate-600 mt-1">Kelola foto-foto kegiatan</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Foto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Galeri Foto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-slate-100 p-6 mb-4">
              <Plus className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada foto</h3>
            <p className="text-slate-600 mb-4">Upload foto kegiatan kelurahan</p>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Foto
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
