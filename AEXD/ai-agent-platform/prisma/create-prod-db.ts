import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

// 使用特定的生产数据库文件
const DATABASE_PATH = path.join(__dirname, 'prod.db')

// 确保数据库文件存在
if (!fs.existsSync(DATABASE_PATH)) {
  console.log(`Creating new database file at ${DATABASE_PATH}`)
  fs.writeFileSync(DATABASE_PATH, '')
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${DATABASE_PATH}`
    }
  },
  log: ['query', 'info', 'warn', 'error'],
})

async function createProductionDatabase() {
  console.log('🚀 Starting production database creation...')
  console.log(`📂 Database path: ${DATABASE_PATH}`)
  
  try {
    // 1. 推送schema到数据库
    console.log('\n📋 Pushing schema to database...')
    const { execSync } = require('child_process')
    execSync(`npx prisma db push`, {
      env: {
        ...process.env,
        DATABASE_URL: `file:${DATABASE_PATH}`
      },
      stdio: 'inherit'
    })
    
    // 2. 清空所有表（按照正确的顺序）
    console.log('\n🧹 Cleaning existing data...')
    
    const tables = [
      'agentFeedback',
      'agentApplication', 
      'agent',
      'admin',
      'feedbackConfig',
      'feedbackButton',
      'starMagnitudeConfig',
      'danmakuConfig'
    ]
    
    for (const table of tables) {
      try {
        await (prisma as any)[table].deleteMany()
        console.log(`✅ Cleared table: ${table}`)
      } catch (error: any) {
        if (error.code === 'P2021') {
          console.log(`⏭️  Table ${table} does not exist, skipping...`)
        } else {
          console.error(`❌ Error clearing ${table}:`, error.message)
        }
      }
    }
    
    // 3. 创建管理员账号
    console.log('\n👤 Creating admin account...')
    const hashedPassword = await bcrypt.hash('miracleplus666,.', 10)
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: '超级管理员',
        role: 'super_admin',
        canChangePassword: true,
        canManageAdmins: true
      }
    })
    console.log('✅ Admin created:', admin.email)
    
    // 4. 创建反馈配置
    console.log('\n⚙️  Creating feedback config...')
    await prisma.feedbackConfig.create({
      data: {
        productFeedbackUrl: 'https://docs.google.com/forms/d/e/example/viewform',
        platformFeedbackUrl: 'https://docs.google.com/forms/d/e/example2/viewform'
      }
    })
    console.log('✅ Feedback config created')
    
    // 5. 创建反馈按钮
    console.log('\n🔘 Creating feedback buttons...')
    await prisma.feedbackButton.createMany({
      data: [
        {
          title: 'AI产品反馈',
          description: '对具体AI工具的使用反馈',
          url: 'https://docs.google.com/forms/d/e/example/viewform',
          qrCodeImage: null,
          icon: 'message',
          color: '#1890ff',
          order: 1,
          enabled: true
        },
        {
          title: '平台体验反馈',
          description: '对体验台平台的建议',
          url: 'https://docs.google.com/forms/d/e/example2/viewform',
          qrCodeImage: null,
          icon: 'form',
          color: '#52c41a',
          order: 2,
          enabled: true
        }
      ]
    })
    console.log('✅ Feedback buttons created')
    
    // 6. 创建星等配置
    console.log('\n⭐ Creating star magnitude config...')
    await prisma.starMagnitudeConfig.createMany({
      data: [
        {
          magnitude: 1,
          minClicks: 1000,
          maxClicks: null,
          size: 8,
          brightness: 1.0,
          glow: 20,
          color: '#FF0080',
          label: '超亮星',
          description: '最受欢迎的明星，点击1000+',
          orderIndex: 1
        },
        {
          magnitude: 2,
          minClicks: 500,
          maxClicks: 999,
          size: 6,
          brightness: 0.9,
          glow: 16,
          color: '#00FFFF',
          label: '一等星',
          description: '非常受欢迎的星星，点击500-999',
          orderIndex: 2
        },
        {
          magnitude: 3,
          minClicks: 200,
          maxClicks: 499,
          size: 5,
          brightness: 0.8,
          glow: 12,
          color: '#FFD700',
          label: '二等星',
          description: '受欢迎的星星，点击200-499',
          orderIndex: 3
        },
        {
          magnitude: 4,
          minClicks: 100,
          maxClicks: 199,
          size: 4,
          brightness: 0.7,
          glow: 10,
          color: '#FF4500',
          label: '三等星',
          description: '中等亮度星星，点击100-199',
          orderIndex: 4
        },
        {
          magnitude: 5,
          minClicks: 50,
          maxClicks: 99,
          size: 3.5,
          brightness: 0.6,
          glow: 8,
          color: '#9370DB',
          label: '四等星',
          description: '普通亮度星星，点击50-99',
          orderIndex: 5
        },
        {
          magnitude: 6,
          minClicks: 20,
          maxClicks: 49,
          size: 3,
          brightness: 0.5,
          glow: 6,
          color: '#32CD32',
          label: '五等星',
          description: '较暗星星，点击20-49',
          orderIndex: 6
        },
        {
          magnitude: 7,
          minClicks: 0,
          maxClicks: 19,
          size: 2.5,
          brightness: 0.4,
          glow: 4,
          color: '#87CEEB',
          label: '暗星',
          description: '最暗的星星，点击0-19',
          orderIndex: 7
        }
      ]
    })
    console.log('✅ Star magnitude config created')
    
    // 7. 创建所有Agent数据
    console.log('\n🤖 Creating agents...')
    const agents = [
      {
        name: 'Claude Code',
        description: '用于代码生成、调试、数据处理任务，支持多轮交互',
        tags: '编程开发,代码调试,智能助手',
        manager: '张三',
        guideUrl: '/guides/claude-code',
        homepage: 'https://claude.ai',
        icon: '🤖',
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
        guideContent: '# Claude Code 使用指南\n\n## 📖 简介\n\nClaude Code 是 Anthropic 开发的 AI 编程助手，专门为代码生成、调试和数据处理任务设计。\n\n## 🚀 主要功能\n\n### 1. 代码生成\n- 支持多种编程语言\n- 可以根据自然语言描述生成代码\n- 提供代码优化建议\n\n### 2. 调试协助\n- 识别代码错误\n- 提供修复建议\n- 解释错误原因\n\n### 3. 数据处理\n- 数据清洗脚本生成\n- 数据分析代码\n- 可视化图表代码\n\n## 💡 使用技巧\n\n1. **明确描述需求**：详细描述你想要实现的功能\n2. **提供上下文**：分享相关的代码片段或项目背景\n3. **迭代改进**：根据输出结果进行进一步的优化请求',
        enabled: true,
        clickCount: 0,
        themeColor: '#8B7EC8'
      },
      {
        name: 'ChatGPT Plus',
        description: '通用AI助手，支持文本生成、问答、创作等多种任务',
        tags: '智能助手,文本创作,知识问答',
        manager: '李四',
        guideUrl: '/guides/chatgpt',
        homepage: 'https://chat.openai.com',
        icon: '💬',
        coverImage: 'https://images.unsplash.com/photo-1684785627128-58b4bd00450d?w=400&h=200&fit=crop',
        guideContent: '# ChatGPT Plus 使用指南\n\n## 📖 简介\n\nChatGPT Plus 是 OpenAI 的高级版本 AI 助手，提供更快的响应速度和优先访问新功能。\n\n## 🚀 主要功能\n\n### 1. 文本生成\n- 文章写作\n- 创意写作\n- 技术文档\n\n### 2. 问答系统\n- 知识问答\n- 学习辅导\n- 专业咨询\n\n### 3. 代码协助\n- 代码编写\n- 错误调试\n- 算法解释',
        enabled: true,
        clickCount: 0,
        themeColor: '#74AA9C'
      },
      {
        name: 'Midjourney',
        description: 'AI图像生成工具，创建高质量的艺术作品和设计',
        tags: '图像生成,视觉设计,数字艺术',
        manager: '王五',
        guideUrl: '/guides/midjourney',
        homepage: 'https://midjourney.com',
        icon: '🎨',
        coverImage: 'https://images.unsplash.com/photo-1688496019313-d4dc472fa5c4?w=400&h=200&fit=crop',
        guideContent: '# Midjourney 使用指南\n\n## 📖 简介\n\nMidjourney 是领先的 AI 图像生成工具，能够根据文本描述创建高质量的艺术作品。\n\n## 🎨 创作流程\n\n1. 在 Discord 中使用 /imagine 命令\n2. 输入详细的图像描述\n3. 等待 AI 生成初始图像\n4. 使用 U 按钮放大或 V 按钮创建变体\n\n## 🔧 参数设置\n\n- --ar 16:9：设置宽高比\n- --v 5：选择模型版本\n- --stylize：调整风格化程度',
        enabled: true,
        clickCount: 0,
        themeColor: '#FFB347'
      },
      {
        name: 'Cursor IDE',
        description: 'AI驱动的代码编辑器，提供智能补全和代码生成',
        tags: '编程开发,集成环境,代码补全',
        manager: '赵六',
        guideUrl: '/guides/cursor',
        homepage: 'https://cursor.sh',
        icon: '⚡',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
        guideContent: '# Cursor IDE 使用指南\n\n## 📖 简介\n\nCursor 是一款 AI 驱动的代码编辑器，提供智能代码补全和生成功能。\n\n## ⚡ 核心功能\n\n### 1. AI 代码补全\n- 实时代码建议\n- 上下文感知补全\n- 多语言支持\n\n### 2. 代码生成\n- Ctrl+K 快速生成\n- 自然语言转代码\n- 重构建议\n\n## 🎯 最佳实践\n\n- 编写清晰的注释\n- 使用有意义的变量名\n- 保持代码结构清晰',
        enabled: true,
        clickCount: 0,
        themeColor: '#FF6B6B'
      },
      {
        name: 'Perplexity AI',
        description: 'AI搜索引擎，提供准确的信息检索和答案生成',
        tags: '智能搜索,学术研究,信息检索',
        manager: '钱七',
        guideUrl: '/guides/perplexity',
        homepage: 'https://perplexity.ai',
        icon: '🔍',
        coverImage: 'https://images.unsplash.com/photo-1677442135136-760c813028c0?w=400&h=200&fit=crop',
        guideContent: '# Perplexity AI 使用指南\n\n## 📖 简介\n\nPerplexity AI 是新一代 AI 搜索引擎，结合传统搜索和 AI 对话能力。\n\n## 🔍 搜索功能\n\n- 自然语言查询\n- 实时信息获取\n- 引用来源显示\n\n## 📊 使用场景\n\n- 研究资料收集\n- 事实核查\n- 学习新知识',
        enabled: true,
        clickCount: 0,
        themeColor: '#4ECDC4'
      },
      {
        name: 'Notion AI',
        description: '集成在Notion中的AI助手，帮助写作、总结和头脑风暴',
        tags: '文档写作,笔记管理,知识库',
        manager: '孙八',
        guideUrl: '/guides/notion-ai',
        homepage: 'https://notion.so',
        icon: '📝',
        coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop',
        guideContent: '# Notion AI 使用指南\n\n## 📖 简介\n\nNotion AI 集成在 Notion 工作空间中的 AI 助手，提供写作、总结、翻译等功能。\n\n## ✨ 主要功能\n\n### 1. 写作协助\n- 内容生成\n- 语法检查\n- 风格调整\n\n### 2. 总结提炼\n- 长文总结\n- 要点提取\n- 会议纪要\n\n### 3. 头脑风暴\n- 创意生成\n- 项目规划\n- 问题解决',
        enabled: true,
        clickCount: 0,
        themeColor: '#000000'
      },
      {
        name: 'GitHub Copilot',
        description: 'AI代码助手，提供实时代码补全和生成建议',
        tags: '编程开发,代码补全,智能助手',
        manager: '周九',
        guideUrl: '/guides/github-copilot',
        homepage: 'https://github.com/features/copilot',
        icon: '🐙',
        coverImage: 'https://images.unsplash.com/photo-1618477462146-58cb5bfcc7ce?w=400&h=200&fit=crop',
        guideContent: '# GitHub Copilot 使用指南\n\n## 📖 简介\n\nGitHub Copilot 是微软和 OpenAI 合作开发的 AI 代码助手。\n\n## 🚀 主要功能\n\n- 实时代码补全\n- 函数生成\n- 测试用例编写\n- 代码重构建议',
        enabled: true,
        clickCount: 0,
        themeColor: '#24292E'
      },
      {
        name: 'DALL-E 3',
        description: 'OpenAI的最新图像生成模型，创造力和准确性并重',
        tags: '图像生成,视觉设计,创意工具',
        manager: '吴十',
        guideUrl: '/guides/dalle3',
        homepage: 'https://openai.com/dall-e-3',
        icon: '🎭',
        coverImage: 'https://images.unsplash.com/photo-1686191128669-e73e1c4b7aad?w=400&h=200&fit=crop',
        guideContent: '# DALL-E 3 使用指南\n\n## 📖 简介\n\nDALL-E 3 是 OpenAI 最新的图像生成模型，具有卓越的创造力。\n\n## 🎨 特色功能\n\n- 高质量图像生成\n- 精确的文本理解\n- 风格多样化\n- 安全过滤机制',
        enabled: true,
        clickCount: 0,
        themeColor: '#10A37F'
      },
      {
        name: 'DeepL Translator',
        description: '基于AI的高质量翻译工具，支持多语言互译',
        tags: '语言翻译,多语言,国际化',
        manager: '郑十一',
        guideUrl: '/guides/deepl',
        homepage: 'https://deepl.com',
        icon: '🌍',
        coverImage: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=400&h=200&fit=crop',
        guideContent: '# DeepL Translator 使用指南\n\n## 📖 简介\n\nDeepL 是基于神经网络的翻译服务，提供高质量的多语言翻译。\n\n## 🌍 主要功能\n\n- 准确的文本翻译\n- 文档翻译\n- 实时翻译\n- 多种语言支持',
        enabled: true,
        clickCount: 0,
        themeColor: '#0F2B46'
      },
      {
        name: 'Stable Diffusion',
        description: '开源的AI图像生成模型，支持本地部署和自定义训练',
        tags: '图像生成,开源工具,本地部署',
        manager: '王十二',
        guideUrl: '/guides/stable-diffusion',
        homepage: 'https://stability.ai',
        icon: '🌈',
        coverImage: 'https://images.unsplash.com/photo-1686191128782-cf8f2b1be19b?w=400&h=200&fit=crop',
        guideContent: '# Stable Diffusion 使用指南\n\n## 📖 简介\n\nStable Diffusion 是开源的 AI 图像生成模型，可以本地部署。\n\n## 🎨 核心优势\n\n- 完全开源\n- 本地部署\n- 可自定义训练\n- 社区支持丰富',
        enabled: true,
        clickCount: 0,
        themeColor: '#8E2DE2'
      },
      {
        name: 'Jasper AI',
        description: 'AI内容创作平台，专注营销文案和商业内容生成',
        tags: '内容营销,商业写作,品牌推广',
        manager: '李十三',
        guideUrl: '/guides/jasper',
        homepage: 'https://jasper.ai',
        icon: '📈',
        coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop',
        guideContent: '# Jasper AI 使用指南\n\n## 📖 简介\n\nJasper AI 是专业的 AI 内容创作平台，专注于营销和商业写作。\n\n## 📝 主要功能\n\n- 营销文案生成\n- 博客文章创作\n- 社交媒体内容\n- 邮件营销文案',
        enabled: true,
        clickCount: 0,
        themeColor: '#FF4785'
      },
      {
        name: 'Runway Gen-3',
        description: '专业AI视频生成和编辑平台，支持文本到视频、图像动画化、视频风格转换等创新功能',
        tags: '视频生成,视频编辑,动画制作',
        manager: '陈十四',
        guideUrl: '/guides/runway',
        homepage: 'https://runwayml.com',
        icon: '🎬',
        coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=200&fit=crop',
        guideContent: '# Runway Gen-3 使用指南\n\n## 📖 简介\n\nRunway Gen-3 是领先的AI视频创作平台，为创意专业人士提供突破性的视频生成和编辑工具。',
        enabled: true,
        clickCount: 0,
        themeColor: '#FF00FF'
      },
      {
        name: 'Anthropic Claude Pro',
        description: 'Claude AI的专业版本，提供5倍更多使用量、优先访问新功能、更快响应速度',
        tags: '智能助手,对话分析,文本创作',
        manager: '林十五',
        guideUrl: '/guides/claude-pro',
        homepage: 'https://claude.ai/subscription',
        icon: '🎓',
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        guideContent: '# Claude Pro 使用指南\n\n## 📖 简介\n\nClaude Pro 是 Anthropic 提供的高级订阅服务，为专业用户提供更强大的AI能力和更好的使用体验。',
        enabled: true,
        clickCount: 0,
        themeColor: '#8B7EC8'
      },
      {
        name: 'Bing Chat Enterprise',
        description: '微软企业级AI聊天助手，集成必应搜索、支持多模态交互、提供商业数据保护',
        tags: '企业搜索,智能对话,多模态交互',
        manager: '黄十六',
        guideUrl: '/guides/bing-chat',
        homepage: 'https://www.microsoft.com/en-us/edge/features/bing-chat',
        icon: '🔎',
        coverImage: 'https://images.unsplash.com/photo-1633114127451-558041183c08?w=800&h=400&fit=crop',
        guideContent: '# Bing Chat Enterprise 使用指南\n\n## 📖 简介\n\nBing Chat Enterprise 是微软为企业用户打造的安全AI助手，结合了GPT-4的能力与必应搜索。',
        enabled: true,
        clickCount: 0,
        themeColor: '#00BCF2'
      },
      {
        name: 'Cohere Command R+',
        description: '企业级大语言模型，专注于检索增强生成(RAG)、多语言支持和工具调用，性价比极高',
        tags: '大语言模型,检索增强,企业服务',
        manager: '张十七',
        guideUrl: '/guides/cohere',
        homepage: 'https://cohere.com',
        icon: '🌐',
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        guideContent: '# Cohere Command R+ 使用指南\n\n## 📖 简介\n\nCohere Command R+ 是专为企业级应用设计的大语言模型，在检索增强生成(RAG)和工具使用方面表现卓越。',
        enabled: true,
        clickCount: 0,
        themeColor: '#FF6C37'
      },
      {
        name: 'Whisper AI',
        description: 'OpenAI的开源语音识别模型，支持99种语言转录、实时翻译、说话人分离，准确率接近人类水平',
        tags: '语音识别,语音转录,语言翻译',
        manager: '刘十八',
        guideUrl: '/guides/whisper',
        homepage: 'https://openai.com/research/whisper',
        icon: '🎙️',
        coverImage: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&h=400&fit=crop',
        guideContent: '# Whisper AI 使用指南\n\n## 📖 简介\n\nWhisper 是 OpenAI 开源的自动语音识别(ASR)系统，通过68万小时多语言数据训练，达到接近人类的转录准确率。',
        enabled: true,
        clickCount: 0,
        themeColor: '#10A37F'
      },
      {
        name: 'Copilot for Microsoft 365',
        description: 'Microsoft 365全套办公软件的AI助手，深度集成Word、Excel、PowerPoint、Outlook等应用',
        tags: '办公套件,生产力工具,文档处理',
        manager: '王十九',
        guideUrl: '/guides/copilot-365',
        homepage: 'https://www.microsoft.com/microsoft-365/copilot',
        icon: '📊',
        coverImage: 'https://images.unsplash.com/photo-1633114127451-558041183c08?w=800&h=400&fit=crop',
        guideContent: '# Copilot for Microsoft 365 使用指南\n\n## 📖 简介\n\nCopilot for Microsoft 365 将大语言模型的能力与您的工作数据结合，在您最常用的办公应用中提供智能协助。',
        enabled: true,
        clickCount: 0,
        themeColor: '#0078D4'
      },
      {
        name: 'Adobe Firefly',
        description: 'Adobe的创意AI套件，专注商业安全的图像生成、编辑和设计，深度集成Creative Cloud',
        tags: '图像生成,创意设计,商业授权',
        manager: '李二十',
        guideUrl: '/guides/firefly',
        homepage: 'https://www.adobe.com/products/firefly.html',
        icon: '🔥',
        coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop',
        guideContent: '# Adobe Firefly 使用指南\n\n## 📖 简介\n\nAdobe Firefly 是专为创意专业人士设计的生成式AI，确保商业使用安全，与Creative Cloud深度集成。',
        enabled: true,
        clickCount: 0,
        themeColor: '#FF0000'
      },
      {
        name: 'Claude 3.5',
        description: 'Anthropic最新的AI模型，在代码生成、数学推理、视觉理解方面表现卓越，支持200K上下文窗口',
        tags: '智能助手,编程开发,逻辑推理',
        manager: '王十二',
        guideUrl: '/guides/claude-3.5',
        homepage: 'https://claude.ai',
        icon: '🧠',
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        guideContent: '# Claude 3.5 使用指南\n\n## 📖 简介\n\nClaude 3.5 Sonnet 是 Anthropic 的最新旗舰模型，在多项基准测试中超越GPT-4，特别在代码生成和推理能力方面表现突出。',
        enabled: true,
        clickCount: 0,
        themeColor: '#8B7EC8'
      },
      {
        name: 'Gemini Ultra',
        description: 'Google最强大的AI模型，多模态理解能力出众，支持100万token超长上下文，原生支持代码执行',
        tags: '多模态AI,长文本处理,代码执行',
        manager: '孙八',
        guideUrl: '/guides/gemini',
        homepage: 'https://gemini.google.com',
        icon: '💎',
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        guideContent: '# Gemini Ultra 使用指南\n\n## 📖 简介\n\nGemini Ultra 是 Google 推出的最强大多模态AI模型，在多项基准测试中达到最先进水平，特别是在推理和多模态理解方面。',
        enabled: true,
        clickCount: 0,
        themeColor: '#4285F4'
      }
    ]
    
    // 批量创建Agents
    let createdCount = 0
    for (const agent of agents) {
      try {
        await prisma.agent.create({ data: agent })
        createdCount++
        console.log(`✅ Created agent: ${agent.name}`)
      } catch (error: any) {
        console.error(`❌ Failed to create agent ${agent.name}:`, error.message)
      }
    }
    console.log(`\n✨ Created ${createdCount}/${agents.length} agents successfully`)
    
    // 8. 验证数据
    console.log('\n📊 Verifying database content...')
    const counts = {
      admins: await prisma.admin.count(),
      agents: await prisma.agent.count(),
      feedbackButtons: await prisma.feedbackButton.count(),
      feedbackConfigs: await prisma.feedbackConfig.count(),
      starMagnitudeConfigs: await prisma.starMagnitudeConfig.count()
    }
    
    console.log('\n📈 Database statistics:')
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`  - ${table}: ${count}`)
    })
    
    // 9. 验证文件大小
    const stats = fs.statSync(DATABASE_PATH)
    console.log(`\n💾 Database file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`)
    
    console.log('\n✅ Production database created successfully!')
    console.log(`📍 Location: ${DATABASE_PATH}`)
    
  } catch (error) {
    console.error('\n❌ Error creating production database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// 执行脚本
createProductionDatabase()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })