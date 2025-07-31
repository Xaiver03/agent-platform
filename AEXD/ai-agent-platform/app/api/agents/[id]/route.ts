import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma-simple'
import { getAdminFromToken } from '../../../../lib/auth'
import { initializeApi } from '../../../../lib/api-init'

// 使用传统的参数格式，确保兼容性

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    console.log('[GET] Agent ID:', params.id);
    
    // Initialize API (for Vercel)
    await initializeApi();
    
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    console.log('[PUT] Agent ID:', params.id);
    console.log('[PUT] Request method:', request.method);
    console.log('[PUT] Request URL:', request.url);
    
    // Initialize API (for Vercel)
    await initializeApi();
    
    // Check admin authentication
    const admin = await getAdminFromToken(request)
    if (!admin) {
      console.log('[PUT] Unauthorized: No admin token found')
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    console.log('[DELETE] Agent ID:', params.id);
    
    // Initialize API (for Vercel)
    await initializeApi();
    
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

export async function OPTIONS(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  console.log('[OPTIONS] Called for agent:', params.id);
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*',
    },
  })
}