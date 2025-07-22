import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 向后兼容的API - 确保星星能显示
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    let where: any = { enabled: true }

    // 搜索过滤
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } }
      ]
    }

    // 标签过滤
    if (tag && tag !== 'all') {
      where.tags = { contains: tag }
    }

    const agents = await prisma.agent.findMany({
      where,
      orderBy: [
        { enabled: 'desc' },
        { clickCount: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    console.log('Legacy API返回agents数量:', agents.length)

    return NextResponse.json({ agents })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents', agents: [] },
      { status: 500 }
    )
  }
}