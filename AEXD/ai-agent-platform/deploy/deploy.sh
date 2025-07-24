#!/bin/bash

# AI Agent体验台 - 服务器部署脚本

# 配置变量
APP_NAME="ai-agent-platform"
APP_DIR="/var/www/$APP_NAME"
NODE_VERSION="18"
PORT="3000"

echo "🚀 开始部署 AI Agent 体验台..."

# 1. 检查root权限
if [[ $EUID -ne 0 ]]; then
   echo "❌ 请使用root权限运行此脚本"
   exit 1
fi

# 2. 更新系统
echo "📦 更新系统..."
apt update && apt upgrade -y

# 3. 安装Node.js
echo "🔧 安装Node.js..."
curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash -
apt install -y nodejs npm nginx git

# 4. 创建应用用户
useradd -r -s /bin/false $APP_NAME

# 5. 创建应用目录
mkdir -p $APP_DIR
cd $APP_DIR

# 6. 复制项目文件
echo "📁 复制项目文件..."
# 这里假设项目文件已上传到服务器
# 实际使用时，需要从git仓库或上传的文件复制

# 7. 安装依赖
echo "📦 安装依赖..."
npm ci --production

# 8. 生成Prisma客户端
echo "🔧 生成数据库客户端..."
npx prisma generate
npx prisma db push

# 9. 设置权限
chown -R $APP_NAME:$APP_NAME $APP_DIR
chmod -R 755 $APP_DIR

# 10. 创建PM2配置文件
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'ai-agent-platform',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/ai-agent-platform',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# 11. 安装PM2并启动应用
echo "🚀 配置PM2..."
npm install -g pm2
pm2 startup | grep -v 'command not found' | bash
pm2 start ecosystem.config.js
pm2 save

# 12. 配置Nginx
echo "⚙️  配置Nginx..."
cat > /etc/nginx/sites-available/$APP_NAME << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# 13. 启用站点
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# 14. 设置防火墙
echo "🔒 配置防火墙..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# 15. 创建systemd服务
cat > /etc/systemd/system/$APP_NAME.service << 'EOF'
[Unit]
Description=AI Agent Platform
After=network.target

[Service]
Type=forking
User=ai-agent-platform
WorkingDirectory=/var/www/ai-agent-platform
ExecStart=/usr/bin/pm2 start ecosystem.config.js --env production
ExecReload=/usr/bin/pm2 reload ecosystem.config.js --env production
ExecStop=/usr/bin/pm2 stop ecosystem.config.js
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 16. 启用服务
systemctl daemon-reload
systemctl enable $APP_NAME

echo "✅ 部署完成！"
echo "🌐 访问地址: http://your-server-ip"
echo "📁 应用目录: $APP_DIR"
echo "🔄 重启应用: pm2 restart ai-agent-platform"
echo "📊 查看日志: pm2 logs ai-agent-platform"