import { NextRequest, NextResponse } from 'next/server';
import { initializeApi, getDatabaseStatus } from '../../../lib/api-init';

export async function GET(request: NextRequest) {
  try {
    console.log('[Init API] Starting initialization...');
    
    // 获取初始状态
    const beforeStatus = await getDatabaseStatus();
    
    // 执行初始化
    const startTime = Date.now();
    await initializeApi();
    const duration = Date.now() - startTime;
    
    // 获取初始化后的状态
    const afterStatus = await getDatabaseStatus();
    
    // 尝试查询数据验证
    let validation = null;
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.VERCEL === '1' ? 'file:/tmp/prod.db' : (process.env.DATABASE_URL || 'file:./prisma/dev.db')
          }
        }
      });
      
      const [agentCount, adminCount] = await Promise.all([
        prisma.agent.count(),
        prisma.admin.count()
      ]);
      
      validation = {
        success: true,
        agents: agentCount,
        admins: adminCount
      };
      
      await prisma.$disconnect();
    } catch (error: any) {
      validation = {
        success: false,
        error: error.message
      };
    }
    
    return NextResponse.json({
      success: true,
      message: 'Initialization completed',
      duration: `${duration}ms`,
      before: beforeStatus,
      after: afterStatus,
      validation
    }, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
    
  } catch (error: any) {
    console.error('[Init API] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Initialization failed',
      details: error.message
    }, { status: 500 });
  }
}

// POST endpoint to force re-initialization
export async function POST(request: NextRequest) {
  try {
    // 清除全局状态
    if (global.prisma) {
      await global.prisma.$disconnect();
      global.prisma = undefined;
      global.prismaInitialized = undefined;
    }
    
    // 重新初始化
    await initializeApi();
    
    return NextResponse.json({
      success: true,
      message: 'Re-initialization completed'
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Re-initialization failed',
      details: error.message
    }, { status: 500 });
  }
}