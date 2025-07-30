import { NextResponse } from 'next/server'

// 静态数据，不依赖数据库
export async function GET() {
  return NextResponse.json({
    buttons: [
      {
        id: '1',
        title: 'AI产品反馈',
        description: '对具体AI工具的使用反馈',
        url: 'https://docs.google.com/forms/d/e/1FAIpQLSdXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/viewform',
        icon: 'message',
        color: '#1890ff',
        order: 1,
        enabled: true
      },
      {
        id: '2',
        title: '平台体验反馈',
        description: '对体验台平台的建议',
        url: 'https://docs.google.com/forms/d/e/1FAIpQLSdYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY/viewform',
        icon: 'form',
        color: '#52c41a',
        order: 2,
        enabled: true
      }
    ]
  })
}