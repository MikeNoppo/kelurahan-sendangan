import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const { title, type, body: content, date, featuredImage, status } = body;

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(type && { type: type.toUpperCase() }),
        ...(content !== undefined && { body: content }),
        ...(date !== undefined && { date: date ? new Date(date) : null }),
        ...(featuredImage !== undefined && { featuredImage }),
        ...(status && { status: status.toUpperCase() })
      }
    });

    revalidatePath('/', 'layout');
    revalidatePath('/berita');

    return NextResponse.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.post.delete({
      where: { id: parseInt(id) }
    });

    revalidatePath('/', 'layout');
    revalidatePath('/berita');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
