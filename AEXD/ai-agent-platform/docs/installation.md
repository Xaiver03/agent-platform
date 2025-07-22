# 🚀 安装指南

## 系统要求

### 基础环境
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0 或 **yarn**: >= 1.22.0
- **Git**: 最新版本

### 操作系统支持
- ✅ macOS 10.15+
- ✅ Windows 10+
- ✅ Linux (Ubuntu 18.04+)

## 🛠️ 安装步骤

### 1. 克隆项目
```bash
git clone <repository-url>
cd ai-agent-platform
```

### 2. 安装依赖
```bash
npm install
# 或者使用 yarn
yarn install
```

### 3. 环境配置
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑环境变量（可选）
nano .env.local
```

### 4. 数据库初始化
```bash
# 创建数据库表
npx prisma db push

# 填充初始数据
npx prisma db seed
```

### 5. 启动项目

#### 方式一：双击启动（推荐）
- 双击 `启动AI体验台.command` 文件

#### 方式二：命令行启动
```bash
npm run dev
# 或指定端口
npm run dev -- --port 3001
```

## 📱 访问应用

启动成功后，打开浏览器访问：
- **主页**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin/login

默认管理员账号：
- **邮箱**: admin@example.com  
- **密码**: admin123

## 🐛 常见安装问题

### Node.js 版本问题
```bash
# 检查 Node.js 版本
node --version

# 如果版本过低，请升级到 18.0.0+
# 推荐使用 nvm 管理 Node.js 版本
```

### 依赖安装失败
```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install

# 或者使用 yarn
yarn install
```

### 端口被占用
```bash
# 查看端口占用
lsof -i :3000

# 终止占用进程
kill -9 <PID>

# 或者使用其他端口
npm run dev -- --port 3001
```

### 数据库问题
```bash
# 重置数据库
npx prisma db push --force-reset

# 重新填充数据
npx prisma db seed
```

## 🔧 高级配置

### 环境变量说明
```env
# 数据库配置
DATABASE_URL="file:./dev.db"

# Next.js 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# 上传配置
UPLOAD_DIR="./public/uploads"
```

### 自定义配置
```bash
# 修改默认端口
# 编辑 package.json 的 scripts.dev

# 修改数据库位置
# 编辑 prisma/schema.prisma 的 DATABASE_URL
```

## 📦 生产环境安装

### 构建项目
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```

### 使用 PM2 管理进程
```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "ai-agent-platform" -- start

# 查看状态
pm2 status

# 查看日志
pm2 logs ai-agent-platform
```

## 🐳 Docker 安装

### 使用 Docker Compose（推荐）
```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 单独使用 Docker
```bash
# 构建镜像
docker build -t ai-agent-platform .

# 运行容器
docker run -p 3000:3000 ai-agent-platform
```

## ✅ 安装验证

安装完成后，请验证以下功能：

### 1. 基础功能测试
- [ ] 主页可以正常访问
- [ ] 可以搜索和筛选AI工具
- [ ] 工具详情页可以打开

### 2. 管理功能测试  
- [ ] 管理员可以正常登录
- [ ] 可以添加、编辑、删除工具
- [ ] 反馈按钮配置正常工作

### 3. 数据持久化测试
- [ ] 重启服务后数据不丢失
- [ ] 图片上传功能正常
- [ ] 数据库连接稳定

## 🆘 获取帮助

如果安装过程中遇到问题：

1. **查看日志**: 检查控制台输出的错误信息
2. **常见问题**: 参考 [FAQ文档](faq.md)
3. **GitHub Issues**: 搜索或提交新问题
4. **联系我们**: admin@example.com

---

*最后更新: 2025-07-18*