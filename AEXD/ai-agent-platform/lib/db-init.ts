import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

let prisma: PrismaClient;

// Vercel环境下的数据库初始化
async function initializeDatabase() {
  const isVercel = process.env.VERCEL === '1';
  
  if (isVercel) {
    // 在Vercel上，复制数据库到/tmp目录
    const sourceDb = path.join(process.cwd(), 'prisma', 'prod.db');
    const targetDb = '/tmp/prod.db';
    
    // 检查目标数据库是否已存在
    if (!fs.existsSync(targetDb)) {
      if (fs.existsSync(sourceDb)) {
        try {
          fs.copyFileSync(sourceDb, targetDb);
          console.log('Database copied to /tmp directory');
        } catch (error) {
          console.error('Failed to copy database:', error);
        }
      }
      
      // 如果没有数据库文件，创建临时管理员
      if (!fs.existsSync(targetDb)) {
        console.log('Creating temporary database...');
        // 数据库会在第一次使用时自动创建
      }
    }
  }
  
  // 创建Prisma客户端
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
      }
    }
  });
  
  // 确保管理员账号存在
  if (isVercel) {
    try {
      const adminCount = await prisma.admin.count();
      if (adminCount === 0) {
        console.log('Creating default admin...');
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
        console.log('Default admin created');
      }
      
      // 确保反馈按钮存在
      const buttonCount = await prisma.feedbackButton.count();
      if (buttonCount === 0) {
        console.log('Creating default feedback buttons...');
        await prisma.feedbackButton.createMany({
          data: [
            {
              title: 'AI产品反馈',
              description: '对具体AI工具的使用反馈',
              url: 'https://docs.google.com/forms/d/e/example/viewform',
              icon: 'message',
              color: '#1890ff',
              order: 1,
              enabled: true
            },
            {
              title: '平台体验反馈',
              description: '对体验台平台的建议',
              url: 'https://docs.google.com/forms/d/e/example2/viewform',
              icon: 'form',
              color: '#52c41a',
              order: 2,
              enabled: true
            }
          ]
        });
        console.log('Default feedback buttons created');
      }
    } catch (error) {
      console.error('Failed to check/create defaults:', error);
    }
  }
  
  return prisma;
}

// 获取数据库实例
export async function getDatabase() {
  if (!prisma) {
    prisma = await initializeDatabase();
  }
  return prisma;
}

// 导出类型
export { PrismaClient };
export default getDatabase;