import { NextRequest, NextResponse } from 'next/server'

// 最简单的动态路由测试 - 不使用任何复杂逻辑
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ testid: string }> }
) {
  const params = await context.params
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
  context: { params: Promise<{ testid: string }> }
) {
  const params = await context.params
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
  context: { params: Promise<{ testid: string }> }
) {
  const params = await context.params
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