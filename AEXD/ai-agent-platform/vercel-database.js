// Vercel数据库适配配置

// 方案1：Vercel SQLite (保持现有SQLite)
const getDatabaseUrl = () => {
  if (process.env.VERCEL) {
    // Vercel环境 - 使用持久化存储
    return process.env.DATABASE_URL || "file:./data/vercel.db";
  }
  
  // 本地开发环境
  return process.env.DATABASE_URL || "file:./dev.db";
};

// 方案2：Vercel Postgres (数据库升级)
/*
const getDatabaseUrl = () => {
  if (process.env.VERCEL) {
    return process.env.POSTGRES_URL; // Vercel Postgres URL
  }
  return process.env.DATABASE_URL || "file:./dev.db";
};
*/

module.exports = { getDatabaseUrl };