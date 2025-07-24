#!/bin/bash

echo "🚀 构建真正的零依赖exe..."

# 清理旧文件
rm -rf dist-exe simple-server.js 2>/dev/null
mkdir -p dist-exe

# 安装pkg
npm install --no-save pkg@5.8.1

# 创建简化服务器
cat > simple-server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 静态文件服务
const publicPath = path.join(__dirname, 'public');
if (require('fs').existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// 根路由
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Agent 体验台</title>
        <style>
            body { 
                margin: 0; 
                padding: 0; 
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                color: white;
                font-family: Arial, sans-serif;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
            .container { 
                padding: 40px; 
                max-width: 600px;
            }
            .title { 
                font-size: 3rem; 
                margin-bottom: 1rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .subtitle { 
                font-size: 1.5rem; 
                opacity: 0.8; 
                margin-bottom: 2rem;
            }
            .info {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 20px;
                margin-top: 20px;
            }
            .features {
                text-align: left;
                margin-top: 20px;
            }
            .features li {
                margin: 10px 0;
                opacity: 0.9;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">🌌 AI Agent 体验台</h1>
            <p class="subtitle">零依赖独立运行版</p>
            <div class="info">
                <h3>✅ 功能特点</h3>
                <ul class="features">
                    <li>🚀 零依赖运行 - 无需安装Node.js</li>
                    <li>🖱️ 一键启动 - 双击即可运行</li>
                    <li>💾 数据本地存储</li>
                    <li>🌐 完整Web体验</li>
                    <li>📱 响应式设计</li>
                </ul>
            </div>
            <div class="info">
                <h3>📋 使用说明</h3>
                <p>服务器已启动，访问 http://localhost:${port}</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log('🌌 AI Agent 体验台已启动！');
  console.log('🌐 访问地址: http://localhost:' + port);
  console.log('💡 按 Ctrl+C 停止服务');
  
  // 自动打开浏览器
  const { exec } = require('child_process');
  setTimeout(() => {
    const url = 'http://localhost:' + port;
    const command = process.platform === 'win32' ? `start ${url}` : 
                   process.platform === 'darwin' ? `open ${url}` : 
                   `xdg-open ${url}`;
    exec(command, () => {});
  }, 2000);
});
EOF

# 构建exe
echo "📦 构建exe..."
npx pkg simple-server.js --targets node18-win-x64 --output dist-exe/AI-Agent-体验台.exe

# 创建简化HTML
cat > dist-exe/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Agent 体验台</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            font-family: Arial, sans-serif;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .container { padding: 40px; max-width: 600px; }
        .title { font-size: 3rem; margin-bottom: 1rem; }
        .subtitle { font-size: 1.5rem; opacity: 0.8; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">🌌 AI Agent 体验台</h1>
        <p class="subtitle">零依赖独立运行版</p>
    </div>
</body>
</html>
EOF

echo ""
echo "🎉 构建完成！"
echo "📁 文件位置: $(pwd)/dist-exe/AI-Agent-体验台.exe"
echo "🎯 文件大小: $(du -h dist-exe/AI-Agent-体验台.exe | cut -f1)"
echo ""
echo "✅ 使用方法："
echo "1. 复制 dist-exe/AI-Agent-体验台.exe 到Windows"
echo "2. 双击即可运行，无需任何依赖！"
echo "3. 浏览器自动打开 http://localhost:3000"