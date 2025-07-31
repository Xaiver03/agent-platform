# Vercel部署检查清单

## 在Vercel控制台检查以下设置：

### 1. Git Integration (Settings → Git)
- [ ] Repository: `Xaiver03/agent-platform`
- [ ] Production Branch: `main`
- [ ] Auto Deploy: `Enabled`

### 2. Environment Variables (Settings → Environment Variables)
必需的环境变量：
- [ ] `DATABASE_URL` = `file:/tmp/prod.db`
- [ ] `JWT_SECRET` = (生成的安全密钥)
- [ ] `NODE_ENV` = `production`
- [ ] `VERCEL` = `1`

### 3. Build & Output Settings
- [ ] Framework Preset: `Next.js`
- [ ] Build Command: (留空，使用默认)
- [ ] Output Directory: (留空，使用默认)
- [ ] Install Command: (留空，使用默认)

### 4. 如果还是不能自动部署，尝试：

#### 方法1：重新连接Git
1. Settings → Git → Disconnect
2. 重新连接GitHub仓库
3. 选择正确的仓库和分支

#### 方法2：检查GitHub Webhooks
1. 去GitHub仓库 → Settings → Webhooks
2. 查看是否有Vercel的webhook
3. 检查Recent Deliveries是否有错误

#### 方法3：手动部署测试
1. 在Deployments页面点击"Create Deployment"
2. 选择main分支
3. 查看构建日志

## 最新提交信息
- Commit: `de4b8f3`
- Message: 修复Vercel构建错误，移除外部UI库依赖
- 已推送到: `origin/main`