import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'

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
    
    const item = await prisma.galleryItem.findUnique({
      where: { id }
    })

    if (!item) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    try {
      const filename = item.url.split('/').pop()
      if (filename) {
        const filePath = join(process.cwd(), 'public', 'uploads', filename)
        await unlink(filePath)
      }
    } catch (fileError) {
      console.error('File deletion error:', fileError)
    }

    await prisma.galleryItem.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gallery delete error:', error)
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}
