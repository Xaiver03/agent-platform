import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma-simple';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    console.log('[Debug] Checking database status...');
    
    // 检查管理员数量
    let adminCount = 0;
    let admins = [];
    let adminError = null;
    
    try {
      adminCount = await prisma.admin.count();
      
      // 如果没有管理员，创建默认管理员
      if (adminCount === 0) {
        console.log('[Debug] Creating default admin...');
        const hashedPassword = await bcrypt.hash('miracleplus666,.', 10);
        await prisma.admin.create({
          data: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: '超级管理员',
            role: 'super_admin',
            canChangePassword: true,
            canManageAdmins: true
          }
        });
        adminCount = 1;
      }
      
      // 获取所有管理员邮箱（不返回密码）
      admins = await prisma.admin.findMany({
        select: {
          email: true,
          name: true,
          role: true
        }
      });
    } catch (error) {
      adminError = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Debug] Admin check error:', error);
    }
    
    // 检查反馈按钮
    let buttonCount = 0;
    let buttonError = null;
    
    try {
      buttonCount = await prisma.feedbackButton.count();
    } catch (error) {
      buttonError = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Debug] Button check error:', error);
    }
    
    // 检查数据库文件
    const isVercel = process.env.VERCEL === '1';
    const dbUrl = process.env.DATABASE_URL;
    
    return NextResponse.json({
      status: 'ok',
      environment: {
        isVercel,
        dbUrl: dbUrl ? dbUrl.replace(/[^\/]+$/, '***') : 'not set',
        nodeEnv: process.env.NODE_ENV,
        jwtSecret: process.env.JWT_SECRET ? 'set' : 'not set'
      },
      database: {
        adminCount,
        admins,
        adminError,
        buttonCount,
        buttonError
      }
    });
  } catch (error) {
    console.error('Debug DB error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}