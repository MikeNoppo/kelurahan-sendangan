import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const potentials = await prisma.potential.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(potentials);
  } catch (error) {
    console.error('Get potentials error:', error);
    return NextResponse.json({ error: 'Failed to fetch potentials' }, { status: 500 });
  }
}
