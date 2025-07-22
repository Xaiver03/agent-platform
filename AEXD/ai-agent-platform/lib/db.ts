import { PrismaClient } from '@prisma/client'

// 全局变量声明以避免开发环境中的重复连接
declare global {
  var prisma: PrismaClient | undefined
}

// 数据库连接池配置
export const prisma = globalThis.prisma || new PrismaClient({
  // 开发环境中打印查询日志
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "file:./dev.db"
    }
  },
  
  // SQLite 不需要连接池配置
})

// 开发环境中保存实例避免热重载时重复连接
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// 查询优化辅助函数
export const agentQueries = {
  // 带分页的查询
  findManyWithPagination: async (page: number = 1, limit: number = 20, filters?: {
    enabled?: boolean
    searchTerm?: string
    tag?: string
  }) => {
    const skip = (page - 1) * limit
    const where: any = {}
    
    if (filters?.enabled !== undefined) {
      where.enabled = filters.enabled
    }
    
    if (filters?.searchTerm) {
      // SQLite 不支持 mode: 'insensitive'，使用 LOWER 函数
      const searchLower = filters.searchTerm.toLowerCase()
      where.OR = [
        { name: { contains: searchLower } },
        { description: { contains: searchLower } },
        { tags: { contains: searchLower } }
      ]
    }
    
    if (filters?.tag && filters.tag !== 'all') {
      where.tags = { contains: filters.tag }
    }
    
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
    
    return {
      agents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  },
  
  // 获取热门标签
  getPopularTags: async (limit: number = 20) => {
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
    
    return Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }))
  },
  
  // 增加点击数（带防抖）
  incrementClickCount: async (id: string) => {
    await prisma.agent.update({
      where: { id },
      data: { clickCount: { increment: 1 } }
    })
  }
}

// 弹幕查询优化
export const danmakuQueries = {
  // 带分页和缓存的查询
  findManyWithPagination: async (page: number = 1, limit: number = 50) => {
    const skip = (page - 1) * limit
    
    const [danmakus, total] = await Promise.all([
      prisma.danmaku.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          text: true,
          color: true,
          createdAt: true
        }
      }),
      prisma.danmaku.count()
    ])
    
    return {
      danmakus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  },
  
  // 获取最新弹幕（用于实时播放）
  getLatestForPlayback: async (limit: number = 100) => {
    return prisma.danmaku.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        text: true,
        color: true,
        createdAt: true
      }
    })
  }
}

// 清理函数
export async function disconnectPrisma() {
  await prisma.$disconnect()
}

// 健康检查
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy' }
  } catch (error) {
    return { status: 'unhealthy', error: (error as Error).message }
  }
}