import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const { jabatan, nama, nip, lingkungan, parentId, urutan } = await request.json()

    if (!jabatan || !nama) {
      return NextResponse.json({ error: 'Jabatan and nama are required' }, { status: 400 })
    }

    if (parentId === id) {
      return NextResponse.json({ error: 'Cannot set self as parent' }, { status: 400 })
    }

    const member = await prisma.structureMember.update({
      where: { id },
      data: {
        jabatan,
        nama: nama.trim(),
        nip: nip?.trim() || null,
        lingkungan: lingkungan ? parseInt(lingkungan) : null,
        parentId: parentId || null,
        urutan: urutan ?? undefined
      },
      include: {
        parent: true
      }
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

    await prisma.structureMember.delete({
      where: { id }
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
