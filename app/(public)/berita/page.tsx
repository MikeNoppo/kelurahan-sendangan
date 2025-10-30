"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Newspaper, Search, Calendar, ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface Post {
  id: number
  type: string
  title: string
  body: string | null
  date: string | null
  featuredImage: string | null
  createdAt: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

function PostCard({ post, delay }: { post: Post; delay: number }) {
  const { ref, isVisible } = useScrollAnimation<HTMLAnchorElement>({ threshold: 0.2 })

  return (
    <Link
      ref={ref}
      href={`/berita/${post.id}`}
      className={`group relative bg-white border-2 border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-2xl hover:-translate-y-1 opacity-0-init ${
        isVisible ? "animate-fade-in-up" : ""
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full bg-linear-to-br from-primary/10 to-secondary/10 overflow-hidden">
        {post.featuredImage ? (
          <>
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Newspaper className="h-12 w-12 text-muted-foreground group-hover:scale-110 transition-transform" />
          </div>
        )}

        {/* Type Badge on Image */}
        <div className="absolute top-4 left-4">
          <Badge
            className={`shadow-lg ${
              post.type === "BERITA"
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {post.type === "BERITA" ? "📰 Berita" : "📢 Pengumuman"}
          </Badge>
        </div>

        {/* Date Badge */}
        <div className="absolute bottom-4 right-4">
          <Badge variant="secondary" className="bg-white/95 text-slate-900 border border-slate-200 shadow-md flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.date || post.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            })}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {post.body?.replace(/<[^>]*>/g, "") || ""}
        </p>

        {/* Read more indicator */}
        <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Baca selengkapnya</span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </Link>
  )
}

export default function BeritaPage() {
  const [activeTab, setActiveTab] = useState("semua")
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
    hasMore: false,
  })

  const fetchPosts = async (page: number = 1, search: string = "") => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (activeTab !== "semua") {
        params.append("category", activeTab.toUpperCase())
      }

      if (search && search.length >= 3) {
        params.append("search", search)
      }

      const res = await fetch(`/api/public/posts?${params}`)
      if (!res.ok) throw new Error("Failed to fetch posts")

      const data = await res.json()
      setPosts(data.posts || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(1, searchQuery)
  }, [activeTab])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPosts(1, searchQuery)
  }

  const handlePageChange = (newPage: number) => {
    fetchPosts(newPage, searchQuery)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="w-full">
      <section className="relative bg-slate-900 text-white py-12 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070"
            alt="Berita & Pengumuman"
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <h1 className="text-4xl font-bold">Berita & Pengumuman</h1>
          <p className="text-slate-300 mt-2">Informasi terkini dari Kelurahan Sendangan</p>
        </div>
      </section>

      {/* News Content */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="semua">Semua</TabsTrigger>
              <TabsTrigger value="berita">Berita</TabsTrigger>
              <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari berita atau pengumuman... (min. 3 karakter)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Newspaper className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg mb-2">
                {searchQuery.length >= 3
                  ? "Tidak ada hasil pencarian"
                  : activeTab === "semua"
                  ? "Belum ada postingan"
                  : `Belum ada ${activeTab}`}
              </p>
              {searchQuery.length >= 3 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    fetchPosts(1, "")
                  }}
                  className="mt-4"
                >
                  Reset Pencarian
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post, index) => (
                  <PostCard key={post.id} post={post} delay={index * 100} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const pageNum = i + 1
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        Math.abs(pageNum - pagination.page) <= 1
                      ) {
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === pagination.page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        )
                      } else if (
                        pageNum === pagination.page - 2 ||
                        pageNum === pagination.page + 2
                      ) {
                        return (
                          <span key={pageNum} className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )
                      }
                      return null
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasMore}
                  >
                    Next
                  </Button>
                </div>
              )}

              {/* Results info */}
              <p className="text-center text-sm text-muted-foreground mt-4">
                Menampilkan {posts.length} dari {pagination.total} postingan
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
