import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: idParam } = await context.params
    const id = parseInt(idParam)

    const item = await prisma.potential.findUnique({
      where: { id }
    })

    if (!item) {
      return NextResponse.json({ error: 'Potential not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Potential fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch potential' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: idParam } = await context.params
    const id = parseInt(idParam)

    const { name, desc, emoji, imageUrl } = await request.json()

    if (!name || name.trim().length < 3) {
      return NextResponse.json({ error: 'Name is required (min 3 characters)' }, { status: 400 })
    }

    if (imageUrl !== undefined) {
      const currentItem = await prisma.potential.findUnique({
        where: { id }
      })

      if (currentItem?.imageUrl && currentItem.imageUrl !== imageUrl && currentItem.imageUrl.startsWith('/uploads/')) {
        try {
          const oldFilepath = join(process.cwd(), 'public', currentItem.imageUrl)
          await unlink(oldFilepath)
        } catch (err) {
          console.error('Failed to delete old image:', err)
        }
      }
    }

    const item = await prisma.potential.update({
      where: { id },
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
    console.error('Potential update error:', error)
    return NextResponse.json({ error: 'Failed to update potential' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: idParam } = await context.params
    const id = parseInt(idParam)

    const item = await prisma.potential.findUnique({
      where: { id }
    })

    if (!item) {
      return NextResponse.json({ error: 'Potential not found' }, { status: 404 })
    }

    if (item.imageUrl) {
      try {
        const filename = item.imageUrl.split('/').pop()
        if (filename) {
          const filePath = join(process.cwd(), 'public', 'uploads', filename)
          await unlink(filePath)
        }
      } catch (fileError) {
        console.error('File deletion error:', fileError)
      }
    }

    await prisma.potential.delete({
      where: { id }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/potensi')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Potential delete error:', error)
    return NextResponse.json({ error: 'Failed to delete potential' }, { status: 500 })
  }
}
