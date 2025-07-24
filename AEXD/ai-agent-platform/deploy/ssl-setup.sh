#!/bin/bash

# SSL证书配置脚本
# 使用Let's Encrypt免费SSL证书

echo "🔒 配置SSL证书..."

# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取SSL证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期
sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | crontab -

echo "✅ SSL证书配置完成！"