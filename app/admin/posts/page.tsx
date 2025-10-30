"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("semua")

  const posts: any[] = []

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
          <div className="flex items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="semua">Semua</TabsTrigger>
                <TabsTrigger value="BERITA">Berita</TabsTrigger>
                <TabsTrigger value="PENGUMUMAN">Pengumuman</TabsTrigger>
              </TabsList>
            </Tabs>

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
          {posts.length === 0 ? (
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
              {posts.map((post: any) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{post.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          post.type === "BERITA"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {post.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{post.body}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
