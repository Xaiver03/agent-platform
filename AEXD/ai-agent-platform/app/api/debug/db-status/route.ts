import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseStatus } from '../../../../lib/api-init';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // 获取数据库状态
    const dbStatus = await getDatabaseStatus();
    
    // 检查各种可能的数据库位置
    const locations = [
      '/tmp/prod.db',
      path.join(process.cwd(), 'prisma', 'prod.db'),
      path.join(process.cwd(), 'public', 'db', 'prod.db'),
      path.join(process.cwd(), '.next', 'static', 'db', 'prod.db'),
    ];
    
    const fileChecks = locations.map(loc => ({
      path: loc,
      exists: fs.existsSync(loc),
      size: fs.existsSync(loc) ? fs.statSync(loc).size : 0,
      readable: fs.existsSync(loc) ? fs.accessSync(loc, fs.constants.R_OK) === undefined : false,
      writable: fs.existsSync(loc) ? fs.accessSync(loc, fs.constants.W_OK) === undefined : false,
    }));
    
    // 环境信息
    const environment = {
      VERCEL: process.env.VERCEL,
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL?.replace(/[^:]+:\/\/(.+)/, 'file://<hidden>'),
      cwd: process.cwd(),
      tmpDir: '/tmp',
      platform: process.platform,
      nodeVersion: process.version,
    };
    
    // 尝试查询数据库
    let queryResults = null;
    try {
      const testPrismaModule = await import('../../../../lib/prisma-simple');
      const testPrisma = testPrismaModule.default;
      
      const [agentCount, adminCount, configCount] = await Promise.all([
        testPrisma.agent.count(),
        testPrisma.admin.count(),
        testPrisma.starMagnitudeConfig.count()
      ]);
      
      queryResults = {
        success: true,
        counts: {
          agents: agentCount,
          admins: adminCount,
          starConfigs: configCount
        }
      };
      
      await testPrisma.$disconnect();
    } catch (error: any) {
      queryResults = {
        success: false,
        error: error.message,
        code: error.code
      };
    }
    
    return NextResponse.json({
      status: 'Database Diagnostic Report',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      fileChecks,
      environment,
      queryResults,
      recommendations: generateRecommendations(dbStatus, fileChecks, queryResults)
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to get database status',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

function generateRecommendations(dbStatus: any, fileChecks: any[], queryResults: any): string[] {
  const recommendations: string[] = [];
  
  // Check if database is initialized
  if (!dbStatus.initialized) {
    recommendations.push('Database is not initialized. Check API initialization logs.');
  }
  
  // Check if database file exists in /tmp
  const tmpDb = fileChecks.find(f => f.path === '/tmp/prod.db');
  if (!tmpDb?.exists) {
    recommendations.push('Database file not found in /tmp. Database initialization may have failed.');
  } else if (tmpDb.size < 1024) {
    recommendations.push('Database file in /tmp is too small. It may be corrupted or empty.');
  }
  
  // Check query results
  if (queryResults?.success === false) {
    recommendations.push(`Database queries are failing: ${queryResults.error}`);
    if (queryResults.code === 'P2023') {
      recommendations.push('Database schema mismatch. Try redeploying with a fresh build.');
    }
  } else if (queryResults?.counts?.agents === 0) {
    recommendations.push('Database has no agents. Seed data may not have been loaded.');
  }
  
  // Check for source database files
  const hasSourceDb = fileChecks.some(f => f.exists && f.path !== '/tmp/prod.db');
  if (!hasSourceDb && !tmpDb?.exists) {
    recommendations.push('No database files found anywhere. Check build process and deployment.');
  }
  
  return recommendations.length > 0 ? recommendations : ['Database appears to be functioning correctly.'];
}