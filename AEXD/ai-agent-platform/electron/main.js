const { app, BrowserWindow, ipcMain, shell } = require('electron')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const os = require('os')

let mainWindow
let nextProcess

// 获取用户数据目录（跨平台兼容）
const userDataPath = app.getPath('userData')
const dbPath = path.join(userDataPath, 'ai-agent-platform.db')

// 设置环境变量
process.env.DATABASE_URL = `file:${dbPath}`
process.env.PORT = '0' // 让Next.js自动选择端口

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false // 先隐藏，等页面加载完成后再显示
  })

  // 启动Next.js开发服务器或加载生产构建
  if (process.env.NODE_ENV === 'development') {
    startNextDevServer()
  } else {
    loadProductionBuild()
  }

  // 窗口事件
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // 开发模式下打开开发者工具
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools()
    }
  })

  // 处理外部链接
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // 窗口关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null
    if (nextProcess) {
      nextProcess.kill()
    }
  })
}

function startNextDevServer() {
  console.log('Starting Next.js development server...')
  
  // 启动Next.js开发服务器
  nextProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: process.platform === 'win32'
  })

  // 等待服务器启动
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000')
  }, 5000)
}

function loadProductionBuild() {
  console.log('Loading production build...')
  
  // 启动Next.js生产服务器
  nextProcess = spawn('npm', ['start'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  })

  // 等待服务器启动
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000')
  }, 3000)
}

// 应用事件处理
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 确保在应用退出时清理子进程
app.on('before-quit', () => {
  if (nextProcess) {
    nextProcess.kill()
  }
})

// IPC通信
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('get-user-data-path', () => {
  return userDataPath
})

// 确保数据库目录存在
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true })
}