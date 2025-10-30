"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Calendar, Newspaper } from "lucide-react"

interface Post {
  id: number
  type: string
  title: string
  body: string | null
  date: string | null
  featuredImage: string | null
  createdAt: string
}

interface PostDetailData {
  post: Post
  relatedPosts: Post[]
}

export default function BeritaDetailPage() {
  const params = useParams()
  const [data, setData] = useState<PostDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/public/posts/${params.id}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError("Postingan tidak ditemukan")
          } else {
            setError("Gagal memuat postingan")
          }
          return
        }

        const postData = await res.json()
        setData(postData)
      } catch (err) {
        console.error("Error fetching post:", err)
        setError("Terjadi kesalahan saat memuat postingan")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPost()
    }
  }, [params.id])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return ""
    const plainText = text.replace(/<[^>]*>/g, "")
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + "..."
  }

  if (loading) {
    return (
      <div className="w-full">
        <section className="py-8 px-4 bg-white">
          <div className="mx-auto max-w-4xl">
            <Skeleton className="h-8 w-24 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-4 w-48 mb-8" />
            <Skeleton className="h-96 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="w-full">
        <section className="py-16 px-4 bg-white">
          <div className="mx-auto max-w-4xl text-center">
            <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">{error || "Postingan tidak ditemukan"}</h2>
            <Button asChild>
              <Link href="/berita">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Berita
              </Link>
            </Button>
          </div>
        </section>
      </div>
    )
  }

  const { post, relatedPosts } = data

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <Button variant="ghost" size="sm" asChild className="mb-4 text-white hover:text-white">
            <Link href="/berita">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
        </div>
      </section>

      {/* Post Content */}
      <section className="py-8 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          {/* Post Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  post.type === "BERITA"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {post.type === "BERITA" ? "Berita" : "Pengumuman"}
              </span>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(post.date || post.createdAt)}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{post.title}</h1>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
            </div>
          )}

          {/* Post Body */}
          <div
            className="prose prose-slate max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.body || "" }}
          />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-6">Postingan Terkait</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/berita/${relatedPost.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 w-full bg-slate-100">
                        {relatedPost.featuredImage ? (
                          <Image
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Newspaper className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              relatedPost.type === "BERITA"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {relatedPost.type === "BERITA" ? "Berita" : "Pengumuman"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(relatedPost.date || relatedPost.createdAt)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {truncateText(relatedPost.body, 80)}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
