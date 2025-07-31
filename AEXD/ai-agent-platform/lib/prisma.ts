import { PrismaClient } from '@prisma/client';
import { initializeApi } from './api-init';

// 扩展 NodeJS global 类型
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  var prismaInitialized: boolean | undefined;
}

// 创建 Prisma 客户端的函数
function createPrismaClient(): PrismaClient {
  // 在 Vercel 环境中使用 /tmp 目录
  const isVercel = process.env.VERCEL === '1';
  const databaseUrl = isVercel 
    ? 'file:/tmp/prod.db'
    : (process.env.DATABASE_URL || 'file:./prisma/dev.db');
  
  console.log('[Prisma] Creating client with configuration:', {
    isVercel,
    databaseUrl,
    nodeEnv: process.env.NODE_ENV
  });
  
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'info', 'warn', 'error'] 
      : ['error', 'warn'],
    datasources: {
      db: {
        url: databaseUrl
      }
    },
    // 错误格式化选项
    errorFormat: 'pretty',
  });

  // 添加中间件来记录查询时间（仅在开发环境）
  if (process.env.NODE_ENV === 'development') {
    client.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      console.log(`[Prisma Query] ${params.model}.${params.action} took ${after - before}ms`);
      return result;
    });
  }

  return client;
}

// 初始化 Prisma 客户端（带自动初始化）
async function initializePrisma(): Promise<PrismaClient> {
  // 如果已经初始化，直接返回
  if (global.prisma && global.prismaInitialized) {
    return global.prisma;
  }

  // 在 Vercel 环境中，先确保数据库已初始化
  if (process.env.VERCEL === '1' && !global.prismaInitialized) {
    console.log('[Prisma] Initializing database for Vercel environment...');
    try {
      await initializeApi();
      global.prismaInitialized = true;
    } catch (error) {
      console.error('[Prisma] Failed to initialize database:', error);
      // 继续执行，让应用至少能启动
    }
  }

  // 创建或获取 Prisma 客户端
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }

  return global.prisma;
}

// 创建一个代理来自动初始化
const prismaProxy = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    // 如果是特殊属性，直接返回
    if (prop === 'then' || prop === 'catch' || prop === 'finally') {
      return undefined;
    }
    
    // 对于其他属性，返回一个函数，该函数会先初始化再调用
    return async (...args: any[]) => {
      const client = await initializePrisma();
      const method = Reflect.get(client, prop, client);
      
      if (typeof method === 'function') {
        return method.apply(client, args);
      }
      
      return method;
    };
  }
});

// 生产环境重用连接，开发环境每次创建新连接
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // 生产环境使用代理自动初始化
  prisma = prismaProxy;
} else {
  // 开发环境直接创建，避免热重载问题
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prisma = global.prisma;
}

// 优雅关闭函数
export async function disconnectPrisma() {
  if (global.prisma) {
    await global.prisma.$disconnect();
    global.prisma = undefined;
    global.prismaInitialized = undefined;
  }
}

// 处理进程退出
if (process.env.NODE_ENV !== 'test') {
  process.on('beforeExit', async () => {
    await disconnectPrisma();
  });
}

export default prisma;

// 导出类型和工具函数
export { PrismaClient, initializePrisma };
export { getDatabaseStatus } from './api-init';