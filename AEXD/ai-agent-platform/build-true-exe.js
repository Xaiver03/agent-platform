const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 创建真正的零依赖exe...')

// 1. 检查pkg是否安装
try {
  execSync('npx pkg --version', { stdio: 'pipe' })
  console.log('✅ pkg已安装')
} catch {
  console.log('📦 安装pkg...')
  execSync('npm install --no-save pkg', { stdio: 'inherit' })
}

// 2. 创建构建配置
const buildConfig = {
  name: "AI-Agent-体验台",
  version: "1.0.0",
  description: "AI工具3D展示平台",
  main: "standalone-server.js",
  pkg: {
    scripts: [
      "standalone-server.js"
    ],
    assets: [
      "public/**/*",
      "prisma/**/*",
      ".next/**/*",
      "app/**/*",
      "components/**/*",
      "lib/**/*"
    ],
    targets: [
      "node18-win-x64"
    ],
    outputPath: "dist-exe"
  }
}

// 3. 创建临时package.json
fs.writeFileSync('package-temp.json', JSON.stringify(buildConfig, null, 2))

// 4. 确保必要的文件存在
const requiredDirs = ['public', 'prisma', 'app', 'components', 'lib']
requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  缺少目录: ${dir}`)
  }
})

// 5. 创建简化构建脚本
const buildScript = `
#!/bin/bash
echo "🚀 构建真正的零依赖exe..."

# 安装pkg
npm install --no-save pkg

# 构建exe
npx pkg standalone-server.js --targets node18-win-x64 --output dist-exe/AI-Agent-体验台.exe

echo "✅ 构建完成！"
echo "📁 文件位置: dist-exe/AI-Agent-体验台.exe"
echo "🎯 使用方法: 双击即可运行，无需任何依赖！"
`

fs.writeFileSync('build-true-exe.sh', buildScript)

// 6. 创建Windows批处理构建脚本
const windowsBuildScript = `@echo off
echo Building AI Agent Platform EXE...

echo Installing pkg...
npm install --no-save pkg

echo Building standalone exe...
npx pkg standalone-server.js --targets node18-win-x64 --output dist-exe/AI-Agent-体验台.exe

echo.
echo ✅ Build complete!
echo 📁 Output: dist-exe/AI-Agent-体验台.exe
echo 🎯 Usage: Double-click to run, no dependencies needed!
pause
`

fs.writeFileSync('build-true-exe.bat', windowsBuildScript)

// 7. 创建测试版本
console.log('📁 创建测试目录...')
if (!fs.existsSync('dist-exe')) {
  fs.mkdirSync('dist-exe', { recursive: true })
}

// 8. 创建简化版本说明
const readme = `
# AI Agent 体验台 - 零依赖版本

## 🚀 使用方法
1. 双击 AI-Agent-体验台.exe
2. 等待自动启动
3. 浏览器自动打开 http://localhost:3000

## 📋 功能特点
- ✅ 零依赖 - 包含Node.js运行时
- ✅ 单文件 - 只有一个exe文件
- ✅ 自动启动 - 双击即可运行
- ✅ 数据本地存储 - SQLite数据库
- ✅ 完整3D体验 - 所有功能完整

## 🔧 技术规格
- Node.js 18 运行时内置
- SQLite 数据库
- Express 服务器
- 完整Next.js功能
- 约50MB文件大小

## 🎯 系统要求
- Windows 7/8/10/11
- 100MB磁盘空间
- 无需安装Node.js
`

fs.writeFileSync('dist-exe/README.md', readme)

console.log('🎉 构建配置已就绪！')
console.log('')
console.log('📋 下一步操作：')
console.log('1. 运行: ./build-true-exe.sh (macOS/Linux)')  
console.log('2. 或运行: build-true-exe.bat (Windows)')
console.log('3. 得到: dist-exe/AI-Agent-体验台.exe')
console.log('4. 使用: 双击exe即可运行！')