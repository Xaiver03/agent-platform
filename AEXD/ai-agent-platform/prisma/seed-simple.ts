import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 清空现有数据
  try {
    await prisma.agentFeedback.deleteMany()
    await prisma.agentApplication.deleteMany()
    await prisma.agent.deleteMany()
    await prisma.admin.deleteMany()
    await prisma.feedbackConfig.deleteMany()
    await prisma.feedbackButton.deleteMany()
    await prisma.starMagnitudeConfig.deleteMany()
    await prisma.danmaku.deleteMany()
    await prisma.danmakuConfig.deleteMany()
  } catch (e) {
    console.log('Error clearing data:', e)
  }

  // 创建管理员账号
  const hashedPassword = await bcrypt.hash('miracleplus666,.', 10)
  await prisma.admin.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: '超级管理员',
      role: 'super_admin',
      canChangePassword: true,
      canManageAdmins: true
    }
  })

  // 创建反馈配置
  await prisma.feedbackConfig.create({
    data: {
      productFeedbackUrl: 'https://forms.google.com/d/e/1FAIpQLScP5S3fT3kT8Q9yKzVvZ_feedback/viewform',
      platformFeedbackUrl: 'https://forms.google.com/d/e/1FAIpQLScP5S3fT3kT8Q9yKzVvZ_platform/viewform'
    }
  })

  // 创建增强版Agent数据
  const agents = [
    {
      name: 'Claude Code',
      description: 'Anthropic开发的AI编程助手，支持终端集成、多步骤任务处理、代码生成和调试。基于Claude 4模型，是世界领先的编码AI',
      tags: '编程,调试,Agent编排,终端集成,代码重构',
      manager: '张三',
      guideUrl: '/guides/claude-code',
      homepage: 'https://claude.ai/code',
      icon: '🤖',
      themeColor: '#FF6B35',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      guideContent: '# Claude Code 使用指南\n\n## 简介\n\nClaude Code 是 Anthropic 在2025年推出的革命性AI编程助手，基于Claude Opus 4和Claude Sonnet 4模型，在SWE-bench上达到72.5%的领先性能。\n\n## 主要功能\n\n### 1. 终端集成\n- 直接在终端中运行，无需切换界面\n- 理解整个代码库结构\n- 自动化常规任务\n\n### 2. 高级代码生成\n- 支持多种编程语言（Python、JavaScript、TypeScript、Go、Rust等）\n- 上下文感知的代码补全\n- 智能重构建议\n\n### 3. Agent模式\n- 自动完成端到端的编程任务\n- 从读取issue到提交PR的完整工作流\n- 集成GitHub Actions进行后台任务\n\n### 4. 扩展思考能力\n- 在思考过程中使用工具（如网络搜索）\n- 交替进行推理和工具使用\n- 提供更准确的解决方案\n\n## 使用技巧\n\n1. 项目初始化：使用 claude init 快速映射代码库\n2. 自定义配置：通过 Claude.md 文件设置项目特定的工作流\n3. 批量重构：描述重构需求，Claude Code可以自动处理整个代码库\n4. 测试驱动开发：Claude Code可以自动运行测试并修复失败的测试',
      enabled: true,
      clickCount: 1250
    },
    {
      name: 'ChatGPT Plus',
      description: 'OpenAI的高级AI助手，支持GPT-4.1模型，提供更快响应速度、图像生成(DALL-E 3)、代码解释器和插件功能',
      tags: '通用,写作,问答,图像生成,数据分析',
      manager: '李四',
      guideUrl: '/guides/chatgpt',
      homepage: 'https://chat.openai.com',
      icon: '💬',
      themeColor: '#10A37F',
      coverImage: 'https://images.unsplash.com/photo-1684785627128-58b4bd00450d?w=800&h=400&fit=crop',
      guideContent: '# ChatGPT Plus 使用指南\n\n## 简介\n\nChatGPT Plus 是 OpenAI 的高级版本 AI 助手，基于GPT-4.1模型，提供更快的响应速度和优先访问新功能。\n\n## 主要功能\n\n### 1. 增强对话能力\n- 基于GPT-4.1的高级推理\n- 支持长文本处理（128K上下文）\n- 多轮对话记忆能力增强\n\n### 2. DALL-E 3图像生成\n- 直接在对话中生成图像\n- 精确理解文本描述\n- 支持风格定制和迭代优化\n\n### 3. 代码解释器\n- 运行Python代码\n- 数据分析和可视化\n- 文件处理和转换\n\n### 4. 插件生态系统\n- 网络浏览插件\n- 第三方应用集成\n- 自定义工作流',
      enabled: true,
      clickCount: 2100
    },
    {
      name: 'Midjourney',
      description: 'AI图像生成领导者，V7版本支持视频生成、增强的文本渲染、2048x2048高分辨率输出和改进的风格控制',
      tags: '设计,图像生成,艺术,视频生成,文本渲染',
      manager: '王五',
      guideUrl: '/guides/midjourney',
      homepage: 'https://midjourney.com',
      icon: '🎨',
      themeColor: '#5865F2',
      coverImage: 'https://images.unsplash.com/photo-1688496019313-d4dc472fa5c4?w=800&h=400&fit=crop',
      guideContent: '# Midjourney 使用指南\n\n## 简介\n\nMidjourney 是领先的 AI 图像生成工具，V7版本（2025）带来了革命性的视频生成功能和显著改进的图像质量。\n\n## 创作流程\n\n### 1. Discord使用\n- 使用 /imagine 命令开始创作\n- 支持长达1000字符的提示词\n- 实时预览和迭代\n\n### 2. Web界面（新）\n- 更直观的创作体验\n- 批量生成和管理\n- 高级参数可视化调整\n\n## V7新功能\n\n### 1. 视频生成\n- 支持短视频创作\n- 风格一致性保持\n- 动态效果控制\n\n### 2. 增强的文本渲染\n- 准确的文字生成\n- 多语言支持\n- 字体风格控制',
      enabled: true,
      clickCount: 1850
    },
    {
      name: 'Cursor IDE',
      description: '2025年最受欢迎的AI代码编辑器，集成Claude 3.7、GPT-4.1等模型，支持Agent模式自主完成编程任务，估值90亿美元',
      tags: '编程,IDE,代码补全,Agent模式,多模型',
      manager: '赵六',
      guideUrl: '/guides/cursor',
      homepage: 'https://cursor.sh',
      icon: '⚡',
      themeColor: '#6366F1',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      guideContent: '# Cursor IDE 使用指南\n\n## 简介\n\nCursor 是一款革命性的AI驱动代码编辑器（基于VS Code），2025年5月估值达90亿美元，成为开发者首选的AI编程工具。\n\n## 核心功能\n\n### 1. 智能代码补全\n- 多行代码预测和编辑\n- 上下文感知的智能建议\n- 自然语言转代码\n- Tab补全模型大幅升级（2025）\n\n### 2. Agent模式\n- 端到端自主完成编程任务\n- 智能应用代码建议\n- 保持开发者知情和控制\n- 基于数十亿数据点训练\n\n### 3. 代码库理解\n- 自定义检索模型深度理解代码\n- @Codebase功能查询整个项目\n- 自动提供相关代码上下文\n- 减少手动添加上下文需求',
      enabled: true,
      clickCount: 3200
    },
    {
      name: 'GitHub Copilot',
      description: '微软与OpenAI合作的AI代码助手，提供实时代码补全、测试生成、代码解释和重构建议，深度集成GitHub生态系统',
      tags: '编程,代码补全,AI助手,GitHub集成,测试生成',
      manager: '周九',
      guideUrl: '/guides/github-copilot',
      homepage: 'https://github.com/features/copilot',
      icon: '🐙',
      themeColor: '#24292E',
      coverImage: 'https://images.unsplash.com/photo-1618477462146-58cb5bfcc7ce?w=800&h=400&fit=crop',
      guideContent: '# GitHub Copilot 使用指南\n\n## 简介\n\nGitHub Copilot 是微软和 OpenAI 合作开发的 AI 代码助手，深度集成到开发工作流中，提供智能代码建议。\n\n## 主要功能\n\n### 1. 智能代码补全\n- 基于上下文的多行代码建议\n- 支持60+编程语言\n- 学习个人编码风格\n- 实时适应项目规范\n\n### 2. Copilot Chat\n- IDE内置AI对话\n- 代码解释和调试\n- 生成单元测试\n- 重构建议',
      enabled: true,
      clickCount: 2800
    },
    {
      name: 'Perplexity AI',
      description: '新一代AI搜索引擎，结合实时网络搜索和AI对话，提供准确引用来源的答案，支持学术研究和事实核查',
      tags: '搜索,研究,信息获取,学术,事实核查',
      manager: '钱七',
      guideUrl: '/guides/perplexity',
      homepage: 'https://perplexity.ai',
      icon: '🔍',
      themeColor: '#20B2AA',
      coverImage: 'https://images.unsplash.com/photo-1677442135136-760c813028c0?w=800&h=400&fit=crop',
      guideContent: '# Perplexity AI 使用指南\n\n## 简介\n\nPerplexity AI 是革命性的AI搜索引擎，将传统搜索与AI对话完美结合，提供带有可靠来源的准确答案。\n\n## 核心功能\n\n### 1. 智能搜索\n- 自然语言查询理解\n- 实时网络信息抓取\n- 多源信息综合分析\n- 引用来源透明展示\n\n### 2. Focus模式\n- Academic：学术论文搜索\n- Writing：创作辅助模式\n- YouTube：视频内容分析\n- Reddit：社区讨论总结\n- Math：数学问题求解',
      enabled: true,
      clickCount: 1650
    },
    {
      name: 'Claude 3.5',
      description: 'Anthropic最新的AI模型，在代码生成、数学推理、视觉理解方面表现卓越，支持200K上下文窗口',
      tags: '通用AI,编程,推理,视觉理解,长文本',
      manager: '王十二',
      guideUrl: '/guides/claude-3.5',
      homepage: 'https://claude.ai',
      icon: '🧠',
      themeColor: '#D97706',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      guideContent: '# Claude 3.5 使用指南\n\n## 简介\n\nClaude 3.5 Sonnet 是 Anthropic 的最新旗舰模型，在多项基准测试中超越GPT-4，特别在代码生成和推理能力方面表现突出。\n\n## 核心优势\n\n### 1. 卓越的代码能力\n- HumanEval编程测试：92%准确率\n- 支持100+编程语言\n- 理解复杂代码库结构\n- 生成生产级代码\n\n### 2. 长上下文处理\n- 200K token上下文窗口\n- 相当于一本书的内容\n- 保持长对话连贯性\n- 跨文档分析能力',
      enabled: true,
      clickCount: 1950
    },
    {
      name: 'Stable Diffusion XL',
      description: '开源图像生成模型的领导者，支持本地部署、LoRA微调、ControlNet精确控制，社区生态丰富',
      tags: '图像生成,开源,自定义,本地部署,LoRA',
      manager: '王十二',
      guideUrl: '/guides/stable-diffusion',
      homepage: 'https://stability.ai',
      icon: '🌈',
      themeColor: '#A855F7',
      coverImage: 'https://images.unsplash.com/photo-1686191128782-cf8f2b1be19b?w=800&h=400&fit=crop',
      guideContent: '# Stable Diffusion XL 使用指南\n\n## 简介\n\nStable Diffusion XL (SDXL) 是Stability AI的开源图像生成模型，以其灵活性和可定制性著称，拥有庞大的社区生态。\n\n## 核心特性\n\n### 1. 模型优势\n- 1024x1024基础分辨率\n- 更好的手部和面部生成\n- 简化的提示词需求\n- 支持图像修复和扩展\n\n### 2. 本地部署\n- 完全离线运行\n- 无使用限制\n- 数据隐私保护\n- 硬件要求：6GB+ VRAM',
      enabled: true,
      clickCount: 1420
    },
    {
      name: 'DALL-E 3',
      description: 'OpenAI的创意图像生成模型，精确理解文本描述，集成ChatGPT，支持安全过滤和版权保护',
      tags: '图像生成,创意,设计,ChatGPT集成,安全',
      manager: '吴十',
      guideUrl: '/guides/dalle3',
      homepage: 'https://openai.com/dall-e-3',
      icon: '🎭',
      themeColor: '#10A37F',
      coverImage: 'https://images.unsplash.com/photo-1686191128669-e73e1c4b7aad?w=800&h=400&fit=crop',
      guideContent: '# DALL-E 3 使用指南\n\n## 简介\n\nDALL-E 3 是 OpenAI 最新的图像生成模型，通过与ChatGPT的深度集成，提供前所未有的创意控制和安全性。\n\n## 核心特点\n\n### 1. 精确的提示理解\n- 准确渲染长文本描述\n- 理解复杂场景关系\n- 保持风格一致性\n- 细节准确度大幅提升\n\n### 2. ChatGPT集成\n- 自动优化提示词\n- 交互式图像迭代\n- 创意头脑风暴\n- 多语言支持',
      enabled: true,
      clickCount: 1780
    },
    {
      name: 'Gemini Ultra',
      description: 'Google最强大的AI模型，多模态理解能力出众，支持100万token超长上下文，原生支持代码执行',
      tags: '多模态,长文本,代码执行,推理,Google',
      manager: '孙八',
      guideUrl: '/guides/gemini',
      homepage: 'https://gemini.google.com',
      icon: '💎',
      themeColor: '#4285F4',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      guideContent: '# Gemini Ultra 使用指南\n\n## 简介\n\nGemini Ultra 是 Google 推出的最强大多模态AI模型，在多项基准测试中达到最先进水平，特别是在推理和多模态理解方面。\n\n## 核心能力\n\n### 1. 多模态理解\n- 同时处理文本、图像、音频、视频\n- 跨模态推理和分析\n- 原生多模态训练\n- 无缝模态转换\n\n### 2. 超长上下文\n- 100万token上下文窗口\n- 相当于1小时视频或70万词\n- 保持长期记忆\n- 跨文档关联分析',
      enabled: true,
      clickCount: 1560
    },
    {
      name: 'Notion AI',
      description: '集成在Notion中的AI助手，提供智能写作、总结、翻译、头脑风暴等功能，与知识库深度整合',
      tags: '写作,笔记,知识管理,协作,效率工具',
      manager: '孙八',
      guideUrl: '/guides/notion-ai',
      homepage: 'https://notion.so',
      icon: '📝',
      themeColor: '#000000',
      coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
      guideContent: '# Notion AI 使用指南\n\n## 简介\n\nNotion AI 深度集成在 Notion 工作空间中，将AI能力与知识管理完美结合，提供情境化的智能协助。\n\n## 核心功能\n\n### 1. 智能写作\n- 文章大纲生成\n- 段落扩展和精简\n- 语气和风格调整\n- 语法和拼写检查\n\n### 2. 内容总结\n- 长文档关键点提取\n- 会议记录总结\n- 研究材料概括\n- 行动项提取',
      enabled: true,
      clickCount: 1340
    },
    {
      name: 'DeepL Write',
      description: '基于AI的高质量翻译和写作工具，支持30+语言互译，提供专业术语库和文档翻译功能',
      tags: '翻译,语言,写作优化,国际化,文档处理',
      manager: '郑十一',
      guideUrl: '/guides/deepl',
      homepage: 'https://deepl.com',
      icon: '🌍',
      themeColor: '#006494',
      coverImage: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=800&h=400&fit=crop',
      guideContent: '# DeepL 使用指南\n\n## 简介\n\nDeepL 凭借先进的神经网络技术，提供业界最准确的翻译服务，同时推出的Write功能帮助用户提升写作质量。\n\n## 核心功能\n\n### 1. 精准翻译\n- 支持31种语言\n- 保持语境和语气\n- 识别专业术语\n- 处理方言和俚语\n\n### 2. DeepL Write\n- 语法和拼写检查\n- 句子重构建议\n- 语气调整选项\n- 清晰度优化',
      enabled: true,
      clickCount: 980
    },
    {
      name: 'Jasper AI',
      description: '企业级AI内容创作平台，专注营销文案、博客文章、社交媒体内容生成，支持品牌声音定制',
      tags: '内容创作,营销,商业写作,SEO,品牌',
      manager: '李十三',
      guideUrl: '/guides/jasper',
      homepage: 'https://jasper.ai',
      icon: '📈',
      themeColor: '#5C4EE5',
      coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
      guideContent: '# Jasper AI 使用指南\n\n## 简介\n\nJasper AI 是专为营销团队和内容创作者设计的AI平台，提供品牌一致性的内容生成和优化工具。\n\n## 核心功能\n\n### 1. 营销文案生成\n- Facebook/Google广告文案\n- 产品描述优化\n- 销售邮件模板\n- 登陆页文案\n\n### 2. 长篇内容创作\n- SEO优化博客文章\n- 白皮书和电子书\n- 案例研究\n- 新闻稿撰写',
      enabled: true,
      clickCount: 1120
    },
    {
      name: 'Runway Gen-3',
      description: '专业AI视频生成和编辑平台，支持文本到视频、图像动画化、视频风格转换等创新功能',
      tags: '视频生成,视频编辑,动画,特效,创意工具',
      manager: '陈十四',
      guideUrl: '/guides/runway',
      homepage: 'https://runwayml.com',
      icon: '🎬',
      themeColor: '#FF006E',
      coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=400&fit=crop',
      guideContent: '# Runway Gen-3 使用指南\n\n## 简介\n\nRunway Gen-3 是领先的AI视频创作平台，为创意专业人士提供突破性的视频生成和编辑工具。\n\n## 核心功能\n\n### 1. 文本到视频\n- 4K分辨率输出\n- 10秒视频生成\n- 电影级质量\n- 精确动作控制\n\n### 2. 图像动画化\n- 静态图片变视频\n- 自定义运动轨迹\n- 表情和姿态控制\n- 背景动态效果',
      enabled: true,
      clickCount: 890
    },
    {
      name: 'Anthropic Claude Pro',
      description: 'Claude AI的专业版本，提供5倍更多使用量、优先访问新功能、更快响应速度',
      tags: 'AI助手,对话,分析,写作,Claude',
      manager: '林十五',
      guideUrl: '/guides/claude-pro',
      homepage: 'https://claude.ai/subscription',
      icon: '🎓',
      themeColor: '#E16F24',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      guideContent: '# Claude Pro 使用指南\n\n## 简介\n\nClaude Pro 是 Anthropic 提供的高级订阅服务，为专业用户提供更强大的AI能力和更好的使用体验。\n\n## Pro版优势\n\n### 1. 使用量提升\n- 5倍更多消息数\n- 更少的速率限制\n- 高峰期优先访问\n- 连续对话能力\n\n### 2. 新功能优先体验\n- Claude 3.5最新版本\n- 实验性功能测试\n- 专属功能预览\n- 反馈优先响应',
      enabled: true,
      clickCount: 1680
    },
    {
      name: 'Bing Chat Enterprise',
      description: '微软企业级AI聊天助手，集成必应搜索、支持多模态交互、提供商业数据保护',
      tags: '搜索,聊天,企业,微软,多模态',
      manager: '黄十六',
      guideUrl: '/guides/bing-chat',
      homepage: 'https://www.microsoft.com/en-us/edge/features/bing-chat',
      icon: '🔎',
      themeColor: '#0078D4',
      coverImage: 'https://images.unsplash.com/photo-1633114127451-558041183c08?w=800&h=400&fit=crop',
      guideContent: '# Bing Chat Enterprise 使用指南\n\n## 简介\n\nBing Chat Enterprise 是微软为企业用户打造的安全AI助手，结合了GPT-4的能力与必应搜索，提供实时、准确的信息。\n\n## 核心功能\n\n### 1. 智能搜索集成\n- 实时网络信息\n- 引用来源链接\n- 多轮搜索优化\n- 垂直搜索能力\n\n### 2. 多模态交互\n- 图像理解分析\n- 图表数据提取\n- 视觉问答\n- 图像生成(DALL-E)',
      enabled: true,
      clickCount: 760
    },
    {
      name: 'Cohere Command R+',
      description: '企业级大语言模型，专注于检索增强生成(RAG)、多语言支持和工具调用，性价比极高',
      tags: 'LLM,RAG,多语言,企业,API',
      manager: '张十七',
      guideUrl: '/guides/cohere',
      homepage: 'https://cohere.com',
      icon: '🌐',
      themeColor: '#FF6B6B',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      guideContent: '# Cohere Command R+ 使用指南\n\n## 简介\n\nCohere Command R+ 是专为企业级应用设计的大语言模型，在检索增强生成(RAG)和工具使用方面表现卓越，支持10种语言。\n\n## 核心优势\n\n### 1. RAG专家\n- 优化的检索性能\n- 引文生成能力\n- 长上下文理解\n- 降低幻觉率\n\n### 2. 多语言能力\n- 10种语言原生支持\n- 跨语言检索\n- 文化感知响应\n- 统一API接口',
      enabled: true,
      clickCount: 580
    },
    {
      name: 'Whisper AI',
      description: 'OpenAI的开源语音识别模型，支持99种语言转录、实时翻译、说话人分离，准确率接近人类水平',
      tags: '语音识别,转录,翻译,开源,多语言',
      manager: '刘十八',
      guideUrl: '/guides/whisper',
      homepage: 'https://openai.com/research/whisper',
      icon: '🎙️',
      themeColor: '#412991',
      coverImage: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&h=400&fit=crop',
      guideContent: '# Whisper AI 使用指南\n\n## 简介\n\nWhisper 是 OpenAI 开源的自动语音识别(ASR)系统，通过68万小时多语言数据训练，达到接近人类的转录准确率。\n\n## 核心功能\n\n### 1. 多语言转录\n- 支持99种语言\n- 自动语言检测\n- 方言识别\n- 混合语言处理\n\n### 2. 实时翻译\n- 任意语言→英语\n- 保持语义准确\n- 口语化处理\n- 时间戳对齐',
      enabled: true,
      clickCount: 920
    },
    {
      name: 'Copilot for Microsoft 365',
      description: 'Microsoft 365全套办公软件的AI助手，深度集成Word、Excel、PowerPoint、Outlook等应用',
      tags: 'Office,生产力,文档,表格,演示',
      manager: '王十九',
      guideUrl: '/guides/copilot-365',
      homepage: 'https://www.microsoft.com/microsoft-365/copilot',
      icon: '📊',
      themeColor: '#0078D4',
      coverImage: 'https://images.unsplash.com/photo-1633114127451-558041183c08?w=800&h=400&fit=crop',
      guideContent: '# Copilot for Microsoft 365 使用指南\n\n## 简介\n\nCopilot for Microsoft 365 将大语言模型的能力与您的工作数据结合，在您最常用的办公应用中提供智能协助。\n\n## 应用集成\n\n### 1. Word中的Copilot\n- 初稿生成和重写\n- 文档总结提炼\n- 格式和风格调整\n- 引用和脚注管理\n\n### 2. Excel中的Copilot\n- 数据分析洞察\n- 公式推荐生成\n- 图表自动创建\n- 趋势预测分析',
      enabled: true,
      clickCount: 2450
    },
    {
      name: 'Adobe Firefly',
      description: 'Adobe的创意AI套件，专注商业安全的图像生成、编辑和设计，深度集成Creative Cloud',
      tags: '图像生成,设计,Adobe,商业授权,创意',
      manager: '李二十',
      guideUrl: '/guides/firefly',
      homepage: 'https://www.adobe.com/products/firefly.html',
      icon: '🔥',
      themeColor: '#FF0000',
      coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop',
      guideContent: '# Adobe Firefly 使用指南\n\n## 简介\n\nAdobe Firefly 是专为创意专业人士设计的生成式AI，确保商业使用安全，与Creative Cloud深度集成。\n\n## 核心功能\n\n### 1. 文本到图像\n- 商业安全内容\n- 高分辨率输出\n- 风格参考\n- 品牌一致性\n\n### 2. 生成填充\n- 智能扩展画布\n- 对象移除/添加\n- 背景替换\n- 无缝修复',
      enabled: true,
      clickCount: 1340
    }
  ]

  // 批量创建Agent
  for (const agent of agents) {
    await prisma.agent.create({
      data: agent,
    })
  }

  // 创建一些示例应用申请
  const agentIds = await prisma.agent.findMany({
    select: { id: true, name: true }
  })

  const applications = [
    {
      agentId: agentIds[0].id,
      applicantName: '张小明',
      email: 'zhangxm@example.com',
      reason: '我是一名前端开发者，希望使用Claude Code来提升编码效率，特别是在React项目开发中。',
      status: 'APPROVED'
    },
    {
      agentId: agentIds[1].id,
      applicantName: '李华',
      email: 'lihua@example.com',
      reason: '作为内容创作者，我需要ChatGPT Plus来帮助我进行文章创作和优化。',
      status: 'PENDING'
    },
    {
      agentId: agentIds[2].id,
      applicantName: '王设计',
      email: 'wangdesign@example.com',
      reason: '我是UI设计师，想要使用Midjourney创作独特的设计概念和素材。',
      status: 'APPROVED'
    },
    {
      agentId: agentIds[3].id,
      applicantName: '赵程序',
      email: 'zhaocoder@example.com',
      reason: '正在学习使用AI辅助编程，Cursor的实时代码补全功能对我很有帮助。',
      status: 'PENDING'
    },
    {
      agentId: agentIds[0].id,
      applicantName: '钱工程师',
      email: 'qianeng@example.com',
      reason: '团队正在进行大规模重构，Claude Code的多文件处理能力正是我们需要的。',
      status: 'REJECTED'
    }
  ]

  for (const app of applications) {
    await prisma.agentApplication.create({
      data: app
    })
  }

  // 创建一些示例反馈
  const feedbacks = [
    {
      agentId: agentIds[0].id,
      userName: '开发者小王',
      email: 'wangdev@example.com',
      score: 5,
      comment: 'Claude Code大大提升了我的开发效率，特别是代码重构功能非常强大！'
    },
    {
      agentId: agentIds[1].id,
      userName: '内容创作者',
      score: 4,
      comment: 'ChatGPT Plus的写作辅助功能很好用，但有时候响应速度较慢。'
    },
    {
      agentId: agentIds[2].id,
      userName: '设计师小李',
      email: 'lidesign@example.com',
      score: 5,
      comment: 'Midjourney生成的图像质量超出预期，V7的视频功能也很期待！'
    },
    {
      agentId: agentIds[3].id,
      userName: '全栈工程师',
      score: 5,
      comment: 'Cursor的AI代码补全准确率很高，多模型支持让我可以选择最适合的。'
    },
    {
      agentId: agentIds[4].id,
      userName: '团队负责人',
      email: 'teamlead@example.com',
      score: 4,
      comment: 'GitHub Copilot与我们的开发流程集成很好，团队整体效率提升明显。'
    }
  ]

  for (const feedback of feedbacks) {
    await prisma.agentFeedback.create({
      data: feedback
    })
  }

  // 创建默认反馈按钮
  await prisma.feedbackButton.createMany({
    data: [
      {
        title: 'AI产品反馈',
        description: '对具体AI工具的使用反馈和建议',
        url: 'https://forms.google.com/forms/d/e/product-feedback/viewform',
        qrCodeImage: null,
        icon: 'message',
        color: '#1890ff',
        order: 1,
        enabled: true
      },
      {
        title: '平台功能建议',
        description: '对AI体验平台的改进建议',
        url: 'https://forms.google.com/forms/d/e/platform-feedback/viewform',
        qrCodeImage: null,
        icon: 'form',
        color: '#52c41a',
        order: 2,
        enabled: true
      },
      {
        title: '申请新AI工具',
        description: '推荐您想要的AI工具',
        url: 'https://forms.google.com/forms/d/e/new-tool-request/viewform',
        qrCodeImage: null,
        icon: 'plus',
        color: '#722ed1',
        order: 3,
        enabled: true
      }
    ]
  })

  // 创建弹幕配置
  await prisma.danmakuConfig.create({
    data: {
      enabled: true,
      maxLength: 30,
      playSpeed: 1.0,
      batchSize: 10
    }
  })

  // 创建一些示例弹幕
  const sampleDanmakus = [
    { text: 'Claude Code真的太强了！', color: '#FF6B6B' },
    { text: 'Midjourney生成的图片质量amazing', color: '#4ECDC4' },
    { text: '求推荐最好用的AI编程工具', color: '#45B7D1' },
    { text: 'Cursor的代码补全准确率好高', color: '#96CEB4' },
    { text: 'ChatGPT Plus值得订阅吗？', color: '#FECA57' },
    { text: 'AI时代真的来了', color: '#FF9FF3' },
    { text: '有人用过GitHub Copilot吗', color: '#54A0FF' },
    { text: 'Stable Diffusion开源万岁！', color: '#48DBFB' },
    { text: '这个平台做得真不错', color: '#FF6B9D' },
    { text: 'AI让编程变得更有趣了', color: '#C44569' }
  ]

  for (const danmaku of sampleDanmakus) {
    await prisma.danmaku.create({
      data: danmaku
    })
  }

  // 创建星等配置
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
        description: '最受欢迎的AI工具，点击量1000+',
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
        description: '非常受欢迎的工具，点击量500-999',
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
        description: '受欢迎的工具，点击量200-499',
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
        description: '中等热度工具，点击量100-199',
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
        description: '普通热度工具，点击量50-99',
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
        description: '较低热度工具，点击量20-49',
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
        description: '新工具或低热度工具，点击量0-19',
        orderIndex: 7
      }
    ]
  })

  console.log('Enhanced database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })