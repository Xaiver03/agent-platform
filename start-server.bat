@echo off
chcp 65001 >nul
title AI Agent 体验台启动程序

echo.
echo ===============================================
echo 🤖 AI Agent 体验台启动程序
echo ===============================================
echo.

:: 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未安装 Node.js
    echo 请先安装 Node.js: https://nodejs.org
    pause
    exit /b 1
)

:: 检查项目目录
if not exist package.json (
    echo ❌ 错误：当前目录不是项目根目录
    echo 请确保在 ai-agent-platform 目录下运行
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
echo ✅ 项目目录正确

:: 检查端口
netstat -an | find "3001" >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口 3001 被占用，尝试使用端口 3002
    set PORT=3002
) else (
    set PORT=3001
)

:: 安装依赖
if not exist node_modules (
    echo.
    echo 📦 安装依赖包...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

:: 检查数据库
if not exist prisma\dev.db (
    echo.
    echo 🗄️ 初始化数据库...
    call npx prisma db push
    call npx prisma db seed
)

:: 生成 Prisma 客户端
echo.
echo 🔄 更新 Prisma 客户端...
call npx prisma generate >nul 2>&1

echo.
echo ===============================================
echo 🚀 启动开发服务器...
echo ===============================================
echo 🌐 访问地址:
echo    主页: http://localhost:%PORT%
echo    管理后台: http://localhost:%PORT%/admin/login
echo    管理员账号: admin@example.com / admin123
echo ===============================================
echo 💡 提示: 按 Ctrl+C 停止服务器
echo.

:: 启动服务器
call npm run dev -- --port %PORT%

pause