import { NextRequest, NextResponse } from 'next/server'

// 最简单的非动态路由测试

export async function GET() {
  console.log('[SIMPLE-TEST-GET] Called');
  return NextResponse.json({ 
    message: 'Simple GET works!',
    timestamp: new Date().toISOString()
  })
}

export async function PUT(request: NextRequest) {
  console.log('[SIMPLE-TEST-PUT] Called');
  
  try {
    const body = await request.json().catch(() => ({}));
    console.log('[SIMPLE-TEST-PUT] Body:', body);
    
    return NextResponse.json({ 
      message: 'Simple PUT works!',
      receivedBody: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[SIMPLE-TEST-PUT] Error:', error);
    return NextResponse.json({ 
      error: 'PUT failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log('[SIMPLE-TEST-POST] Called');
  return NextResponse.json({ 
    message: 'Simple POST works!',
    timestamp: new Date().toISOString()
  })
}

export async function DELETE() {
  console.log('[SIMPLE-TEST-DELETE] Called');
  return NextResponse.json({ 
    message: 'Simple DELETE works!',
    timestamp: new Date().toISOString()
  })
}

export async function OPTIONS() {
  console.log('[SIMPLE-TEST-OPTIONS] Called');
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, PUT, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}