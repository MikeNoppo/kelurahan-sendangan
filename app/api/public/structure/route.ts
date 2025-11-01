import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const members = await prisma.structureMember.findMany({
      select: {
        id: true,
        jabatan: true,
        nama: true,
        nip: true,
        fotoUrl: true,
        positionX: true,
        positionY: true,
        parentId: true,
        urutan: true
      },
      orderBy: [
        { urutan: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Public structure fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch structure' }, { status: 500 })
  }
}
