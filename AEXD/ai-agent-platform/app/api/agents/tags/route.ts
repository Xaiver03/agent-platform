import { NextRequest, NextResponse } from 'next/server'
import { agentQueries } from '@/lib/db'

// GET /api/agents/tags - 获取热门标签和搜索建议
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    // 获取热门标签
    const popularTags = await agentQueries.getPopularTags(limit)

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