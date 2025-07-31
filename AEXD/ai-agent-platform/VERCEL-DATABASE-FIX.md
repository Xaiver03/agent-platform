# Vercel 数据库修复方案

本文档详细说明了如何彻底解决 Vercel 部署时数据库为空的问题。

## 问题概述

Vercel 的文件系统是只读的，只有 `/tmp` 目录可写。这导致 SQLite 数据库需要特殊处理才能正常工作。

## 解决方案架构

### 1. 构建时生成预填充数据库

创建了 `prisma/create-prod-db.ts` 脚本，在构建时生成包含所有种子数据的数据库文件。

### 2. 智能初始化策略

`lib/api-init.ts` 实现了三层初始化策略：
- **策略1**: 检查 `/tmp` 是否已有有效数据库
- **策略2**: 从多个位置复制数据库文件
- **策略3**: 在运行时创建最小数据库

### 3. 增强的 Prisma 客户端

`lib/prisma.ts` 使用代理模式，在生产环境自动初始化数据库。

## 实施步骤

### 步骤 1: 生成生产数据库

```bash
# 运行脚本生成包含所有数据的数据库
npx tsx prisma/create-prod-db.ts
```

这将创建 `prisma/prod.db`，包含：
- 20个预配置的 AI Agent
- 管理员账户
- 星等配置
- 反馈按钮配置

### 步骤 2: 配置 Vercel

1. 在 Vercel Dashboard 中设置环境变量：
   ```
   DATABASE_URL=file:/tmp/prod.db
   JWT_SECRET=<生成的安全密钥>
   VERCEL=1
   ```

2. 确保 `vercel.json` 使用自定义构建脚本：
   ```json
   {
     "buildCommand": "chmod +x vercel-build.sh && ./vercel-build.sh"
   }
   ```

### 步骤 3: 部署到 Vercel

```bash
# 提交所有更改
git add .
git commit -m "fix: 完整的Vercel数据库解决方案"
git push

# Vercel 会自动部署
```

## 验证和调试

### 1. 检查数据库状态

访问以下端点查看数据库诊断信息：
```
https://your-app.vercel.app/api/debug/db-status
```

### 2. 手动初始化

如果需要，可以手动触发初始化：
```
https://your-app.vercel.app/api/init
```

### 3. 查看日志

在 Vercel Dashboard 的 Functions 标签页查看详细日志。

## 关键文件说明

### `prisma/create-prod-db.ts`
- 生成预填充的生产数据库
- 包含所有种子数据
- 验证数据完整性

### `vercel-build.sh`
- 自定义构建脚本
- 检查并创建数据库
- 复制到正确位置

### `lib/api-init.ts`
- 智能初始化逻辑
- 多重失败保护
- 详细日志记录

### `lib/prisma.ts`
- 增强的 Prisma 客户端
- 自动初始化
- 连接池管理

## 常见问题

### Q: 为什么不使用云数据库？
A: SQLite 对于这个项目完全足够，避免了额外的复杂性和成本。

### Q: 数据会丢失吗？
A: `/tmp` 目录在函数冷启动时会清空，但我们的初始化策略会自动恢复数据。

### Q: 如何更新种子数据？
A: 修改 `prisma/create-prod-db.ts`，重新生成数据库，然后重新部署。

## 管理员登录

默认管理员账户：
- Email: `admin@example.com`
- Password: `miracleplus666,.`

**重要**: 首次登录后请立即修改密码！

## 性能优化

1. 数据库文件被缓存在 `/tmp`，避免重复复制
2. 使用全局 Prisma 实例，减少连接开销
3. 初始化状态被追踪，避免重复初始化
4. 使用 Vercel 的 cron 功能定期预热

## 监控建议

1. 设置 Vercel 的监控告警
2. 定期检查 `/api/debug/db-status`
3. 监控 API 响应时间
4. 检查错误日志

## 总结

这个解决方案通过以下方式确保数据库始终有数据：

1. **构建时准备**: 预先生成完整数据库
2. **智能初始化**: 多层失败保护机制
3. **自动恢复**: 即使数据丢失也能快速恢复
4. **详细日志**: 便于问题诊断和调试

部署后，您的应用将在 Vercel 上稳定运行，数据库始终包含完整的种子数据。