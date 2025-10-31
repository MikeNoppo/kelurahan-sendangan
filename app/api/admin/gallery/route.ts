import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Gallery fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url, caption } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const item = await prisma.galleryItem.create({
      data: {
        url,
        caption: caption || null
      }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/galeri')

    return NextResponse.json(item)
  } catch (error) {
    console.error('Gallery create error:', error)
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 })
  }
}
