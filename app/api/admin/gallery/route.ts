import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gallery = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Get gallery error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}
