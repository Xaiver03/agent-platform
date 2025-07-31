import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// 全局变量声明
declare global {
  var prismaGlobal: PrismaClient | undefined;
}

// 数据库初始化函数
function initializeDatabase() {
  if (process.env.VERCEL !== '1') {
    console.log('[Prisma] Not in Vercel environment, using default database');
    return;
  }

  const targetDb = '/tmp/prod.db';
  
  // 如果数据库已存在且有效，直接返回
  if (fs.existsSync(targetDb)) {
    const size = fs.statSync(targetDb).size;
    if (size > 10000) { // 大于10KB，认为是有效的
      console.log('[Prisma] Database already exists in /tmp, size:', size);
      return;
    }
  }

  // 从 public 目录复制数据库
  const sourceDb = path.join(process.cwd(), 'public/db/prod.db');
  
  console.log('[Prisma] Attempting to copy database from:', sourceDb);
  
  if (fs.existsSync(sourceDb)) {
    try {
      fs.copyFileSync(sourceDb, targetDb);
      console.log('[Prisma] Database copied successfully to /tmp');
    } catch (error) {
      console.error('[Prisma] Failed to copy database:', error);
    }
  } else {
    console.error('[Prisma] Source database not found at:', sourceDb);
  }
}

// 创建 Prisma 客户端
function createPrismaClient(): PrismaClient {
  // 初始化数据库（仅在 Vercel 环境）
  initializeDatabase();
  
  const isVercel = process.env.VERCEL === '1';
  const databaseUrl = isVercel 
    ? 'file:/tmp/prod.db'
    : (process.env.DATABASE_URL || 'file:./prisma/dev.db');
  
  console.log('[Prisma] Creating client with URL:', databaseUrl);
  
  return new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  });
}

// 单例模式
const prisma = global.prismaGlobal || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}

export default prisma;