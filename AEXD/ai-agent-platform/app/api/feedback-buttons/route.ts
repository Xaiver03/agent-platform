import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma-simple'
import { initializeApi } from '../../../lib/api-init'

// 添加运行时配置
export const runtime = 'nodejs'

export async function GET() {
  try {
    console.log('[API] Fetching feedback buttons...');
    
    // 初始化API（包括数据库设置）
    await initializeApi();
    
    // 确保数据库表存在
    try {
      const count = await prisma.feedbackButton.count();
      console.log(`[API] Found ${count} feedback buttons`);
      
      // 如果没有按钮，创建默认按钮
      if (count === 0) {
        console.log('[API] Creating default feedback buttons...');
        await prisma.feedbackButton.createMany({
          data: [
            {
              title: 'AI产品反馈',
              description: '对具体AI工具的使用反馈',
              url: 'https://forms.gle/example1',
              icon: 'message',
              color: '#1890ff',
              order: 1,
              enabled: true
            },
            {
              title: '平台体验反馈',
              description: '对体验台平台的建议',
              url: 'https://forms.gle/example2',
              icon: 'form',
              color: '#52c41a',
              order: 2,
              enabled: true
            }
          ]
        });
      }
    } catch (dbError) {
      console.error('[API] Database error:', dbError);
      // 如果表不存在，返回空数组
      return NextResponse.json({ buttons: [] });
    }
    
    const buttons = await prisma.feedbackButton.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    })
    
    return NextResponse.json({ buttons })
  } catch (error) {
    console.error('Failed to fetch feedback buttons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback buttons' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { getAdminFromToken } = await import('../../../lib/auth')
    const admin = await getAdminFromToken(request)
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, url, qrCodeImage, icon, color, order, enabled } = body

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      )
    }

    const button = await prisma.feedbackButton.create({
      data: {
        title,
        description,
        url,
        qrCodeImage: qrCodeImage || null,
        icon: icon || 'message',
        color: color || '#1890ff',
        order: parseInt(order) || 0,
        enabled: Boolean(enabled !== false)
      }
    })

    return NextResponse.json({ button })
  } catch (error) {
    console.error('Failed to create feedback button:', error)
    return NextResponse.json(
      { error: 'Failed to create feedback button' },
      { status: 500 }
    )
  }
}