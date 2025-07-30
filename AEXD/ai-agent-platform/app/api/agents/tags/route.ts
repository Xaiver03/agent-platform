import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/agents/tags - 获取热门标签和搜索建议
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    // 获取热门标签
    const agents = await prisma.agent.findMany({
      where: { enabled: true },
      select: { tags: true }
    })
    
    const tagCount = new Map<string, number>()
    
    agents.forEach(agent => {
      const tags = agent.tags.split(',').map(tag => tag.trim())
      tags.forEach(tag => {
        if (tag) {
          tagCount.set(tag, (tagCount.get(tag) || 0) + 1)
        }
      })
    })
    
    const popularTags = Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }))

    // 如果有搜索词，则过滤标签
    let filteredTags = popularTags
    if (search) {
      const searchLower = search.toLowerCase()
      filteredTags = popularTags.filter(({ tag }) => 
        tag.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      tags: filteredTags,
      total: filteredTags.length
    })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch tags',
        tags: [],
        total: 0
      },
      { status: 500 }
    )
  }
}