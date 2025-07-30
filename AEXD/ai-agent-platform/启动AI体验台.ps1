# AI Agent 体验台启动程序 (Windows PowerShell)
# 可以直接双击运行

# 设置控制台编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 颜色定义
$colors = @{
    Info = "Green"
    Warn = "Yellow"
    Error = "Red"
    Blue = "Cyan"
}

function Write-ColorMessage {
    param(
        [string]$message,
        [string]$color = "White"
    )
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $message" -ForegroundColor $color
}

function Test-Port {
    param([int]$port)
    try {
        $result = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
        return $result.TcpTestSucceeded
    } catch {
        return $false
    }
}

function Stop-PortProcess {
    param([int]$port)
    Write-ColorMessage "检测到端口 $port 被占用，正在停止相关进程..." $colors.Warn
    
    try {
        $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($processes) {
            foreach ($pid in $processes) {
                try {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    Write-ColorMessage "已停止进程 $pid" $colors.Info
                } catch {
                    Write-ColorMessage "无法停止进程 $pid: $_" $colors.Error
                }
            }
            Start-Sleep -Seconds 2
        }
    } catch {
        Write-ColorMessage "端口检查失败: $_" $colors.Error
    }
}

Clear-Host

Write-ColorMessage "🤖 AI Agent 体验台启动程序" $colors.Blue
Write-ColorMessage "================================" $colors.Blue

# 获取脚本所在目录
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-ColorMessage "当前目录: $scriptDir" $colors.Blue
Write-Host ""

# 检查是否在正确的目录
if (-not (Test-Path "package.json")) {
    Write-ColorMessage "❌ 错误：当前目录不是项目根目录" $colors.Error
    Write-ColorMessage "脚本位置：$scriptDir" $colors.Error
    Read-Host "按任意键退出..."
    exit 1
}

# 检查 Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-ColorMessage "❌ 错误：未安装 Node.js" $colors.Error
    Write-ColorMessage "请先安装 Node.js (https://nodejs.org)" $colors.Error
    Read-Host "按任意键退出..."
    exit 1
}

# 检查 npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-ColorMessage "❌ 错误：未安装 npm" $colors.Error
    Read-Host "按任意键退出..."
    exit 1
}

# 显示版本信息
$nodeVersion = node --version
$npmVersion = npm --version
Write-ColorMessage "✅ Node.js 版本: $nodeVersion" $colors.Info
Write-ColorMessage "✅ npm 版本: $npmVersion" $colors.Info
Write-Host ""

# 设置默认端口
$defaultPort = 3001
$port = $defaultPort

Write-ColorMessage "检查端口可用性..." $colors.Warn

# 检查默认端口
if (Test-Port $port) {
    Write-ColorMessage "端口 $port 被占用" $colors.Warn
    Stop-PortProcess $port
    
    # 再次检查端口
    if (Test-Port $port) {
        # 寻找可用端口
        $availablePorts = @('3002', '3003', '3004', '3005')
        foreach ($p in $availablePorts) {
            if (-not (Test-Port [int]$p)) {
                $port = [int]$p
                Write-ColorMessage "自动选择端口 $port" $colors.Info
                break
            }
        }
        
        if (Test-Port $port) {
            Write-ColorMessage "❌ 无法找到可用端口" $colors.Error
            Read-Host "按任意键退出..."
            exit 1
        }
    }
}

Write-ColorMessage "✅ 使用端口: $port" $colors.Info
Write-Host ""

# 检查依赖
if (-not (Test-Path "node_modules")) {
    Write-ColorMessage "📦 首次运行，安装依赖包..." $colors.Warn
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-ColorMessage "❌ 依赖安装失败" $colors.Error
        Read-Host "按任意键退出..."
        exit 1
    }
    Write-ColorMessage "✅ 依赖安装完成" $colors.Info
}

# 检查数据库
if (-not (Test-Path "prisma\dev.db")) {
    Write-ColorMessage "🗄️ 首次运行，初始化数据库..." $colors.Warn
    npx prisma db push
    npx prisma db seed
    if ($LASTEXITCODE -ne 0) {
        Write-ColorMessage "❌ 数据库初始化失败" $colors.Error
        Read-Host "按任意键退出..."
        exit 1
    }
    Write-ColorMessage "✅ 数据库初始化完成" $colors.Info
} else {
    Write-ColorMessage "✅ 数据库已存在" $colors.Info
}

# 生成 Prisma 客户端
Write-ColorMessage "🔄 更新 Prisma 客户端..." $colors.Warn
npx prisma generate | Out-Null

Write-Host ""
Write-ColorMessage "🚀 启动开发服务器..." $colors.Green
Write-ColorMessage "================================" $colors.Blue
Write-ColorMessage "🌐 服务器启动成功！访问地址:" $colors.Green
Write-ColorMessage "   📱 主页: http://localhost:$port" $colors.Blue
Write-ColorMessage "   ⚙️  管理后台: http://localhost:$port/admin/login" $colors.Blue
Write-ColorMessage "   👤 管理员账号: admin@example.com" $colors.Blue
Write-ColorMessage "   🔑 密码: admin123" $colors.Blue
Write-ColorMessage "================================" $colors.Blue
Write-ColorMessage "💡 使用提示:" $colors.Warn
Write-ColorMessage "   • 请在浏览器中打开上述链接" $colors.Warn
Write-ColorMessage "   • 按 Ctrl+C 可停止服务器" $colors.Warn
Write-ColorMessage "   • 关闭此窗口也会停止服务器" $colors.Warn
Write-ColorMessage "================================" $colors.Blue
Write-Host ""

# 自动打开浏览器
Write-ColorMessage "🌐 正在自动打开浏览器..." $colors.Green
Start-Process "http://localhost:$port"

# 启动服务器
Write-Host ""
npm run dev -- --port $port

# 服务器停止后的提示
Write-Host ""
Write-ColorMessage "🛑 服务器已停止" $colors.Warn
Read-Host "按任意键关闭此窗口..."