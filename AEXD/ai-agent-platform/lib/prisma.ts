import { PrismaClient } from '@prisma/client';

// 全局单例模式
const globalForPrisma = global as unknown as { 
  prisma: PrismaClient | undefined;
};

// 创建Prisma客户端
function createPrismaClient() {
  // Vercel上使用/tmp目录
  const databaseUrl = process.env.VERCEL === '1' 
    ? 'file:/tmp/prod.db'
    : (process.env.DATABASE_URL || 'file:./prisma/dev.db');
    
  console.log('[Prisma] Creating client with database URL:', databaseUrl);
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  });
}

// 确保只创建一个实例
const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;