#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 准备Vercel部署数据库...');

try {
  // 1. 创建生产数据库
  const dbPath = path.join(__dirname, '..', 'prisma', 'prod.db');
  
  // 设置环境变量指向生产数据库
  process.env.DATABASE_URL = `file:${dbPath}`;
  
  // 确保目录存在
  const prismaDir = path.dirname(dbPath);
  if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true });
  }
  
  // 2. 生成Prisma客户端
  console.log('📦 生成Prisma客户端...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // 3. 创建数据库架构
  console.log('🔨 创建数据库架构...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  // 4. 运行种子数据（可选）
  if (process.argv.includes('--seed')) {
    console.log('🌱 添加种子数据...');
    execSync('npx prisma db seed', { stdio: 'inherit' });
  }
  
  // 5. 验证数据库
  if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    console.log(`✅ 数据库创建成功！大小: ${(stats.size / 1024).toFixed(2)} KB`);
  } else {
    throw new Error('数据库文件未创建');
  }
  
  console.log('\n📝 Vercel部署步骤:');
  console.log('1. 确保 prisma/prod.db 已提交到Git');
  console.log('2. 在Vercel Dashboard设置环境变量:');
  console.log('   - DATABASE_URL: "file:/tmp/prod.db"');
  console.log('   - JWT_SECRET: 你的JWT密钥');
  console.log('   - ADMIN_PASSWORD: 管理员密码');
  console.log('3. 部署: npx vercel --prod');
  
} catch (error) {
  console.error('❌ 错误:', error.message);
  process.exit(1);
}