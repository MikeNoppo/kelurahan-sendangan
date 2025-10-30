"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { NovelEditor } from "@/components/admin/novel-editor"

interface ProfileData {
  visi: string
  misi: string
  sejarah: string
  profilUmum: string
}

export default function ProfilPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<ProfileData>({
    visi: "",
    misi: "",
    sejarah: "",
    profilUmum: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/profile')
      const data = await res.json()
      setProfileData({
        visi: data.visi || "",
        misi: data.misi || "",
        sejarah: data.sejarah || "",
        profilUmum: data.profilUmum || "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data profil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (key: keyof ProfileData) => {
    setSaving(key)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          value: profileData[key]
        }),
      })

      if (res.ok) {
        toast({
          title: "Berhasil",
          description: "Perubahan berhasil disimpan",
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan perubahan",
        variant: "destructive",
      })
    } finally {
      setSaving(null)
    }
  }

  const updateField = (key: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

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

            <TabsContent value="visi-misi" className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label>Visi</Label>
                <NovelEditor
                  initialValue={profileData.visi}
                  onChange={(value) => updateField('visi', value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Misi</Label>
                <NovelEditor
                  initialValue={profileData.misi}
                  onChange={(value) => updateField('misi', value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSave('visi')}
                  disabled={saving === 'visi'}
                >
                  {saving === 'visi' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan Visi...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Visi
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => handleSave('misi')}
                  disabled={saving === 'misi'}
                >
                  {saving === 'misi' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan Misi...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Misi
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="sejarah" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>Sejarah Kelurahan</Label>
                <NovelEditor
                  initialValue={profileData.sejarah}
                  onChange={(value) => updateField('sejarah', value)}
                />
              </div>
              <Button 
                onClick={() => handleSave('sejarah')}
                disabled={saving === 'sejarah'}
              >
                {saving === 'sejarah' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="profil-umum" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>Profil Umum</Label>
                <NovelEditor
                  initialValue={profileData.profilUmum}
                  onChange={(value) => updateField('profilUmum', value)}
                />
              </div>
              <Button 
                onClick={() => handleSave('profilUmum')}
                disabled={saving === 'profilUmum'}
              >
                {saving === 'profilUmum' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
