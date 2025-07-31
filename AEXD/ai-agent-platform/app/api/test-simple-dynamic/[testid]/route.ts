import { NextRequest, NextResponse } from 'next/server'

// 添加运行时配置
export const runtime = 'nodejs'

// 最简单的动态路由测试 - 使用统一的参数格式
export async function GET(
  request: NextRequest,
  { params }: { params: { testid: string } }
) {
  console.log('[SIMPLE-DYNAMIC-GET] ID:', params.testid)
  
  return NextResponse.json({ 
    method: 'GET',
    id: params.testid,
    route: '/api/test-simple-dynamic/[testid]',
    timestamp: new Date().toISOString(),
    success: true
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { testid: string } }
) {
  console.log('[SIMPLE-DYNAMIC-PUT] ID:', params.testid)
  
  return NextResponse.json({ 
    method: 'PUT',
    id: params.testid,
    route: '/api/test-simple-dynamic/[testid]',
    timestamp: new Date().toISOString(),
    success: true
  })
}

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: { testid: string } }
) {
  console.log('[SIMPLE-DYNAMIC-OPTIONS] ID:', params.testid)
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}