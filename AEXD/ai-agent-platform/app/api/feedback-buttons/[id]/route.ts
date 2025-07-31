import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma-simple'
import { getAdminFromToken } from '../../../../lib/auth'

// GET单个反馈按钮
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const button = await prisma.feedbackButton.findUnique({
      where: { id: params.id }
    })

    if (!button) {
      return NextResponse.json(
        { error: 'Button not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ button })
  } catch (error) {
    console.error('Failed to fetch feedback button:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback button' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromToken(request)
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, url, qrCodeImage, icon, color, order, enabled } = body

    const button = await prisma.feedbackButton.update({
      where: { id: params.id },
      data: {
        title,
        description,
        url,
        qrCodeImage,
        icon,
        color,
        order: parseInt(order) || 0,
        enabled: Boolean(enabled)
      }
    })

    return NextResponse.json({ button })
  } catch (error) {
    console.error('Failed to update feedback button:', error)
    return NextResponse.json(
      { error: 'Failed to update feedback button' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromToken(request)
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.feedbackButton.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete feedback button:', error)
    return NextResponse.json(
      { error: 'Failed to delete feedback button' },
      { status: 500 }
    )
  }
}