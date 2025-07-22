import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const buttons = await prisma.feedbackButton.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    })
    
    return NextResponse.json({ buttons })
  } catch (error) {
    console.error('Failed to fetch feedback buttons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback buttons' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { getAdminFromToken } = await import('@/lib/auth')
    const admin = await getAdminFromToken(request)
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, url, icon, color, order, enabled } = body

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      )
    }

    const button = await prisma.feedbackButton.create({
      data: {
        title,
        description,
        url,
        icon: icon || 'message',
        color: color || '#1890ff',
        order: parseInt(order) || 0,
        enabled: Boolean(enabled !== false)
      }
    })

    return NextResponse.json({ button })
  } catch (error) {
    console.error('Failed to create feedback button:', error)
    return NextResponse.json(
      { error: 'Failed to create feedback button' },
      { status: 500 }
    )
  }
}