#!/bin/bash

# 🚀 腾讯云服务器一键初始化脚本
# 在服务器上执行：curl -fsSL https://raw.githubusercontent.com/your-username/ai-agent-platform/main/scripts/init-tencent-cloud.sh | bash

set -e

echo "🚀 开始初始化腾讯云服务器..."

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否为root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ 请使用root用户运行此脚本${NC}"
   exit 1
fi

echo -e "${GREEN}✅ 检测到root权限${NC}"

# 1. 更新系统
echo -e "${YELLOW}📦 更新系统...${NC}"
apt update && apt upgrade -y

# 2. 安装Node.js 18
echo -e "${YELLOW}📥 安装Node.js 18...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    echo -e "${GREEN}✅ Node.js安装完成${NC}"
else
    echo -e "${GREEN}✅ Node.js已安装: $(node --version)${NC}"
fi

# 3. 安装必需软件
echo -e "${YELLOW}📥 安装必需软件...${NC}"
apt install -y \
    nginx \
    pm2 \
    sqlite3 \
    git \
    curl \
    wget \
    build-essential \
    software-properties-common

# 4. 安装PM2全局
echo -e "${YELLOW}📥 安装PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    pm2 startup systemd -u $USER --hp $HOME
    echo -e "${GREEN}✅ PM2安装完成${NC}"
else
    echo -e "${GREEN}✅ PM2已安装: $(pm2 --version)${NC}"
fi

# 5. 创建项目目录
echo -e "${YELLOW}📁 创建项目目录...${NC}"
mkdir -p /var/www/ai-agent-platform
mkdir -p /var/www/ai-agent-platform/data
mkdir -p /var/www/ai-agent-platform/logs
chown -R $USER:$USER /var/www/ai-agent-platform

# 6. 配置Nginx
echo -e "${YELLOW}⚙️ 配置Nginx...${NC}"
cat > /etc/nginx/sites-available/ai-agent-platform << 'EOF'
server {
    listen 80;
    server_name _;
    
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
    
    location /api {
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
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/ai-agent-platform /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试并重启Nginx
nginx -t && systemctl restart nginx
nginx -t && systemctl enable nginx

echo -e "${GREEN}✅ Nginx配置完成${NC}"

# 7. 配置防火墙
echo -e "${YELLOW}🔥 配置防火墙...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 22
    ufw allow 80
    ufw allow 443
    ufw --force enable
    echo -e "${GREEN}✅ 防火墙配置完成${NC}"
else
    echo -e "${YELLOW}⚠️  ufw未安装，跳过防火墙配置${NC}"
fi

# 8. 配置SSH密钥（用于GitHub Actions）
echo -e "${YELLOW}🔑 配置SSH密钥...${NC}"
if [ ! -f ~/.ssh/deploy_key ]; then
    echo -e "${YELLOW}⚠️  请手动配置SSH密钥用于GitHub Actions${NC}"
    echo -e "${YELLOW}执行: ssh-keygen -t rsa -b 4096 -f ~/.ssh/deploy_key${NC}"
    echo -e "${YELLOW}然后将公钥添加到authorized_keys: cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys${NC}"
fi

# 9. 显示服务器信息
echo -e "${GREEN}🌐 服务器信息:${NC}"
echo "IP地址: $(curl -s https://ipinfo.io/ip 2>/dev/null || echo '无法获取')"
echo "主机名: $(hostname)"
echo "Node.js版本: $(node --version)"
echo "NPM版本: $(npm --version)"
echo "PM2版本: $(pm2 --version)"
echo "Nginx状态: $(systemctl is-active nginx)"

# 10. 创建一键检查脚本
echo -e "${YELLOW}📝 创建检查脚本...${NC}"
cat > /usr/local/bin/check-deployment << 'EOF'
#!/bin/bash
echo "🔍 部署环境检查..."
echo "Node.js: $(node --version)"
echo "NPM: $(npm --version)"
echo "PM2: $(pm2 --version)"
echo "Nginx: $(systemctl is-active nginx)"
echo "Git: $(git --version)"
echo "SQLite: $(sqlite3 --version)"
echo ""
echo "📁 项目目录:"
ls -la /var/www/ai-agent-platform 2>/dev/null || echo "目录不存在"
echo ""
echo "🔥 防火墙状态:"
sudo ufw status 2>/dev/null || echo "ufw未安装"
echo ""
echo "🌐 网络端口:"
netstat -tlnp | grep :3000 || echo "端口3000未监听"
EOF

chmod +x /usr/local/bin/check-deployment

echo -e "${GREEN}🎉 服务器初始化完成！${NC}"
echo ""
echo -e "${GREEN}📋 下一步操作:${NC}"
echo "1. 配置GitHub Secrets (TENCENT_HOST, TENCENT_USERNAME, TENCENT_SSH_KEY)"
echo "2. 推送代码到GitHub触发自动部署"
echo "3. 使用 'check-deployment' 命令检查环境"
echo ""
echo -e "${GREEN}🚀 一键使用:${NC}"
echo "curl -fsSL https://raw.githubusercontent.com/your-username/ai-agent-platform/main/scripts/init-tencent-cloud.sh | bash"