import { NextResponse } from 'next/server'

// 静态数据，不依赖数据库
export async function GET() {
  return NextResponse.json({
    success: true,
    agents: [
      {
        id: '1',
        name: 'ChatGPT Plus',
        description: '通用AI助手，支持文本生成、问答、创作等多种任务',
        tags: '智能助手,文本创作,知识问答',
        manager: 'OpenAI',
        homepage: 'https://chat.openai.com',
        icon: '💬',
        enabled: true,
        clickCount: 120,
        themeColor: '#74AA9C',
        guideUrl: '/guides/chatgpt'
      },
      {
        id: '2',
        name: 'Claude',
        description: '安全可靠的AI助手，擅长分析和编程',
        tags: '智能助手,对话分析,编程开发',
        manager: 'Anthropic',
        homepage: 'https://claude.ai',
        icon: '🤖',
        enabled: true,
        clickCount: 85,
        themeColor: '#8B7EC8',
        guideUrl: '/guides/claude'
      },
      {
        id: '3',
        name: 'Midjourney',
        description: 'AI图像生成工具，创建高质量的艺术作品和设计',
        tags: '图像生成,视觉设计,数字艺术',
        manager: 'Midjourney',
        homepage: 'https://midjourney.com',
        icon: '🎨',
        enabled: true,
        clickCount: 200,
        themeColor: '#FFB347',
        guideUrl: '/guides/midjourney'
      },
      {
        id: '4',
        name: 'GitHub Copilot',
        description: 'AI代码助手，提供实时代码补全和生成建议',
        tags: '编程开发,代码补全,智能助手',
        manager: 'GitHub',
        homepage: 'https://github.com/features/copilot',
        icon: '🐙',
        enabled: true,
        clickCount: 150,
        themeColor: '#24292E',
        guideUrl: '/guides/copilot'
      },
      {
        id: '5',
        name: 'DALL-E 3',
        description: 'OpenAI的最新图像生成模型，创造力和准确性并重',
        tags: '图像生成,视觉设计,创意工具',
        manager: 'OpenAI',
        homepage: 'https://openai.com/dall-e-3',
        icon: '🎭',
        enabled: true,
        clickCount: 95,
        themeColor: '#412991',
        guideUrl: '/guides/dalle3'
      },
      {
        id: '6',
        name: 'Perplexity AI',
        description: 'AI搜索引擎，提供准确的信息检索和答案生成',
        tags: '智能搜索,学术研究,信息检索',
        manager: 'Perplexity',
        homepage: 'https://perplexity.ai',
        icon: '🔍',
        enabled: true,
        clickCount: 60,
        themeColor: '#1A73E8',
        guideUrl: '/guides/perplexity'
      },
      {
        id: '7',
        name: 'Stable Diffusion',
        description: '开源的AI图像生成模型，支持本地部署和自定义训练',
        tags: '图像生成,开源工具,本地部署',
        manager: 'Stability AI',
        homepage: 'https://stability.ai',
        icon: '🌈',
        enabled: true,
        clickCount: 110,
        themeColor: '#A855F7',
        guideUrl: '/guides/stable-diffusion'
      },
      {
        id: '8',
        name: 'Cursor IDE',
        description: 'AI驱动的代码编辑器，提供智能补全和代码生成',
        tags: '编程开发,集成环境,代码补全',
        manager: 'Cursor',
        homepage: 'https://cursor.sh',
        icon: '⚡',
        enabled: true,
        clickCount: 75,
        themeColor: '#F97316',
        guideUrl: '/guides/cursor'
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 8,
      pages: 1
    }
  })
}