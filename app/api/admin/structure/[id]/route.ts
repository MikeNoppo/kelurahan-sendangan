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

    const { id } = await context.params

    const member = await prisma.structureMember.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true
      }
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json(member)
  } catch (error) {
    console.error('Structure fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 })
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

    const { id } = await context.params

    const { jabatan, nama, nip, fotoUrl, parentId, urutan, positionX, positionY } = await request.json()

    if (jabatan !== undefined && nama !== undefined && (!jabatan || !nama)) {
      return NextResponse.json({ error: 'Jabatan and nama are required' }, { status: 400 })
    }

    const normalizedParentId = parentId !== undefined 
      ? (parentId && parentId !== '' ? String(parentId) : null)
      : undefined

    if (normalizedParentId === id) {
      return NextResponse.json({ error: 'Cannot set self as parent' }, { status: 400 })
    }

    if (fotoUrl !== undefined) {
      const currentMember = await prisma.structureMember.findUnique({
        where: { id }
      })

      if (currentMember?.fotoUrl && currentMember.fotoUrl !== fotoUrl && currentMember.fotoUrl.startsWith('/uploads/structure/')) {
        try {
          const oldFilepath = join(process.cwd(), 'public', currentMember.fotoUrl)
          await unlink(oldFilepath)
        } catch (err) {
          console.error('Failed to delete old photo:', err)
        }
      }
    }

    const updateData: Record<string, unknown> = {}
    if (jabatan !== undefined) updateData.jabatan = jabatan
    if (nama !== undefined) updateData.nama = nama.trim()
    if (nip !== undefined) updateData.nip = nip?.trim() || null
    if (fotoUrl !== undefined) updateData.fotoUrl = fotoUrl
    if (normalizedParentId !== undefined) updateData.parentId = normalizedParentId
    if (urutan !== undefined) updateData.urutan = urutan
    if (positionX !== undefined) updateData.positionX = positionX
    if (positionY !== undefined) updateData.positionY = positionY

    const member = await prisma.structureMember.update({
      where: { id },
      data: updateData,
      include: {
        parent: true
      }
    })

    // Mark as having unpublished changes
    await prisma.structureMetadata.upsert({
      where: { id: 1 },
      update: { hasUnpublished: true },
      create: { id: 1, hasUnpublished: true }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/struktur')

    return NextResponse.json(member)
  } catch (error) {
    console.error('Structure update error:', error)
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
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

    const { id } = await context.params

    const member = await prisma.structureMember.findUnique({
      where: { id },
      include: {
        children: true
      }
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    if (member.fotoUrl && member.fotoUrl.startsWith('/uploads/structure/')) {
      try {
        const filepath = join(process.cwd(), 'public', member.fotoUrl)
        await unlink(filepath)
      } catch (err) {
        console.error('Failed to delete photo:', err)
      }
    }

    await prisma.structureMember.delete({
      where: { id }
    })

    // Mark as having unpublished changes
    await prisma.structureMetadata.upsert({
      where: { id: 1 },
      update: { hasUnpublished: true },
      create: { id: 1, hasUnpublished: true }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/struktur')

    return NextResponse.json({ 
      success: true,
      deletedChildren: member.children.length
    })
  } catch (error) {
    console.error('Structure delete error:', error)
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 })
  }
}
