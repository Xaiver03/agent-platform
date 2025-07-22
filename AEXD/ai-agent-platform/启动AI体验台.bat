@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: AI Agent 体验台启动程序 (Windows 批处理文件)
:: 可以直接双击运行

title AI Agent 体验台启动程序

:: 设置颜色
set "COLOR_INFO=[92m"
set "COLOR_WARN=[93m"
set "COLOR_ERROR=[91m"
set "COLOR_RESET=[0m"

:: 获取脚本所在目录
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

:: 清屏
cls

echo %COLOR_INFO%
echo 🤖 AI Agent 体验台启动程序
echo =================================%COLOR_RESET%
echo %COLOR_INFO%当前目录: %SCRIPT_DIR%%COLOR_RESET%
echo.

:: 检查是否在正确的目录
if not exist "package.json" (
    echo %COLOR_ERROR%❌ 错误：当前目录不是项目根目录%COLOR_RESET%
    echo %COLOR_ERROR%脚本位置：%SCRIPT_DIR%%COLOR_RESET%
    pause
    exit /b 1
)

:: 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo %COLOR_ERROR%❌ 错误：未安装 Node.js%COLOR_RESET%
    echo %COLOR_ERROR%请先安装 Node.js (https://nodejs.org)%COLOR_RESET%
    echo %COLOR_ERROR%安装完成后重新运行此脚本%COLOR_RESET%
    pause
    exit /b 1
)

:: 检查 npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo %COLOR_ERROR%❌ 错误：未安装 npm%COLOR_RESET%
    pause
    exit /b 1
)

:: 显示版本信息
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo %COLOR_INFO%✅ Node.js 版本: %NODE_VERSION%%COLOR_RESET%
echo %COLOR_INFO%✅ npm 版本: %NPM_VERSION%%COLOR_RESET%
echo.

:: 设置默认端口
set "DEFAULT_PORT=3001"
set "PORT=%DEFAULT_PORT%"

:: 检查端口是否被占用
:check_port
echo %COLOR_WARN%检查端口可用性...%COLOR_RESET%

netstat -ano | findstr ":%PORT%" >nul
if %errorlevel%==0 (
    echo %COLOR_WARN%端口 %PORT% 被占用%COLOR_RESET%
    
    :: 查找占用端口的进程
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%"') do (
        echo %COLOR_WARN%停止占用端口 %PORT% 的进程...%COLOR_RESET%
        taskkill /F /PID %%a >nul 2>&1
        timeout /t 2 >nul
    )
    
    :: 再次检查端口
    netstat -ano | findstr ":%PORT%" >nul
    if %errorlevel%==0 (
        :: 寻找可用端口
        for %%p in (3002 3003 3004 3005) do (
            netstat -ano | findstr ":%%p" >nul
            if !errorlevel! neq 0 (
                set "PORT=%%p"
                echo %COLOR_INFO%自动选择端口 %PORT%%COLOR_RESET%
                goto port_found
            )
        )
        echo %COLOR_ERROR%❌ 无法找到可用端口%COLOR_RESET%
        pause
        exit /b 1
    )
)

:port_found
echo %COLOR_INFO%✅ 使用端口: %PORT%%COLOR_RESET%
echo.

:: 检查依赖
if not exist "node_modules" (
    echo %COLOR_WARN%📦 首次运行，安装依赖包...%COLOR_RESET%
    npm install
    if !errorlevel! neq 0 (
        echo %COLOR_ERROR%❌ 依赖安装失败%COLOR_RESET%
        pause
        exit /b 1
    )
    echo %COLOR_INFO%✅ 依赖安装完成%COLOR_RESET%
)

:: 检查数据库
if not exist "prisma\dev.db" (
    echo %COLOR_WARN%🗄️ 首次运行，初始化数据库...%COLOR_RESET%
    npx prisma db push
    npx prisma db seed
    if !errorlevel! neq 0 (
        echo %COLOR_ERROR%❌ 数据库初始化失败%COLOR_RESET%
        pause
        exit /b 1
    )
    echo %COLOR_INFO%✅ 数据库初始化完成%COLOR_RESET%
) else (
    echo %COLOR_INFO%✅ 数据库已存在%COLOR_RESET%
)

:: 生成 Prisma 客户端
echo %COLOR_WARN%🔄 更新 Prisma 客户端...%COLOR_RESET%
npx prisma generate > nul 2>&1

echo.
echo %COLOR_INFO%🚀 启动开发服务器...%COLOR_RESET%
echo %COLOR_INFO%================================%COLOR_RESET%
echo %COLOR_INFO%🌐 服务器启动成功！访问地址:%COLOR_RESET%
echo %COLOR_INFO%   📱 主页: http://localhost:%PORT%%COLOR_RESET%
echo %COLOR_INFO%   ⚙️  管理后台: http://localhost:%PORT%/admin/login%COLOR_RESET%
echo %COLOR_INFO%   👤 管理员账号: admin@example.com%COLOR_RESET%
echo %COLOR_INFO%   🔑 密码: admin123%COLOR_RESET%
echo %COLOR_INFO%================================%COLOR_RESET%
echo %COLOR_WARN%💡 使用提示:%COLOR_RESET%
echo %COLOR_WARN%   • 请在浏览器中打开上述链接%COLOR_RESET%
echo %COLOR_WARN%   • 按 Ctrl+C 可停止服务器%COLOR_RESET%
echo %COLOR_WARN%   • 关闭此窗口也会停止服务器%COLOR_RESET%
echo %COLOR_INFO%================================%COLOR_RESET%
echo.

:: 询问是否自动打开浏览器
set /p OPEN_BROWSER=是否自动在浏览器中打开主页？(y/n): 
if /i "%OPEN_BROWSER%"=="y" (
    start "" "http://localhost:%PORT%"
)

:: 启动服务器
echo.
npm run dev -- --port %PORT%

:: 服务器停止后的提示
echo.
echo %COLOR_WARN%🛑 服务器已停止%COLOR_RESET%
pause