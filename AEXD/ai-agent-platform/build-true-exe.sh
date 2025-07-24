
#!/bin/bash
echo "🚀 构建真正的零依赖exe..."

# 安装pkg
npm install --no-save pkg

# 构建exe
npx pkg standalone-server.js --targets node18-win-x64 --output dist-exe/AI-Agent-体验台.exe

echo "✅ 构建完成！"
echo "📁 文件位置: dist-exe/AI-Agent-体验台.exe"
echo "🎯 使用方法: 双击即可运行，无需任何依赖！"
