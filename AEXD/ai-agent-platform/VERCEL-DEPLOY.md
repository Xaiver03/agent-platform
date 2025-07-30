# 🚀 Vercel 部署指南

## 快速部署步骤

### 1. 准备工作

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login
```

### 2. 准备数据库

```bash
# 运行准备脚本，创建生产数据库
node scripts/prepare-vercel-db.js --seed
```

### 3. 配置环境变量

在Vercel Dashboard中设置以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `file:/tmp/prod.db` | SQLite数据库路径 |
| `JWT_SECRET` | `your-strong-jwt-secret` | JWT签名密钥 |
| `ADMIN_PASSWORD` | `your-admin-password` | 管理员密码 |
| `NEXT_PUBLIC_APP_NAME` | `AI Agent 体验台` | 应用名称 |

### 4. 部署到Vercel

```bash
# 一键部署
vercel --prod

# 或者使用GitHub集成
# 1. 在Vercel Dashboard导入GitHub仓库
# 2. 自动部署
```

## 重要说明

### SQLite在Vercel的限制

1. **文件系统只读** - Vercel的文件系统是只读的，除了`/tmp`目录
2. **数据不持久** - `/tmp`目录的数据在函数重启后会丢失
3. **解决方案**：
   - 使用预构建的数据库文件
   - 考虑升级到Vercel Postgres或其他云数据库

### 推荐：升级到Vercel Postgres

如果需要持久化数据存储，建议使用Vercel Postgres：

```bash
# 1. 在Vercel Dashboard创建Postgres数据库

# 2. 更新prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
}

# 3. 运行迁移
npx prisma migrate deploy
```

## 部署后验证

1. **访问主页** - `https://your-app.vercel.app`
2. **测试API** - `https://your-app.vercel.app/api/agents`
3. **管理后台** - `https://your-app.vercel.app/admin`

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 确认DATABASE_URL环境变量设置正确
   - 检查日志：`vercel logs`

2. **管理后台无法登录**
   - 确认ADMIN_PASSWORD环境变量已设置
   - 清除浏览器Cookie重试

3. **API响应慢**
   - 首次访问需要初始化数据库
   - 考虑使用云数据库提升性能

### 获取帮助

- Vercel文档：https://vercel.com/docs
- 项目Issues：https://github.com/Xaiver03/agent-platform/issues