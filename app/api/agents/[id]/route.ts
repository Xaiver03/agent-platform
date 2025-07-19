import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/agents/[id] - 获取单个Agent详情
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
    console.error('Error fetching agent:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    )
  }
}

// PUT /api/agents/[id] - 更新Agent (管理员)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, tags, manager, guideUrl, homepage, icon, enabled, themeColor } = body

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

    const agent = await prisma.agent.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({ agent })
  } catch (error) {
    console.error('Error updating agent:', error)
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    )
  }
}

// DELETE /api/agents/[id] - 删除Agent (管理员)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.agent.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    )
  }
}