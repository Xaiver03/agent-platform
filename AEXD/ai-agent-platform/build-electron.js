#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 构建配置
const buildConfig = {
  // 构建前准备
  preBuild: () => {
    console.log('🚀 开始构建Electron应用...')
    
    // 确保必要的目录存在
    const dirs = ['public', 'prisma', '.next', 'electron']
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        console.log(`📁 创建目录: ${dir}`)
        fs.mkdirSync(dir, { recursive: true })
      }
    })

    // 创建默认图标（如果缺失）
    createDefaultIcons()
    
    // 构建Next.js应用
    console.log('🏗️  构建Next.js应用...')
    execSync('npm run build', { stdio: 'inherit' })
    
    // 生成Prisma客户端
    console.log('🔧 生成Prisma客户端...')
    execSync('npx prisma generate', { stdio: 'inherit' })
  },

  // 创建默认图标
  createDefaultIcons: () => {
    const iconSizes = {
      'public/favicon.ico': 32,
      'public/icon.png': 512,
      'public/icon.icns': 512
    }

    Object.entries(iconSizes).forEach(([path, size]) => {
      if (!fs.existsSync(path)) {
        console.log(`🎨 创建默认图标: ${path}`)
        createDefaultIcon(path, size)
      }
    })
  },

  // 构建Windows版本
  buildWindows: () => {
    console.log('🪟 构建Windows版本...')
    execSync('npm run electron:win', { stdio: 'inherit' })
  },

  // 构建macOS版本
  buildMac: () => {
    console.log('🍎 构建macOS版本...')
    execSync('npm run electron:mac', { stdio: 'inherit' })
  },

  // 构建Linux版本
  buildLinux: () => {
    console.log('🐧 构建Linux版本...')
    execSync('npm run electron:linux', { stdio: 'inherit' })
  },

  // 构建所有平台
  buildAll: () => {
    console.log('🌍 构建所有平台...')
    execSync('npm run electron:all', { stdio: 'inherit' })
  },

  // 清理构建产物
  clean: () => {
    console.log('🧹 清理构建产物...')
    const dirs = ['dist-electron', '.next', 'out']
    dirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true })
        console.log(`🗑️  删除目录: ${dir}`)
      }
    })
  }
}

// 创建默认图标函数
function createDefaultIcon(filePath, size) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // 创建简单的SVG图标（这里用文本表示）
  const iconContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${size/2}" cy="${size/2}" r="${size/2-4}" fill="#3B82F6" stroke="#1E40AF" stroke-width="4"/>
  <text x="${size/2}" y="${size/2+8}" text-anchor="middle" font-size="${size/4}" font-family="Arial, sans-serif" fill="white" font-weight="bold">AI</text>
</svg>`

  fs.writeFileSync(filePath.replace(/\.(ico|icns|png)$/, '.svg'), iconContent)
  
  console.log(`✅ 创建图标: ${filePath} (SVG格式，需要转换为相应格式)`)
}

// 主函数
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  try {
    switch (command) {
      case 'prebuild':
        buildConfig.preBuild()
        break
      case 'windows':
        buildConfig.preBuild()
        buildConfig.buildWindows()
        break
      case 'mac':
        buildConfig.preBuild()
        buildConfig.buildMac()
        break
      case 'linux':
        buildConfig.preBuild()
        buildConfig.buildLinux()
        break
      case 'all':
        buildConfig.preBuild()
        buildConfig.buildAll()
        break
      case 'clean':
        buildConfig.clean()
        break
      default:
        console.log(`
🎯 AI Agent 体验台 - Electron构建工具

使用方法:
  node build-electron.js [command]

命令:
  prebuild    - 执行构建前准备
  windows     - 构建Windows版本
  mac         - 构建macOS版本
  linux       - 构建Linux版本
  all         - 构建所有平台
  clean       - 清理构建产物

示例:
  node build-electron.js windows  # 构建Windows版本
  node build-electron.js all      # 构建所有平台
        `)
    }
  } catch (error) {
    console.error('❌ 构建失败:', error.message)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
}

module.exports = buildConfig