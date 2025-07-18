#!/bin/bash

# AI Agent 体验台启动脚本
# Author: Claude Code Assistant
# Date: 2025-07-18

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数：打印带颜色的消息
print_message() {
    echo -e "${2}[$(date '+%H:%M:%S')] $1${NC}"
}

# 函数：检查端口是否被占用
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null 2>&1; then
        return 0  # 端口被占用
    else
        return 1  # 端口空闲
    fi
}

# 函数：停止占用端口的进程
kill_port() {
    local port=$1
    print_message "检测到端口 $port 被占用，正在停止相关进程..." $YELLOW
    
    # 查找并终止占用端口的进程
    local pids=$(lsof -ti :$port)
    if [ ! -z "$pids" ]; then
        echo $pids | xargs kill -9 2>/dev/null
        sleep 2
        print_message "已停止端口 $port 上的进程" $GREEN
    fi
}

# 清屏
clear

print_message "🤖 AI Agent 体验台启动程序" $BLUE
print_message "================================" $BLUE

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    print_message "❌ 错误：当前目录不是项目根目录" $RED
    print_message "请确保在 ai-agent-platform 目录下运行此脚本" $RED
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    print_message "❌ 错误：未安装 Node.js" $RED
    print_message "请先安装 Node.js (https://nodejs.org)" $RED
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    print_message "❌ 错误：未安装 npm" $RED
    exit 1
fi

print_message "✅ Node.js 版本: $(node --version)" $GREEN
print_message "✅ npm 版本: $(npm --version)" $GREEN

# 选择端口
DEFAULT_PORT=3001
PORT=$DEFAULT_PORT

print_message "检查端口可用性..." $YELLOW

# 检查默认端口
if check_port $PORT; then
    print_message "端口 $PORT 被占用" $YELLOW
    
    # 尝试自动释放端口
    read -p "是否自动停止占用端口 $PORT 的进程？(y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill_port $PORT
    else
        # 寻找可用端口
        for p in 3002 3003 3004 3005; do
            if ! check_port $p; then
                PORT=$p
                print_message "自动选择端口 $PORT" $GREEN
                break
            fi
        done
        
        if check_port $PORT; then
            print_message "❌ 无法找到可用端口" $RED
            exit 1
        fi
    fi
fi

print_message "✅ 使用端口: $PORT" $GREEN

# 检查依赖
if [ ! -d "node_modules" ]; then
    print_message "📦 安装依赖包..." $YELLOW
    npm install
    if [ $? -ne 0 ]; then
        print_message "❌ 依赖安装失败" $RED
        exit 1
    fi
    print_message "✅ 依赖安装完成" $GREEN
fi

# 检查数据库
if [ ! -f "prisma/dev.db" ]; then
    print_message "🗄️ 初始化数据库..." $YELLOW
    npx prisma db push
    npx prisma db seed
    if [ $? -ne 0 ]; then
        print_message "❌ 数据库初始化失败" $RED
        exit 1
    fi
    print_message "✅ 数据库初始化完成" $GREEN
else
    print_message "✅ 数据库已存在" $GREEN
fi

# 生成 Prisma 客户端
print_message "🔄 更新 Prisma 客户端..." $YELLOW
npx prisma generate > /dev/null 2>&1

print_message "🚀 启动开发服务器..." $GREEN
print_message "================================" $BLUE
print_message "🌐 访问地址:" $BLUE
print_message "   主页: http://localhost:$PORT" $BLUE
print_message "   管理后台: http://localhost:$PORT/admin/login" $BLUE
print_message "   管理员账号: admin@example.com / admin123" $BLUE
print_message "================================" $BLUE
print_message "💡 提示: 按 Ctrl+C 停止服务器" $YELLOW
print_message "" $NC

# 启动服务器
npm run dev -- --port $PORT