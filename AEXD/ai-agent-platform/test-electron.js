#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 快速测试脚本
console.log('🚀 AI Agent 体验台 - Electron测试脚本')
console.log('=' .repeat(50))

// 检查必要文件
const requiredFiles = [
  'package.json',
  'electron/main.js',
  'electron/preload.js',
  'lib/db.ts',
  'app/page.tsx'
]

console.log('📁 检查必要文件...')
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file)
  console.log(`  ${exists ? '✅' : '❌'} ${file}`)
})

// 检查package.json配置
console.log('\n📋 检查package.json配置...')
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  
  // 检查Electron相关配置
  const hasElectron = !!(pkg.devDependencies && 
                        (pkg.devDependencies.electron || pkg.devDependencies['electron-builder']))
  console.log(`  ${hasElectron ? '✅' : '❌'} Electron依赖已配置`)
  
  const hasBuildConfig = !!pkg.build
  console.log(`  ${hasBuildConfig ? '✅' : '❌'} build配置已设置`)
  
  const hasMain = !!pkg.main
  console.log(`  ${hasMain ? '✅' : '❌'} main入口已指定`)
  
} catch (error) {
  console.log('❌ 无法读取package.json')
}

// 创建测试图标
console.log('\n🎨 创建测试图标...')
const iconDir = 'public'
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true })
}

// 创建简单的favicon.ico文件
const faviconContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="14" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
  <text x="16" y="20" text-anchor="middle" font-size="12" font-family="Arial, sans-serif" fill="white" font-weight="bold">AI</text>
</svg>`

fs.writeFileSync('public/favicon.ico.svg', faviconContent)
console.log('  ✅ 测试图标已创建: public/favicon.ico.svg')

// 检查Node.js版本
console.log('\n🔧 检查环境...')
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim()
  console.log(`  ✅ Node.js版本: ${nodeVersion}`)
  
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim()
  console.log(`  ✅ npm版本: ${npmVersion}`)
  
} catch (error) {
  console.log('❌ 无法获取Node.js/npm版本')
}

// 显示可用的构建命令
console.log('\n📋 可用的构建命令:')
console.log('  npm run electron:dev      # 开发模式')
console.log('  npm run electron:build    # 构建生产版本')
console.log('  npm run electron:win      # 构建Windows版本')
console.log('  npm run electron:mac      # 构建macOS版本')
console.log('  npm run electron:linux    # 构建Linux版本')
console.log('  npm run electron:all      # 构建所有平台')

// 显示下一步操作
console.log('\n🎯 下一步操作:')
console.log('1. 安装依赖: npm install')
console.log('2. 构建应用: npm run build')
console.log('3. 生成Prisma: npx prisma generate')
console.log('4. 构建Windows: npm run electron:win')
console.log('5. 测试安装包: 在dist-electron目录中找到安装文件')

console.log('\n🎉 测试完成！配置已就绪。')