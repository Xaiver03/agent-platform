# Docker 部署指南

## 快速开始

### 1. 使用 Docker Compose 运行（推荐）

```bash
# 克隆项目
git clone https://github.com/Xaiver03/ai-agent-platform.git
cd ai-agent-platform

# 复制环境变量文件
cp .env.example .env.local

# 编辑 .env.local 文件，设置必要的环境变量
# 特别是 JWT_SECRET 和 ADMIN_PASSWORD

# 构建并启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止容器
docker-compose down
```

### 2. 使用 Docker 单独运行

```bash
# 构建镜像
docker build -t ai-agent-platform .

# 运行容器
docker run -d \
  --name ai-agent-platform \
  -p 3000:3000 \
  -e DATABASE_URL="file:./data/production.db" \
  -e JWT_SECRET="your-jwt-secret-here" \
  -e ADMIN_PASSWORD="your-secure-password-here" \
  -v $(pwd)/data:/app/data \
  ai-agent-platform
```

## 开发环境

使用开发环境的 Docker Compose 配置：

```bash
# 使用开发配置启动
docker-compose -f docker-compose.dev.yml up

# 代码修改会自动重载
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| DATABASE_URL | 数据库连接字符串 | file:./data/production.db |
| JWT_SECRET | JWT 签名密钥 | - |
| ADMIN_PASSWORD | 管理员初始密码 | - |
| NODE_ENV | 运行环境 | production |
| PORT | 服务端口 | 3000 |

## 数据持久化

- 数据库文件存储在 `./data` 目录
- 上传文件存储在 `./uploads` 目录
- 使用 Docker volumes 确保数据持久化

## 健康检查

容器包含健康检查，可以通过以下命令查看状态：

```bash
docker ps
docker inspect ai-agent-platform --format='{{.State.Health.Status}}'
```

## 注意事项

1. 生产环境请务必修改默认的 JWT_SECRET 和 ADMIN_PASSWORD
2. 数据目录需要适当的权限设置
3. 建议使用反向代理（如 Nginx）处理 HTTPS
4. 定期备份 data 目录中的数据库文件