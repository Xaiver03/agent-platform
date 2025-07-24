
#!/bin/bash
# 简化版本 - 使用Next.js构建

echo "🚀 构建零依赖exe..."

# 1. 安装pkg
npm install --no-save pkg@5.8.1

# 2. 创建简化服务器
node -e "
const fs = require('fs');
const serverCode = `
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '.next', 'static')));

// SPA路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log('\uD83C\uDF10 AI Agent 体验台已启动！');
  console.log('\uD83D\uDD17 访问地址: http://localhost:' + port);
  console.log('\uD83D\uDCA1 按 Ctrl+C 停止服务');
});
`;
fs.writeFileSync('simple-server.js', serverCode);
"

# 3. 构建exe
npx pkg simple-server.js --targets node18-win-x64 --output dist-exe/AI-Agent-体验台.exe

# 4. 复制必要文件
mkdir -p dist-exe/data
cp -r public dist-exe/ 2>/dev/null || true
cp -r .next/static dist-exe/.next/ 2>/dev/null || true

# 5. 创建简化HTML
cat > dist-exe/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
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
        .container { padding: 40px; }
        .title { font-size: 3rem; margin-bottom: 1rem; }
        .subtitle { font-size: 1.5rem; opacity: 0.8; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">🌌 AI Agent 体验台</h1>
        <p class="subtitle">服务已启动！访问 http://localhost:3000</p>
    </div>
</body>
</html>
EOF

echo "✅ 构建完成！"
echo "📁 文件位置: dist-exe/AI-Agent-体验台.exe"
echo "🎯 使用方法: 双击exe即可运行，无需任何依赖！"
