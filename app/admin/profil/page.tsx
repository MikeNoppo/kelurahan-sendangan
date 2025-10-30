"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"

export default function ProfilPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Profil Management</h2>
        <p className="text-slate-600 mt-1">Edit informasi profil kelurahan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Profil Kelurahan</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="visi-misi">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="visi-misi">Visi & Misi</TabsTrigger>
              <TabsTrigger value="sejarah">Sejarah</TabsTrigger>
              <TabsTrigger value="profil-umum">Profil Umum</TabsTrigger>
            </TabsList>

            <TabsContent value="visi-misi" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="visi">Visi</Label>
                <Textarea id="visi" rows={4} placeholder="Masukkan visi kelurahan..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="misi">Misi</Label>
                <Textarea id="misi" rows={8} placeholder="Masukkan misi kelurahan..." />
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </Button>
            </TabsContent>

            <TabsContent value="sejarah" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="sejarah">Sejarah Kelurahan</Label>
                <Textarea id="sejarah" rows={12} placeholder="Masukkan sejarah kelurahan..." />
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </Button>
            </TabsContent>

            <TabsContent value="profil-umum" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="profil">Profil Umum</Label>
                <Textarea id="profil" rows={12} placeholder="Masukkan profil umum kelurahan..." />
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
