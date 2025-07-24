#!/usr/bin/env node

const express = require('express')
const path = require('path')
const fs = require('fs')
const { PrismaClient } = require('@prisma/client')
const cors = require('cors')
const serveStatic = require('serve-static')

const app = express()
const port = process.env.PORT || 3000

// 确保数据库目录存在
const getDatabasePath = () => {
  const isPkg = typeof process.pkg !== 'undefined'
  let basePath
  
  if (isPkg) {
    // 打包后路径
    basePath = path.dirname(process.execPath)
  } else {
    // 开发路径
    basePath = __dirname
  }
  
  const dbPath = path.join(basePath, 'data', 'ai-agent-platform.db')
  const dbDir = path.dirname(dbPath)
  
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
  
  return dbPath
}

// 初始化数据库
const initDatabase = () => {
  const dbPath = getDatabasePath()
  const dbUrl = `file:${dbPath}`
  
  // 创建Prisma客户端
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl
      }
    }
  })
  
  return prisma
}

// 初始化数据库
const prisma = initDatabase()

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 静态文件服务
const staticPath = path.join(__dirname, 'public')
if (fs.existsSync(staticPath)) {
  app.use(serveStatic(staticPath))
}

// 构建文件服务
const buildPath = path.join(__dirname, '.next', 'standalone')
if (fs.existsSync(buildPath)) {
  app.use(serveStatic(buildPath))
}

// API路由
app.get('/api/agents', async (req, res) => {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: [
        { enabled: 'desc' },
        { clickCount: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    res.json(agents)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/agents/:id', async (req, res) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id: req.params.id }
    })
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }
    res.json(agent)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/agents/:id/click', async (req, res) => {
  try {
    const agent = await prisma.agent.update({
      where: { id: req.params.id },
      data: { clickCount: { increment: 1 } }
    })
    res.json(agent)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// SPA路由处理
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.send(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AI Agent 体验台</title>
          <style>
              body { 
                  margin: 0; 
                  padding: 0; 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                  color: white;
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
              }
              .container {
                  max-width: 600px;
                  padding: 40px;
              }
              .title {
                  font-size: 2.5rem;
                  margin-bottom: 1rem;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
              }
              .status {
                  font-size: 1.2rem;
                  margin-bottom: 2rem;
                  opacity: 0.8;
              }
              .info {
                  background: rgba(255, 255, 255, 0.1);
                  border-radius: 10px;
                  padding: 20px;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1 class="title">🌌 AI Agent 体验台</h1>
              <p class="status">服务已启动并运行！</p>
              <div class="info">
                  <h3>📋 使用说明：</h3>
                  <ul style="text-align: left;">
                      <li>浏览器访问：http://localhost:${port}</li>
                      <li>3D银河系界面：完整交互体验</li>
                      <li>AI工具展示：行星化展示</li>
                      <li>管理后台：http://localhost:${port}/admin</li>
                  </ul>
              </div>
          </div>
      </body>
      </html>
    `)
  }
})

// 启动服务器
app.listen(port, () => {
  console.log(`🚀 AI Agent 体验台已启动！`)
  console.log(`🌐 访问地址: http://localhost:${port}`)
  console.log(`⚙️  管理后台: http://localhost:${port}/admin`)
  console.log(`💡 按 Ctrl+C 停止服务`)
  
  // 自动打开浏览器
  const { exec } = require('child_process')
  setTimeout(() => {
    const url = `http://localhost:${port}`
    const command = process.platform === 'win32' ? `start ${url}` : 
                   process.platform === 'darwin' ? `open ${url}` : 
                   `xdg-open ${url}`
    exec(command, (error) => {
      if (error) {
        console.log(`请手动访问: ${url}`)
      }
    })
  }, 2000)
})

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n🛑 正在关闭服务器...')
  await prisma.$disconnect()
  process.exit(0)
})