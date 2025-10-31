import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    
    if (type && type !== 'all') {
      where.type = type.toUpperCase();
    }
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }
    
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive'
      };
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, type, body: content, date, featuredImage, status } = body;

    if (!title || !type) {
      return NextResponse.json({ error: 'Title and type are required' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        type: type.toUpperCase(),
        body: content,
        date: date ? new Date(date) : null,
        featuredImage,
        status: status?.toUpperCase() || 'DRAFT'
      }
    });

    revalidatePath('/', 'layout');
    revalidatePath('/berita');

    return NextResponse.json(post);
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
