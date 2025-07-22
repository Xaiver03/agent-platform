import { NextRequest, NextResponse } from 'next/server'
import { agentQueries } from '@/lib/db'

// GET /api/agents - 获取Agent列表（支持分页和筛选）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const searchTerm = searchParams.get('search') || undefined
    const tag = searchParams.get('tag') || undefined
    const enabled = searchParams.get('enabled') !== 'false' // 默认只显示启用的

    console.log('API参数:', { page, limit, searchTerm, tag, enabled })

    const result = await agentQueries.findManyWithPagination(page, limit, {
      enabled,
      searchTerm,
      tag
    })

    console.log('API结果:', result)

    return NextResponse.json({
      success: true,
      agents: result.agents || [],
      pagination: result.pagination || { page: 1, limit: 20, total: 0, pages: 0 }
    })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch agents',
        agents: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      },
      { status: 500 }
    )
  }
}

// POST /api/agents - 创建新Agent (管理员)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, tags, manager, guideUrl, homepage, icon, themeColor } = body

    // 基本验证
    if (!name?.trim() || !description?.trim() || !manager?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name, description, and manager are required' },
        { status: 400 }
      )
    }

    // 使用 prisma 实例
    const { prisma } = await import('@/lib/db')
    
    const agent = await prisma.agent.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        tags: tags || '',
        manager: manager.trim(),
        guideUrl,
        homepage,
        icon,
        themeColor: themeColor || '#FFFFFF',
        enabled: true
      }
    })

    return NextResponse.json({ 
      success: true,
      agent 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}