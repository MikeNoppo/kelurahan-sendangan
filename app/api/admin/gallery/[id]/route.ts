import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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
    const id = Number(idParam)
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }
    const item = await prisma.galleryItem.findUnique({
      where: { id }
    })

    if (!item) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    try {
      if (item.url && item.url.startsWith('/uploads/')) {
        const localPath = item.url.split('?')[0]
        const filename = localPath.split('/').pop()
        if (filename) {
          const filePath = join(process.cwd(), 'public', 'uploads', filename)
          try {
            await unlink(filePath)
          } catch (fileError) {
            if ((fileError as any)?.code !== 'ENOENT') {
              console.error('File deletion error:', fileError)
            }
          }
        }
      }
    } catch (fileError) {
      console.error('File deletion error:', fileError)
    }

    await prisma.galleryItem.delete({
      where: { id }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/galeri')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gallery delete error:', error)
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}
