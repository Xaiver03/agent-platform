import { NextRequest, NextResponse } from 'next/server'

// 最简单的PUT路由测试，不依赖任何外部库

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('[DEBUG-GET] Called with ID:', params.id);
  return NextResponse.json({ 
    message: 'GET works',
    id: params.id,
    timestamp: new Date().toISOString()
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('[DEBUG-PUT] Called with ID:', params.id);
  console.log('[DEBUG-PUT] Method:', request.method);
  console.log('[DEBUG-PUT] URL:', request.url);
  
  try {
    const body = await request.json().catch(() => ({}));
    console.log('[DEBUG-PUT] Body:', body);
    
    return NextResponse.json({ 
      message: 'PUT works perfectly!',
      id: params.id,
      receivedBody: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[DEBUG-PUT] Error:', error);
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
  return NextResponse.json({ message: 'POST works', id: params.id })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ message: 'DELETE works', id: params.id })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, PUT, POST, DELETE, OPTIONS',
    },
  })
}