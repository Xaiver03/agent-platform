import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// 全局单例模式，避免多次创建实例
const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const isVercel = process.env.VERCEL === '1';
  
  // 在Vercel环境，需要特殊处理SQLite
  if (isVercel && process.env.DATABASE_URL?.startsWith('file:')) {
    console.log('[Prisma] Running in Vercel environment');
    
    // 尝试复制数据库到/tmp
    try {
      const sourceDb = path.join(process.cwd(), 'prisma', 'prod.db');
      const targetDb = '/tmp/prod.db';
      
      if (!fs.existsSync(targetDb) && fs.existsSync(sourceDb)) {
        fs.copyFileSync(sourceDb, targetDb);
        console.log('[Prisma] Database copied to /tmp');
      }
    } catch (error) {
      console.error('[Prisma] Failed to copy database:', error);
    }
  }
  
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
  
  return prisma;
}

// 确保只创建一个实例
export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 导出类型
export default prisma;