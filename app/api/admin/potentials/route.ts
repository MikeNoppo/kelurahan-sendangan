import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { desc: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {}

    const items = await prisma.potential.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Potentials fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch potentials' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, desc, emoji, imageUrl } = await request.json()

    if (!name || name.trim().length < 3) {
      return NextResponse.json({ error: 'Name is required (min 3 characters)' }, { status: 400 })
    }

    const item = await prisma.potential.create({
      data: {
        name: name.trim(),
        desc: desc?.trim() || null,
        emoji: emoji?.trim() || null,
        imageUrl: imageUrl || null
      }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/potensi')

    return NextResponse.json(item)
  } catch (error) {
    console.error('Potential create error:', error)
    return NextResponse.json({ error: 'Failed to create potential' }, { status: 500 })
  }
}
