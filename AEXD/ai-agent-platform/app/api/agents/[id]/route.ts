import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma-simple'
import { getAdminFromToken } from '../../../../lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id: params.id },
      include: {
        applications: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        feedback: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ agent })
  } catch (error) {
    console.error('[GET] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[PUT] Agent ID:', params.id);
    
    // Check admin authentication
    const admin = await getAdminFromToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    console.log('[PUT] Request body:', body)
    
    const { 
      name, 
      description, 
      tags, 
      manager, 
      guideUrl, 
      homepage, 
      icon, 
      enabled, 
      themeColor,
      coverImage,
      guideContent
    } = body

    // 构建更新数据，只包含提供的字段
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (tags !== undefined) updateData.tags = tags
    if (manager !== undefined) updateData.manager = manager
    if (guideUrl !== undefined) updateData.guideUrl = guideUrl
    if (homepage !== undefined) updateData.homepage = homepage
    if (icon !== undefined) updateData.icon = icon
    if (enabled !== undefined) updateData.enabled = enabled
    if (themeColor !== undefined) updateData.themeColor = themeColor
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (guideContent !== undefined) updateData.guideContent = guideContent

    console.log('[PUT] Update data:', updateData)

    // 实际更新数据库
    const agent = await prisma.agent.update({
      where: { id: params.id },
      data: updateData
    })

    console.log('[PUT] Update successful')
    return NextResponse.json({ agent })
  } catch (error) {
    console.error('[PUT] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const admin = await getAdminFromToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    await prisma.agent.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE] Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}