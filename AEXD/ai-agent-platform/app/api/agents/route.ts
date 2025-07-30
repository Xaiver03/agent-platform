import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { initializeApi } from '@/lib/api-init'

// 添加运行时配置
export const runtime = 'nodejs'

// GET /api/agents - 获取Agent列表（支持分页和筛选）
export async function GET(request: NextRequest) {
  try {
    console.log('[Agents API] Starting request...');
    
    // 初始化API（包括数据库设置）
    await initializeApi();
    
    // 首先检查是否有数据
    let agentCount = 0;
    try {
      agentCount = await prisma.agent.count();
      console.log('[Agents API] Total agents in database:', agentCount);
    } catch (dbError) {
      console.error('[Agents API] Database error:', dbError);
      // 如果数据库查询失败，返回默认数据
      return NextResponse.json({
        success: true,
        agents: [
          {
            id: '1',
            name: 'ChatGPT',
            description: '强大的AI对话助手',
            tags: '对话,写作,编程',
            manager: 'OpenAI',
            homepage: 'https://chat.openai.com',
            icon: '💬',
            enabled: true,
            clickCount: 50,
            themeColor: '#74AA9C'
          },
          {
            id: '2',
            name: 'Claude',
            description: '安全可靠的AI助手',
            tags: '对话,分析,编程',
            manager: 'Anthropic',
            homepage: 'https://claude.ai',
            icon: '🤖',
            enabled: true,
            clickCount: 30,
            themeColor: '#8B7EC8'
          },
          {
            id: '3',
            name: 'Midjourney',
            description: 'AI图像生成工具',
            tags: '图像,设计,创意',
            manager: 'Midjourney',
            homepage: 'https://midjourney.com',
            icon: '🎨',
            enabled: true,
            clickCount: 80,
            themeColor: '#FFB347'
          }
        ],
        pagination: { page: 1, limit: 20, total: 3, pages: 1 }
      });
    }
    
    // 如果没有数据，创建一些默认的AI工具
    if (agentCount === 0) {
      console.log('[Agents API] No agents found, creating defaults...');
      await prisma.agent.createMany({
        data: [
          {
            name: 'ChatGPT',
            description: '强大的AI对话助手',
            tags: '对话,写作,编程',
            manager: 'OpenAI',
            homepage: 'https://chat.openai.com',
            icon: '💬',
            enabled: true,
            clickCount: 50
          },
          {
            name: 'Claude',
            description: '安全可靠的AI助手',
            tags: '对话,分析,编程',
            manager: 'Anthropic',
            homepage: 'https://claude.ai',
            icon: '🤖',
            enabled: true,
            clickCount: 30
          },
          {
            name: 'Midjourney',
            description: 'AI图像生成工具',
            tags: '图像,设计,创意',
            manager: 'Midjourney',
            homepage: 'https://midjourney.com',
            icon: '🎨',
            enabled: true,
            clickCount: 80
          }
        ]
      });
    }
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const searchTerm = searchParams.get('search') || undefined
    const tag = searchParams.get('tag') || undefined
    const enabled = searchParams.get('enabled') !== 'false' // 默认只显示启用的

    console.log('[Agents API] Query params:', { page, limit, searchTerm, tag, enabled })

    // 构建查询条件
    const where: any = {}
    
    if (enabled !== undefined) {
      where.enabled = enabled
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      where.OR = [
        { name: { contains: searchLower } },
        { description: { contains: searchLower } },
        { tags: { contains: searchLower } }
      ]
    }
    
    if (tag && tag !== 'all') {
      where.tags = { contains: tag }
    }
    
    const skip = (page - 1) * limit
    
    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where,
        orderBy: [
          { enabled: 'desc' },
          { clickCount: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          tags: true,
          manager: true,
          homepage: true,
          icon: true,
          themeColor: true,
          enabled: true,
          clickCount: true,
          guideUrl: true
        }
      }),
      prisma.agent.count({ where })
    ])
    
    const result = {
      agents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }

    console.log('[Agents API] Result:', { count: result.agents.length, total: result.pagination.total })

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

    // 使用统一的 prisma 实例
    
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