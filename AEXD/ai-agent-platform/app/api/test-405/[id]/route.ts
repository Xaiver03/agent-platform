import { NextRequest, NextResponse } from 'next/server'

// 极简测试路由 - 使用传统参数格式

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('[TEST-405-GET] Called with ID:', params.id);
  return NextResponse.json({ 
    method: 'GET', 
    id: params.id,
    message: 'GET method works perfectly!',
    timestamp: new Date().toISOString()
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('[TEST-405-PUT] Called with ID:', params.id);
  
  try {
    const body = await request.json().catch(() => ({}));
    console.log('[TEST-405-PUT] Body:', body);
    
    return NextResponse.json({ 
      method: 'PUT', 
      id: params.id,
      message: 'PUT method works perfectly!',
      receivedBody: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[TEST-405-PUT] Error:', error);
    return NextResponse.json({ 
      error: 'PUT failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('[TEST-405-POST] Called with ID:', params.id);
  return NextResponse.json({ 
    method: 'POST', 
    id: params.id,
    message: 'POST method works perfectly!',
    timestamp: new Date().toISOString()
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('[TEST-405-DELETE] Called with ID:', params.id);
  return NextResponse.json({ 
    method: 'DELETE', 
    id: params.id,
    message: 'DELETE method works perfectly!',
    timestamp: new Date().toISOString()
  })
}

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('[TEST-405-OPTIONS] Called with ID:', params.id);
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, PUT, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}