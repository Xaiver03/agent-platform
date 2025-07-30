// 这个文件只在Node.js运行时中使用，不在Edge Runtime中使用
import fs from 'fs';
import path from 'path';

export function setupVercelDatabase(): string {
  if (process.env.VERCEL !== '1') {
    return process.env.DATABASE_URL || 'file:./prisma/dev.db';
  }

  console.log('[DB Setup] Running in Vercel environment');
  
  // 在Vercel上，我们需要将数据库复制到/tmp目录
  const sourceDbPath = path.join(process.cwd(), 'prisma', 'prod.db');
  const tmpDbPath = '/tmp/prod.db';
  
  // 检查/tmp中是否已有数据库
  if (!fs.existsSync(tmpDbPath)) {
    console.log('[DB Setup] Database not found in /tmp, copying...');
    
    if (fs.existsSync(sourceDbPath)) {
      try {
        // 复制数据库文件到/tmp
        fs.copyFileSync(sourceDbPath, tmpDbPath);
        console.log('[DB Setup] Database copied successfully to /tmp');
      } catch (error) {
        console.error('[DB Setup] Failed to copy database:', error);
        // 如果复制失败，使用源文件路径（只读）
        return `file:${sourceDbPath}`;
      }
    } else {
      console.error('[DB Setup] Source database not found at:', sourceDbPath);
      // 返回默认的/tmp路径，Prisma会创建新数据库
    }
  } else {
    console.log('[DB Setup] Database already exists in /tmp');
  }
  
  return `file:${tmpDbPath}`;
}