# 🚀 GitHub Actions 腾讯云自动部署配置指南

## 📋 配置步骤

### 1. 配置GitHub Secrets

在GitHub仓库设置中添加以下Secrets：

#### **腾讯云服务器配置**
| Secret名称 | 说明 | 示例 |
|------------|------|------|
| `TENCENT_HOST` | 腾讯云服务器IP地址 | `123.207.167.89` |
| `TENCENT_USERNAME` | 服务器用户名 | `root` |
| `TENCENT_SSH_KEY` | SSH私钥 | 完整RSA私钥内容 |
| `TENCENT_PORT` | SSH端口 | `22` |

#### **获取服务器信息**
```bash
# 在腾讯云服务器上执行
echo "服务器IP: $(curl -s https://ipinfo.io/ip)"
whoami  # 获取用户名
```

#### **生成SSH密钥对**
```bash
# 在本地或服务器上生成
ssh-keygen -t rsa -b 4096 -f ~/.ssh/tencent_deploy_key

# 公钥添加到服务器
ssh-copy-id -i ~/.ssh/tencent_deploy_key.pub root@YOUR_SERVER_IP

# 私钥内容复制到GitHub Secrets
cat ~/.ssh/tencent_deploy_key
```

### 2. 服务器初始化脚本

在腾讯云服务器上执行：

```bash
# 一键初始化脚本
curl -fsSL https://raw.githubusercontent.com/your-username/ai-agent-platform/main/scripts/init-server.sh | bash
```

### 3. 手动配置步骤

#### **安装必要软件**
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装其他工具
sudo apt install -y nginx pm2 sqlite3 git curl

# 验证安装
node --version
npm --version
pm2 --version
```

#### **配置目录权限**
```bash
# 创建项目目录
sudo mkdir -p /var/www/ai-agent-platform
sudo chown -R $USER:$USER /var/www/ai-agent-platform
```

#### **配置PM2开机启动**
```bash
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
```

### 4. GitHub Actions工作流文件

已创建两个工作流：

1. **tencent-deploy-complete.yml** - 完整自动部署
2. **tencent-cloud-deploy.yml** - 简化版本

### 5. 测试部署

#### **手动触发部署**
1. 进入GitHub仓库Actions页面
2. 选择"🚀 Tencent Cloud Auto Deploy"
3. 点击"Run workflow"

#### **自动触发**
- 推送代码到main分支自动触发

### 6. 验证部署成功

```bash
# 在服务器上检查状态
pm2 status ai-agent-platform

# 检查端口
netstat -tlnp | grep :3000

# 查看日志
pm2 logs ai-agent-platform
```

### 7. 故障排除

#### **常见问题**

1. **SSH连接失败**
```bash
# 检查防火墙
sudo ufw status
sudo iptables -L

# 检查SSH服务
sudo systemctl status sshd
```

2. **权限问题**
```bash
sudo chown -R $USER:$USER /var/www/ai-agent-platform
```

3. **Node.js版本问题**
```bash
# 检查版本
node --version  # 需要v18+
```

#### **日志查看**
```bash
# GitHub Actions日志
# 查看GitHub仓库 → Actions → 具体workflow运行记录

# 服务器应用日志
pm2 logs ai-agent-platform
```

## 🎯 快速开始

### **一键配置命令**

在腾讯云服务器上执行：

```bash
# 下载并执行初始化脚本
wget -O setup.sh https://raw.githubusercontent.com/your-username/ai-agent-platform/main/scripts/setup-tencent-cloud.sh
chmod +x setup.sh
./setup.sh
```

### **验证配置**

1. **检查GitHub Secrets是否配置正确**
2. **推送代码测试自动部署**
3. **访问服务器IP:3000验证应用**

## 📊 部署状态监控

- **GitHub Actions**: 仓库 → Actions标签页
- **应用状态**: `pm2 status`
- **系统资源**: `htop` 或 `top`

## 🔄 更新和回滚

### **更新应用**
```bash
# 手动回滚（如果需要）
cd /var/www/ai-agent-platform
pm2 stop ai-agent-platform
tar -xzf backup-*.tar.gz
pm2 start ai-agent-platform
```

### **重新部署**
只需推送代码到main分支即可自动触发部署！