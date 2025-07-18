import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/agents - 获取所有启用的Agent
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    let where: any = { enabled: true }

    // 搜索过滤
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    }

    // 标签过滤
    if (tag && tag !== 'all') {
      where.tags = { has: tag }
    }

    const agents = await prisma.agent.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ agents })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}

// POST /api/agents - 创建新Agent (管理员)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, tags, manager, guideUrl, homepage, icon } = body

    const agent = await prisma.agent.create({
      data: {
        name,
        description,
        tags,
        manager,
        guideUrl,
        homepage,
        icon,
        enabled: true
      }
    })

    return NextResponse.json({ agent }, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}