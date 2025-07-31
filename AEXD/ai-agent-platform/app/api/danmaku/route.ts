import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma-simple'

// 获取弹幕列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const type = searchParams.get('type') // 'admin' | 'playback'

    let result
    if (type === 'playback') {
      // 为播放优化的查询
      const danmakus = await prisma.danmaku.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          text: true,
          color: true,
          createdAt: true
        }
      })
      result = {
        danmakus,
        pagination: {
          page: 1,
          limit,
          total: danmakus.length,
          pages: 1
        }
      }
    } else {
      // 常规分页查询
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
      
      result = {
        danmakus,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }

    return NextResponse.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('获取弹幕失败:', error)
    return NextResponse.json(
      { success: false, message: '获取弹幕失败' },
      { status: 500 }
    )
  }
}

// 发送弹幕
export async function POST(request: NextRequest) {
  try {
    const { text, color } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: '弹幕内容不能为空' },
        { status: 400 }
      )
    }

    if (text.length > 20) {
      return NextResponse.json(
        { success: false, message: '弹幕内容不能超过20字' },
        { status: 400 }
      )
    }

    // 获取IP地址和User-Agent
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || 'Unknown'

    const danmaku = await prisma.danmaku.create({
      data: {
        text: text.trim(),
        color: color || '#FFFFFF',
        ipAddress,
        userAgent
      }
    })

    return NextResponse.json({
      success: true,
      danmaku
    })
  } catch (error) {
    console.error('发送弹幕失败:', error)
    return NextResponse.json(
      { success: false, message: '发送弹幕失败' },
      { status: 500 }
    )
  }
}

// 删除弹幕
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: '弹幕ID不能为空' },
        { status: 400 }
      )
    }

    await prisma.danmaku.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: '弹幕删除成功'
    })
  } catch (error) {
    console.error('删除弹幕失败:', error)
    return NextResponse.json(
      { success: false, message: '删除弹幕失败' },
      { status: 500 }
    )
  }
}