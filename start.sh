#!/bin/bash

echo "🚀 启动 AI Agent 体验台..."
echo "================================"

# 检查当前目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查npm环境
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 显示环境信息
echo "📋 检查环境..."
echo "Node版本: $(node --version)"
echo "NPM版本: $(npm --version)"

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装成功"
else
    echo "✅ 依赖已存在"
fi

# 检查环境变量文件
if [ ! -f ".env.local" ]; then
    echo "⚙️  创建环境变量文件..."
    cp .env.example .env.local 2>/dev/null || echo "⚠️  请手动创建 .env.local 文件"
fi

# 启动开发服务器
echo "🎯 启动开发服务器..."
echo "📱 项目将在 http://localhost:3000 启动"
echo "================================"

npm run dev