#!/bin/bash

# 快速重启脚本
echo "🔄 重启 AI Agent 体验台..."

# 停止所有 Next.js 进程
echo "停止现有服务器..."
pkill -f "next dev" 2>/dev/null || true

# 停止占用 3001 端口的进程
if lsof -i :3001 > /dev/null 2>&1; then
    echo "释放端口 3001..."
    lsof -ti :3001 | xargs kill -9 2>/dev/null || true
fi

# 等待进程完全停止
sleep 2

# 重新启动
echo "重新启动服务器..."
./start-server.sh