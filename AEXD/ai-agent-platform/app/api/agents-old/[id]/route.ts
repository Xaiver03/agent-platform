import { NextRequest, NextResponse } from 'next/server'

// 使用旧版参数格式测试

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ 
    method: 'GET', 
    id: params.id,
    format: 'old format' 
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ 
    method: 'PUT', 
    id: params.id,
    format: 'old format' 
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, PUT, OPTIONS',
    },
  })
}