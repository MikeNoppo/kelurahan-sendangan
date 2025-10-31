import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profiles = await prisma.profileInfo.findMany()

    const profileMap = profiles.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json(profileMap)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { key, value } = await request.json()

    if (!key || !value) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    const profile = await prisma.profileInfo.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/profil')

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile save error:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
