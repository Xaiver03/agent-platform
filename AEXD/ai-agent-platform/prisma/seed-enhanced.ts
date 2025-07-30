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

  // 创建其他管理员
  await prisma.admin.createMany({
    data: [
      {
        email: 'zhangsan@example.com',
        password: await bcrypt.hash('admin123', 10),
        name: '张三',
        role: 'admin',
        canChangePassword: false,
        canManageAdmins: false,
        createdBy: 'admin@example.com'
      },
      {
        email: 'lisi@example.com',
        password: await bcrypt.hash('admin123', 10),
        name: '李四',
        role: 'admin',
        canChangePassword: false,
        canManageAdmins: false,
        createdBy: 'admin@example.com'
      }
    ]
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
      guideContent: `# Claude Code 使用指南

## 📖 简介

Claude Code 是 Anthropic 在2025年推出的革命性AI编程助手，基于Claude Opus 4和Claude Sonnet 4模型，在SWE-bench上达到72.5%的领先性能。

## 🚀 主要功能

### 1. 终端集成
- 直接在终端中运行，无需切换界面
- 理解整个代码库结构
- 自动化常规任务

### 2. 高级代码生成
- 支持多种编程语言（Python、JavaScript、TypeScript、Go、Rust等）
- 上下文感知的代码补全
- 智能重构建议

### 3. Agent模式
- 自动完成端到端的编程任务
- 从读取issue到提交PR的完整工作流
- 集成GitHub Actions进行后台任务

### 4. 扩展思考能力
- 在思考过程中使用工具（如网络搜索）
- 交替进行推理和工具使用
- 提供更准确的解决方案

## 💡 使用技巧

1. **项目初始化**：使用 \`claude init\` 快速映射代码库
2. **自定义配置**：通过 \`Claude.md\` 文件设置项目特定的工作流
3. **批量重构**：描述重构需求，Claude Code可以自动处理整个代码库
4. **测试驱动开发**：Claude Code可以自动运行测试并修复失败的测试

## 🔧 高级功能

- **VS Code/JetBrains集成**：直接在IDE中显示编辑
- **缓存机制**：提示缓存最长1小时，提高响应速度
- **文件API**：高效处理大型文件和代码库
- **MCP连接器**：扩展工具集成能力

## 💰 定价

- Claude Max订阅：$50-$200/月（根据使用量）
- API定价：Opus 4 - $15/$75 per million tokens (input/output)
- API定价：Sonnet 4 - $3/$15 per million tokens (input/output)`,
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
      guideContent: `# ChatGPT Plus 使用指南

## 📖 简介

ChatGPT Plus 是 OpenAI 的高级版本 AI 助手，基于GPT-4.1模型，提供更快的响应速度和优先访问新功能。

## 🚀 主要功能

### 1. 增强对话能力
- 基于GPT-4.1的高级推理
- 支持长文本处理（128K上下文）
- 多轮对话记忆能力增强

### 2. DALL-E 3图像生成
- 直接在对话中生成图像
- 精确理解文本描述
- 支持风格定制和迭代优化

### 3. 代码解释器
- 运行Python代码
- 数据分析和可视化
- 文件处理和转换

### 4. 插件生态系统
- 网络浏览插件
- 第三方应用集成
- 自定义工作流

## 💡 使用技巧

1. **明确指令**：使用具体、详细的描述获得最佳结果
2. **系统提示**：设置自定义指令来个性化响应
3. **分步请求**：将复杂任务分解为多个步骤
4. **迭代优化**：根据输出进行调整和改进

## 🔧 高级功能

- **GPT Builder**：创建自定义GPT应用
- **文件上传**：支持多种格式的文档分析
- **语音对话**：移动端支持语音输入输出
- **团队协作**：ChatGPT Team计划支持共享对话

## 💰 定价

- 个人版：$20/月
- 团队版：$25/用户/月
- 企业版：定制价格`,
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
      guideContent: `# Midjourney 使用指南

## 📖 简介

Midjourney 是领先的 AI 图像生成工具，V7版本（2025）带来了革命性的视频生成功能和显著改进的图像质量。

## 🎨 创作流程

### 1. Discord使用
- 使用 /imagine 命令开始创作
- 支持长达1000字符的提示词
- 实时预览和迭代

### 2. Web界面（新）
- 更直观的创作体验
- 批量生成和管理
- 高级参数可视化调整

## 🚀 V7新功能

### 1. 视频生成
- 支持短视频创作
- 风格一致性保持
- 动态效果控制

### 2. 增强的文本渲染
- 准确的文字生成
- 多语言支持
- 字体风格控制

### 3. 提升的图像质量
- 原生2048x2048分辨率
- 更真实的光影效果
- 细节保真度提升50%

## 🔧 参数详解

- **--ar**：宽高比（支持任意比例）
- **--v 7**：使用最新V7模型
- **--stylize**：风格化程度(0-1000)
- **--chaos**：创意随机度(0-100)
- **--quality**：渲染质量(0.25-2)
- **--no**：排除元素
- **--seed**：固定随机种子

## 💡 进阶技巧

1. **风格参考**：使用--sref导入风格参考图
2. **角色一致性**：--cref保持角色特征
3. **混合模式**：/blend融合多张图片
4. **局部重绘**：Vary Region精确编辑

## 🎯 应用场景

- 概念艺术和插画
- 产品设计可视化
- 建筑效果图
- 游戏资产生成
- 营销素材创作

## 💰 定价

- 基础计划：$10/月（200张图）
- 标准计划：$30/月（15小时快速生成）
- 专业计划：$60/月（30小时快速生成）
- 超级计划：$120/月（60小时快速生成）`,
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
      guideContent: `# Cursor IDE 使用指南

## 📖 简介

Cursor 是一款革命性的AI驱动代码编辑器（基于VS Code），2025年5月估值达90亿美元，成为开发者首选的AI编程工具。

## ⚡ 核心功能

### 1. 智能代码补全
- 多行代码预测和编辑
- 上下文感知的智能建议
- 自然语言转代码
- Tab补全模型大幅升级（2025）

### 2. Agent模式
- 端到端自主完成编程任务
- 智能应用代码建议
- 保持开发者知情和控制
- 基于数十亿数据点训练

### 3. 代码库理解
- 自定义检索模型深度理解代码
- @Codebase功能查询整个项目
- 自动提供相关代码上下文
- 减少手动添加上下文需求

### 4. 多模型支持
- Claude 3.7 Sonnet（最受欢迎）
- Gemini 2.5 Pro
- GPT-4.1
- o3和o4-mini（增长最快）
- DeepSeek v3.1
- Grok

## 🔧 高级功能

### 1. 错误自动修复
- 自动检测lint错误
- 一键应用修复建议
- 减少手动调试时间

### 2. 终端命令生成
- AI自动编写shell命令
- 默认需要确认执行
- 支持复杂命令组合

### 3. Ctrl+K编辑
- 选中代码直接编辑
- 描述修改需求即可
- 无选中时生成新代码

### 4. 聊天集成
- 内置AI聊天界面
- 代码库感知的问答
- 支持多轮对话

## 💡 使用技巧

1. **快捷键掌握**
   - Ctrl+K：AI编辑
   - Ctrl+L：打开聊天
   - Tab：接受建议
   - Ctrl+Enter：查询代码库

2. **提示词优化**
   - 明确描述需求
   - 提供相关上下文
   - 使用技术术语

3. **工作流集成**
   - 配置.cursorrules文件
   - 自定义AI行为
   - 团队共享配置

## 🚀 2025最新更新

- 每周发布新功能
- 背景Agent运行
- 更简洁的UI设计
- 深度CI/CD集成
- 自动测试循环（即将推出）
- Issue tracker集成

## 💰 定价

- 免费版：基础功能
- 专业版：$20/月
- 商业版：$40/月
- 自托管选项：企业定制`,
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
      guideContent: `# GitHub Copilot 使用指南

## 📖 简介

GitHub Copilot 是微软和 OpenAI 合作开发的 AI 代码助手，深度集成到开发工作流中，提供智能代码建议。

## 🚀 主要功能

### 1. 智能代码补全
- 基于上下文的多行代码建议
- 支持60+编程语言
- 学习个人编码风格
- 实时适应项目规范

### 2. Copilot Chat
- IDE内置AI对话
- 代码解释和调试
- 生成单元测试
- 重构建议

### 3. Copilot X功能
- 语音编程支持
- PR描述自动生成
- 文档智能补全
- CLI命令建议

### 4. 企业级功能
- 代码安全扫描
- 许可证合规检查
- 团队知识共享
- 定制化训练

## 🔧 IDE支持

- Visual Studio Code
- Visual Studio
- JetBrains全家桶
- Neovim
- GitHub Codespaces

## 💡 最佳实践

1. **注释驱动开发**
   - 写清晰的注释描述功能
   - 使用函数命名说明意图
   - Copilot会根据注释生成代码

2. **测试优先**
   - 先写测试用例描述
   - Copilot自动生成实现

3. **代码审查**
   - 始终审查AI建议
   - 理解生成的代码逻辑

## 🎯 高级技巧

- **快捷键**：Tab接受，Esc拒绝
- **多建议**：Alt+]查看下一个建议
- **部分接受**：Ctrl+→逐词接受
- **触发建议**：Ctrl+Space手动触发

## 🔒 安全特性

- 不会建议敏感信息
- 过滤不当内容
- 遵守开源许可证
- 企业数据隔离

## 💰 定价

- 个人版：$10/月 或 $100/年
- 商业版：$19/用户/月
- 企业版：$39/用户/月
- 学生/开源：免费`,
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
      guideContent: `# Perplexity AI 使用指南

## 📖 简介

Perplexity AI 是革命性的AI搜索引擎，将传统搜索与AI对话完美结合，提供带有可靠来源的准确答案。

## 🔍 核心功能

### 1. 智能搜索
- 自然语言查询理解
- 实时网络信息抓取
- 多源信息综合分析
- 引用来源透明展示

### 2. Focus模式
- Academic：学术论文搜索
- Writing：创作辅助模式
- YouTube：视频内容分析
- Reddit：社区讨论总结
- Math：数学问题求解

### 3. Collections
- 组织研究主题
- 协作知识库
- 历史记录管理
- 笔记和标注

### 4. Pro功能
- GPT-4和Claude 3.7支持
- 图像理解和生成
- 上传文件分析
- API访问权限

## 💡 使用技巧

1. **精确搜索**
   - 使用引号进行精确匹配
   - 指定时间范围
   - 选择特定域名源

2. **深度研究**
   - 使用追问功能深入
   - 查看所有引用来源
   - 导出研究结果

3. **学术应用**
   - Academic模式查找论文
   - 自动生成引用格式
   - 追踪研究趋势

## 🎯 应用场景

- 学术研究和论文写作
- 市场调研和竞品分析
- 技术问题解决方案
- 实时新闻和事件追踪
- 产品决策和购买建议

## 🔧 高级功能

### 1. Copilot模式
- 交互式研究助手
- 多步骤问题解决
- 自动提出相关问题

### 2. 图像搜索
- 上传图片搜索相似
- 图表数据提取
- 视觉问答

### 3. 代码搜索
- 技术文档检索
- 代码示例查找
- API参考搜索

## 💰 定价

- 免费版：每天5次Pro搜索
- Pro月付：$20/月
- Pro年付：$200/年（省$40）
- 团队版：定制价格`,
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
      guideContent: `# Claude 3.5 使用指南

## 📖 简介

Claude 3.5 Sonnet 是 Anthropic 的最新旗舰模型，在多项基准测试中超越GPT-4，特别在代码生成和推理能力方面表现突出。

## 🚀 核心优势

### 1. 卓越的代码能力
- HumanEval编程测试：92%准确率
- 支持100+编程语言
- 理解复杂代码库结构
- 生成生产级代码

### 2. 长上下文处理
- 200K token上下文窗口
- 相当于一本书的内容
- 保持长对话连贯性
- 跨文档分析能力

### 3. 视觉理解
- 图表和图像分析
- 手写文字识别
- UI设计理解
- 数据可视化解读

### 4. 安全对齐
- 更少的有害输出
- 拒绝不当请求
- 保护隐私信息
- 透明的推理过程

## 💡 使用技巧

1. **系统提示优化**
   - 明确角色定义
   - 设置输出格式
   - 指定专业领域

2. **分步思考**
   - 要求逐步推理
   - 使用思维链提示
   - 验证中间步骤

3. **代码生成**
   - 提供清晰规范
   - 指定编程风格
   - 包含测试要求

## 🔧 API特性

- 低延迟响应
- 流式输出支持
- 函数调用能力
- JSON模式输出

## 🎯 最佳应用

- 复杂代码开发
- 技术文档编写
- 数据分析报告
- 创意写作
- 教育辅导

## 💰 定价

- Claude.ai Pro：$20/月
- API定价：
  - 输入：$3/百万tokens
  - 输出：$15/百万tokens
- 企业版：定制价格`,
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
      guideContent: `# Stable Diffusion XL 使用指南

## 📖 简介

Stable Diffusion XL (SDXL) 是Stability AI的开源图像生成模型，以其灵活性和可定制性著称，拥有庞大的社区生态。

## 🎨 核心特性

### 1. 模型优势
- 1024x1024基础分辨率
- 更好的手部和面部生成
- 简化的提示词需求
- 支持图像修复和扩展

### 2. 本地部署
- 完全离线运行
- 无使用限制
- 数据隐私保护
- 硬件要求：6GB+ VRAM

### 3. 自定义训练
- LoRA微调支持
- DreamBooth个性化
- Textual Inversion
- 风格迁移学习

## 🔧 工具生态

### 1. WebUI选择
- **AUTOMATIC1111**：功能最全面
- **ComfyUI**：节点式工作流
- **Fooocus**：简化操作界面
- **InvokeAI**：专业创作工具

### 2. 增强插件
- **ControlNet**：姿态和构图控制
- **AnimateDiff**：动画生成
- **Deforum**：视频创作
- **Regional Prompter**：区域控制

### 3. 模型资源
- Civitai：最大的模型社区
- HuggingFace：官方模型库
- 自定义检查点
- LoRA模型集合

## 💡 进阶技巧

1. **提示词工程**
   - 质量标签：masterpiece, best quality, highly detailed
   - 负面提示：降低不想要的元素
   - 权重调整：(keyword:1.2) 增强效果

2. **采样器选择**
   - DPM++ 2M Karras：平衡速度和质量
   - Euler a：快速预览
   - DPM++ SDE：高质量输出

3. **后处理流程**
   - ESRGAN放大
   - GFPGAN面部修复
   - Color Grading调色

## 🎯 应用领域

- 概念艺术创作
- 游戏资产生成
- 产品原型设计
- 个人创意项目
- AI艺术探索

## 💰 使用成本

- 开源免费
- 仅需硬件成本
- 云服务选项：
  - RunPod：$0.2-0.5/小时
  - Colab Pro：$10/月
  - 本地GPU：一次性投资`,
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
      guideContent: `# DALL-E 3 使用指南

## 📖 简介

DALL-E 3 是 OpenAI 最新的图像生成模型，通过与ChatGPT的深度集成，提供前所未有的创意控制和安全性。

## 🎨 核心特点

### 1. 精确的提示理解
- 准确渲染长文本描述
- 理解复杂场景关系
- 保持风格一致性
- 细节准确度大幅提升

### 2. ChatGPT集成
- 自动优化提示词
- 交互式图像迭代
- 创意头脑风暴
- 多语言支持

### 3. 安全和道德
- 拒绝生成有害内容
- 公众人物限制
- 艺术家风格保护
- 内容审核机制

### 4. 版权友好
- 用户拥有完整版权
- 商业使用许可
- 无需额外授权
- 创作者权益保护

## 🚀 使用方法

### 1. 通过ChatGPT Plus
- 直接在对话中请求
- 自然语言描述即可
- 支持修改和迭代
- 保存到DALL-E历史

### 2. 通过API
// Python示例：
// response = openai.Image.create(
//   model="dall-e-3",
//   prompt="详细的图像描述",
//   size="1024x1024",
//   quality="hd",
//   n=1
// )

### 3. 图像规格
- 标准：1024x1024
- 宽屏：1792x1024  
- 竖屏：1024x1792
- 质量：standard/hd

## 💡 创作技巧

1. **描述要素**
   - 主体对象
   - 环境背景
   - 艺术风格
   - 光线氛围
   - 颜色方案

2. **迭代优化**
   - 先生成草图
   - 逐步细化要求
   - 保留成功元素
   - 调整问题部分

3. **风格探索**
   - 参考艺术流派
   - 混合不同风格
   - 时代特征融合
   - 媒介材质描述

## 🎯 最佳应用

- 创意概念可视化
- 营销素材制作
- 故事插图创作
- 产品设计探索
- 教育内容配图

## 💰 定价

- ChatGPT Plus内含：$20/月
- API按次计费：
  - 标准质量：$0.04/张
  - HD质量：$0.08/张
- 无月度限制（ChatGPT Plus）`,
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
      guideContent: `# Gemini Ultra 使用指南

## 📖 简介

Gemini Ultra 是 Google 推出的最强大多模态AI模型，在多项基准测试中达到最先进水平，特别是在推理和多模态理解方面。

## 🚀 核心能力

### 1. 多模态理解
- 同时处理文本、图像、音频、视频
- 跨模态推理和分析
- 原生多模态训练
- 无缝模态转换

### 2. 超长上下文
- 100万token上下文窗口
- 相当于1小时视频或70万词
- 保持长期记忆
- 跨文档关联分析

### 3. 代码执行
- 原生Python执行环境
- 数据分析和可视化
- 实时计算验证
- 迭代式问题解决

### 4. 高级推理
- 数学定理证明
- 科学问题求解
- 逻辑推理链
- 创造性问题解决

## 💡 独特功能

### 1. Gemini Code
- 实时代码补全
- 多文件理解
- 测试生成
- 重构建议

### 2. 数据分析
```python
# Gemini可以直接执行
import pandas as pd
import matplotlib.pyplot as plt

# 分析数据并可视化
df = pd.read_csv('data.csv')
df.plot(kind='bar')
plt.show()
```

### 3. 多语言能力
- 100+语言支持
- 跨语言翻译
- 文化理解
- 方言识别

## 🔧 集成选项

### 1. Gemini API
- REST API接口
- 客户端SDK
- 流式响应
- 函数调用

### 2. Google产品集成
- Gmail智能撰写
- Docs协作编辑  
- Sheets数据分析
- Slides演示助手

### 3. 开发工具
- Android Studio集成
- Chrome扩展
- Colab增强
- Cloud Console

## 🎯 最佳实践

1. **复杂任务分解**
   - 利用长上下文
   - 分步骤执行
   - 中间结果验证

2. **多模态协同**
   - 图文结合分析
   - 视频理解总结
   - 跨模态检索

3. **实时验证**
   - 代码执行验证
   - 数学计算检查
   - 逻辑一致性

## 💰 定价

- Gemini Advanced：$19.99/月
- API定价：
  - 输入：$0.00025/1K tokens
  - 输出：$0.0005/1K tokens
  - 图像：$0.002/张
- 免费配额：每月100万tokens`,
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
      guideContent: `# Notion AI 使用指南

## 📖 简介

Notion AI 深度集成在 Notion 工作空间中，将AI能力与知识管理完美结合，提供情境化的智能协助。

## ✨ 核心功能

### 1. 智能写作
- 文章大纲生成
- 段落扩展和精简
- 语气和风格调整
- 语法和拼写检查

### 2. 内容总结
- 长文档关键点提取
- 会议记录总结
- 研究材料概括
- 行动项提取

### 3. 知识问答
- 基于工作空间的问答
- 跨页面信息检索
- 关联内容发现
- 智能搜索增强

### 4. 创意工具
- 头脑风暴助手
- 创意写作提示
- 内容ideation
- SWOT分析生成

## 🔧 使用场景

### 1. 项目管理
- 自动生成任务列表
- 项目计划模板
- 风险评估分析
- 进度报告撰写

### 2. 知识库建设
- 文档标准化
- 自动分类标签
- 相关内容链接
- FAQ生成

### 3. 团队协作
- 会议议程准备
- 决策文档起草
- 团队周报汇总
- 知识共享优化

### 4. 个人效率
- 日记反思总结
- 学习笔记整理
- 目标规划分解
- 习惯追踪分析

## 💡 高级技巧

1. **自定义指令**
   - 设置写作风格偏好
   - 定义专业术语
   - 创建模板提示
   - 保存常用指令

2. **AI blocks**
   - 摘要块自动更新
   - 动态内容生成
   - 条件化显示
   - 数据驱动内容

3. **工作流自动化**
   - AI触发的自动化
   - 批量内容处理
   - 定期报告生成
   - 智能提醒设置

## 🎯 最佳实践

- **上下文利用**：充分利用页面关系
- **迭代优化**：多次调整获得最佳结果
- **模板思维**：创建可复用的AI模板
- **协作规范**：团队统一AI使用标准

## 💰 定价

- 基础功能：包含在Notion付费计划中
- AI附加包：$10/成员/月
- 使用限制：
  - Plus：无限次使用
  - 免费版：每月20次
- 团队优惠：批量授权折扣`,
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
      guideContent: `# DeepL 使用指南

## 📖 简介

DeepL 凭借先进的神经网络技术，提供业界最准确的翻译服务，同时推出的Write功能帮助用户提升写作质量。

## 🌍 核心功能

### 1. 精准翻译
- 支持31种语言
- 保持语境和语气
- 识别专业术语
- 处理方言和俚语

### 2. DeepL Write
- 语法和拼写检查
- 句子重构建议
- 语气调整选项
- 清晰度优化

### 3. 文档翻译
- Word、PowerPoint、PDF
- 保持原始格式
- 批量处理能力
- CAT工具集成

### 4. 术语库
- 自定义词汇表
- 团队共享术语
- 行业特定词库
- 版本控制

## 🔧 专业功能

### 1. API集成
```python
import deepl

translator = deepl.Translator("YOUR-API-KEY")
result = translator.translate_text(
    "Hello world", 
    target_lang="ZH"
)
```

### 2. CAT工具支持
- SDL Trados插件
- MemoQ集成
- Phrase兼容
- XLIFF格式支持

### 3. 数据安全
- 文本加密传输
- 即时删除选项
- GDPR合规
- ISO 27001认证

## 💡 使用技巧

1. **上下文优化**
   - 提供完整句子
   - 包含背景信息
   - 使用专业模式
   - 检查替代译文

2. **术语一致性**
   - 创建项目词汇表
   - 定期更新术语库
   - 团队审核机制
   - 导入TMX文件

3. **格式保留**
   - 使用文档翻译功能
   - 检查特殊字符
   - 验证链接完整性
   - 保持版式一致

## 🎯 应用场景

- 国际商务沟通
- 学术论文翻译
- 技术文档本地化
- 营销内容翻译
- 法律文件处理
- 多语言客服

## 🚀 DeepL Write特色

- **即时改进**：实时写作建议
- **多种风格**：正式/非正式切换
- **简洁表达**：冗余内容识别
- **专业润色**：商务文档优化

## 💰 定价

### 翻译服务
- 免费版：5,000字符/次
- Pro版：$8.74/月起
  - 无限文本翻译
  - 文档翻译
  - 术语库功能

### API定价
- $25/百万字符
- 免费试用：500,000字符

### 团队方案
- 自定义定价
- 集中管理
- 优先支持
- SLA保证`,
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
      guideContent: `# Jasper AI 使用指南

## 📖 简介

Jasper AI 是专为营销团队和内容创作者设计的AI平台，提供品牌一致性的内容生成和优化工具。

## 📝 核心功能

### 1. 营销文案生成
- Facebook/Google广告文案
- 产品描述优化
- 销售邮件模板
- 登陆页文案

### 2. 长篇内容创作
- SEO优化博客文章
- 白皮书和电子书
- 案例研究
- 新闻稿撰写

### 3. 品牌声音
- 自定义品牌指南
- 语气一致性保持
- 风格指南执行
- 术语规范管理

### 4. 内容优化
- SEO关键词集成
- 可读性评分
- 情感分析
- A/B测试建议

## 🔧 工作流功能

### 1. 模板库
- 50+预设模板
- 自定义模板创建
- 行业特定模板
- 多语言支持

### 2. 协作工具
- 团队工作空间
- 评论和批注
- 版本历史
- 审批流程

### 3. 集成能力
- Chrome扩展
- WordPress插件
- Grammarly集成
- Surfer SEO连接

## 💡 最佳实践

### 1. 内容策略
```
1. 定义目标受众
2. 设置品牌声音
3. 创建内容日历
4. 批量生成优化
```

### 2. SEO优化流程
- 关键词研究
- 竞争对手分析
- 内容结构优化
- 元描述生成

### 3. 转化优化
- 标题A/B测试
- CTA按钮文案
- 紧迫感营造
- 社会证明整合

## 🎯 使用场景

### 营销团队
- 广告活动文案
- 社交媒体日历
- 邮件营销序列
- 内容营销策略

### 电商业务
- 产品描述批量生成
- 类目页面优化
- 客户评价回复
- 促销活动文案

### 内容机构
- 客户项目管理
- 多品牌内容创作
- 报告自动生成
- 绩效分析

## 🚀 AI特色功能

- **Boss Mode**：长文档AI写作
- **Recipes**：自动化工作流
- **Commands**：自然语言指令
- **Chat**：交互式内容创作

## 💰 定价方案

### Creator
- $39/月
- 1个用户
- 50+模板
- 基础功能

### Teams
- $99/月
- 3个用户
- 品牌声音
- 协作功能

### Business
- 定制价格
- 无限用户
- API访问
- 专属支持

年付优惠：20%折扣`,
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
      guideContent: `# Runway Gen-3 使用指南

## 📖 简介

Runway Gen-3 是领先的AI视频创作平台，为创意专业人士提供突破性的视频生成和编辑工具。

## 🎬 核心功能

### 1. 文本到视频
- 4K分辨率输出
- 10秒视频生成
- 电影级质量
- 精确动作控制

### 2. 图像动画化
- 静态图片变视频
- 自定义运动轨迹
- 表情和姿态控制
- 背景动态效果

### 3. 视频编辑AI
- 智能抠像
- 背景替换
- 对象移除
- 超分辨率

### 4. 风格转换
- 艺术风格迁移
- 实时滤镜
- 色彩分级
- 时代风格转换

## 🔧 专业工具

### 1. Magic Tools套件
- **Gen-3 Alpha**：最新视频生成
- **Motion Brush**：局部动画
- **Infinite Image**：图像扩展
- **Frame Interpolation**：补帧

### 2. 控制选项
```
Camera Controls:
- Pan, Zoom, Rotate
- Depth of Field
- Motion Blur
- Speed Ramping
```

### 3. 批处理
- 多任务队列
- 预设保存
- 批量导出
- 云端渲染

## 💡 创作技巧

### 1. 提示词优化
- 运动描述词
- 摄影术语
- 情绪氛围
- 技术参数

### 2. 工作流程
1. 概念设计
2. 关键帧规划
3. AI生成
4. 后期调整

### 3. 质量控制
- 多次生成选最佳
- 分段制作长视频
- 保持风格一致性
- 细节手动修正

## 🎯 应用领域

### 影视制作
- 概念预览
- 特效镜头
- 场景扩展
- 预告片制作

### 广告创意
- 产品展示视频
- 社交媒体广告
- 动态海报
- 品牌视频

### 内容创作
- YouTube视频
- 短视频内容
- 教育动画
- 音乐MV

## 🚀 Gen-3特色

- **多模态理解**：文本+图像输入
- **时间一致性**：流畅自然的动作
- **高保真输出**：电影级画质
- **创意控制**：精确的艺术指导

## 💰 定价计划

### Basic
- $12/月
- 125代币
- 标准分辨率
- 基础工具

### Standard
- $28/月
- 625代币
- 4K分辨率
- 全部工具

### Pro
- $76/月
- 2250代币
- 优先处理
- 批量导出

### Unlimited
- $550/月
- 无限生成
- 专属支持
- API访问

*1代币 ≈ 1秒视频生成*`,
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
      guideContent: `# Claude Pro 使用指南

## 📖 简介

Claude Pro 是 Anthropic 提供的高级订阅服务，为专业用户提供更强大的AI能力和更好的使用体验。

## 🎓 Pro版优势

### 1. 使用量提升
- 5倍更多消息数
- 更少的速率限制
- 高峰期优先访问
- 连续对话能力

### 2. 新功能优先体验
- Claude 3.5最新版本
- 实验性功能测试
- 专属功能预览
- 反馈优先响应

### 3. 性能优化
- 更快的响应时间
- 更稳定的连接
- 优先GPU资源
- 批量处理能力

### 4. 专业工具
- 项目组织功能
- 自定义指令
- 导出功能增强
- API优先配额

## 💡 Pro版特色功能

### 1. Projects（项目）
- 知识库管理
- 上下文保存
- 团队协作
- 版本控制

### 2. Custom Instructions
```
设置持久性指令：
- 角色定义
- 输出格式
- 专业领域
- 偏好设置
```

### 3. 增强分析
- 更大文件上传
- 复杂数据处理
- 可视化生成
- 批量分析

## 🔧 专业应用

### 研究工作
- 文献综述
- 数据分析
- 假设验证
- 报告撰写

### 软件开发
- 代码审查
- 架构设计
- 调试协助
- 文档生成

### 内容创作
- 长篇写作
- 多稿件管理
- 风格一致性
- SEO优化

### 商业分析
- 市场研究
- 竞品分析
- 策略规划
- 预测建模

## 🎯 使用技巧

1. **项目管理**
   - 为不同任务创建项目
   - 上传相关文档
   - 保持上下文连贯
   - 定期整理归档

2. **效率最大化**
   - 使用自定义指令
   - 创建提示模板
   - 批量处理任务
   - 键盘快捷键

3. **质量控制**
   - 多轮迭代优化
   - 交叉验证答案
   - 保存最佳结果
   - 建立质量标准

## 🚀 即将推出

- 团队协作空间
- 更多集成选项
- 高级API功能
- 企业级管理

## 💰 订阅详情

### Claude Pro
- **价格**：$20/月
- **使用量**：5倍于免费版
- **优先级**：高峰期优先
- **功能**：全部专业功能

### 对比免费版
| 功能 | 免费版 | Pro版 |
|------|--------|-------|
| 消息限制 | 较低 | 5倍提升 |
| 新功能 | 延迟 | 优先体验 |
| 响应速度 | 标准 | 优先处理 |
| 文件上传 | 有限 | 增强 |

### 付款方式
- 信用卡/借记卡
- 月付或年付
- 随时取消
- 比例退款`,
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
      guideContent: `# Bing Chat Enterprise 使用指南

## 📖 简介

Bing Chat Enterprise 是微软为企业用户打造的安全AI助手，结合了GPT-4的能力与必应搜索，提供实时、准确的信息。

## 🔎 核心功能

### 1. 智能搜索集成
- 实时网络信息
- 引用来源链接
- 多轮搜索优化
- 垂直搜索能力

### 2. 多模态交互
- 图像理解分析
- 图表数据提取
- 视觉问答
- 图像生成(DALL-E)

### 3. 企业级安全
- 数据不用于训练
- 符合合规要求
- 单点登录(SSO)
- 审计日志

### 4. Office集成
- Word文档助手
- Excel数据分析
- PowerPoint设计
- Outlook邮件优化

## 🔧 商业功能

### 1. 数据分析
```
示例查询：
"分析这份销售报表的趋势"
"对比去年同期数据"
"生成执行摘要"
```

### 2. 市场研究
- 竞争对手分析
- 行业趋势报告
- 客户洞察
- 产品定位建议

### 3. 内容创作
- 商业提案撰写
- 营销文案生成
- 技术文档编写
- 多语言翻译

## 💡 使用技巧

### 1. 搜索优化
- 使用具体问题
- 要求最新信息
- 指定信息来源
- 验证关键数据

### 2. 提示词模板
```
商业分析模板：
"作为[角色]，分析[主题]，
重点关注[方面]，
提供[输出格式]"
```

### 3. 工作流集成
- Edge侧边栏使用
- 快捷键操作
- 收藏常用提示
- 导出对话历史

## 🎯 企业应用

### 销售支持
- 客户资料研究
- 提案定制化
- 竞品对比分析
- 定价策略建议

### 人力资源
- 简历筛选辅助
- 面试问题生成
- 培训材料创建
- 政策文档解释

### IT支持
- 技术问题诊断
- 代码错误分析
- 文档查询
- 安全建议

### 财务分析
- 报表解读
- 趋势预测
- 风险评估
- 合规检查

## 🚀 独特优势

- **实时性**：搜索结果始终最新
- **可靠性**：提供信息来源
- **安全性**：企业数据保护
- **集成性**：Microsoft 365生态

## 💰 定价模式

### Microsoft 365 E3/E5
- 包含Bing Chat Enterprise
- 无额外费用
- 完整功能访问
- 企业级支持

### 独立许可
- $5/用户/月
- 适用于其他订阅用户
- 相同功能集
- 灵活扩展

### 功能对比
| 功能 | 个人版 | 企业版 |
|------|--------|--------|
| 数据保护 | 基础 | 企业级 |
| 使用限制 | 有限制 | 更高配额 |
| 管理功能 | 无 | 完整 |
| 技术支持 | 社区 | 专业 |`,
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
      guideContent: `# Cohere Command R+ 使用指南

## 📖 简介

Cohere Command R+ 是专为企业级应用设计的大语言模型，在检索增强生成(RAG)和工具使用方面表现卓越，支持10种语言。

## 🌐 核心优势

### 1. RAG专家
- 优化的检索性能
- 引文生成能力
- 长上下文理解
- 降低幻觉率

### 2. 多语言能力
- 10种语言原生支持
- 跨语言检索
- 文化感知响应
- 统一API接口

### 3. 工具调用
- 函数调用支持
- 多工具协调
- 错误处理
- 状态管理

### 4. 企业特性
- 本地部署选项
- 数据隐私保证
- SLA承诺
- 定制化训练

## 🔧 技术特性

### 1. 模型规格
```python
# 使用示例
import cohere
co = cohere.Client('YOUR_API_KEY')

response = co.chat(
    model="command-r-plus",
    message="分析这份文档",
    documents=[...],
    temperature=0.3
)
```

### 2. RAG实现
- 自动分块策略
- 相关性评分
- 引用链接
- 答案置信度

### 3. 性能指标
- 128K token上下文
- 低延迟响应
- 高吞吐量
- 成本效益

## 💡 最佳实践

### 1. RAG优化
```python
# 检索增强示例
response = co.chat(
    message="基于文档回答问题",
    documents=documents,
    citation_quality="accurate",
    temperature=0.1
)
```

### 2. 多语言处理
- 统一提示模板
- 语言自动检测
- 跨语言搜索
- 本地化输出

### 3. 工具集成
- API封装
- 错误重试
- 日志记录
- 监控指标

## 🎯 应用场景

### 企业知识库
- 内部文档检索
- FAQ自动回答
- 知识图谱构建
- 智能推荐

### 客户服务
- 多语言支持
- 意图识别
- 情感分析
- 个性化响应

### 数据分析
- 报告生成
- 指标解释
- 趋势分析
- 异常检测

### 开发辅助
- 代码理解
- API文档查询
- 调试建议
- 最佳实践

## 🚀 独特功能

### 1. Coral知识助手
- 企业数据连接
- 安全搜索
- 团队协作
- 审计追踪

### 2. 嵌入模型
- 多语言嵌入
- 语义搜索
- 聚类分析
- 相似度计算

### 3. 分类器
- 意图分类
- 情感分析
- 主题提取
- 垃圾检测

## 💰 定价策略

### API定价
- **Input**: $0.5/M tokens
- **Output**: $1.5/M tokens
- 显著低于竞品
- 无隐藏费用

### 企业方案
- 批量折扣
- 专属部署
- SLA保证
- 技术支持

### 对比优势
| 模型 | 输入价格 | RAG性能 | 多语言 |
|------|----------|---------|--------|
| Command R+ | $0.5/M | 优秀 | 10语言 |
| GPT-4 | $30/M | 良好 | 多语言 |
| Claude 3 | $3/M | 良好 | 多语言 |`,
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
      guideContent: `# Whisper AI 使用指南

## 📖 简介

Whisper 是 OpenAI 开源的自动语音识别(ASR)系统，通过68万小时多语言数据训练，达到接近人类的转录准确率。

## 🎙️ 核心功能

### 1. 多语言转录
- 支持99种语言
- 自动语言检测
- 方言识别
- 混合语言处理

### 2. 实时翻译
- 任意语言→英语
- 保持语义准确
- 口语化处理
- 时间戳对齐

### 3. 高级特性
- 说话人分离
- 标点符号恢复
- 专有名词识别
- 背景噪声过滤

### 4. 模型变体
- Tiny: 10MB (快速)
- Base: 25MB
- Small: 100MB
- Medium: 300MB
- Large: 1GB (最准确)

## 🔧 使用方法

### 1. 本地部署
```python
import whisper

# 加载模型
model = whisper.load_model("base")

# 转录音频
result = model.transcribe("audio.mp3")
print(result["text"])

# 带时间戳
for segment in result["segments"]:
    print(f"[{segment['start']} - {segment['end']}] {segment['text']}")
```

### 2. API调用
```python
# OpenAI API
from openai import OpenAI
client = OpenAI()

audio_file = open("speech.mp3", "rb")
transcript = client.audio.transcriptions.create(
  model="whisper-1",
  file=audio_file,
  response_format="verbose_json"
)
```

### 3. 命令行工具
```bash
# 基础转录
whisper audio.mp3 --model medium

# 翻译为英语
whisper audio.mp3 --task translate

# 指定语言
whisper audio.mp3 --language Chinese
```

## 💡 优化技巧

### 1. 模型选择
- **实时应用**: Tiny/Base
- **准确优先**: Large
- **平衡选择**: Small/Medium
- **GPU加速**: fp16精度

### 2. 预处理
- 音频降噪
- 采样率16kHz
- 单声道转换
- 音量标准化

### 3. 后处理
- 文本纠错
- 格式规范化
- 专有名词替换
- 敏感信息过滤

## 🎯 应用场景

### 会议记录
- 实时转录
- 多人识别
- 要点提取
- 行动项标记

### 内容创作
- 播客转文字
- 视频字幕
- 采访整理
- 课程笔记

### 辅助功能
- 听障辅助
- 语言学习
- 实时翻译
- 语音命令

### 数据处理
- 客服录音分析
- 医疗记录转录
- 法律文书整理
- 市场调研分析

## 🚀 集成方案

### 1. 实时转录系统
- WebSocket流式传输
- 分块处理
- 缓冲区管理
- 低延迟输出

### 2. 批处理pipeline
- 队列管理
- 并行处理
- 错误重试
- 结果存储

### 3. 边缘部署
- 模型量化
- ONNX转换
- 移动端优化
- 离线工作

## 💰 成本分析

### 开源自托管
- **硬件成本**: GPU服务器
- **运维成本**: 人力维护
- **优势**: 数据隐私，无限使用

### API服务
- **价格**: $0.006/分钟
- **优势**: 无需维护，按需付费
- **限制**: 文件大小25MB

### 对比表
| 方案 | 成本 | 性能 | 灵活性 |
|------|------|------|--------|
| 自托管 | 高(一次性) | 可控 | 高 |
| API | 低(按用量) | 稳定 | 中 |
| 混合 | 中 | 高 | 高 |`,
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
      guideContent: `# Copilot for Microsoft 365 使用指南

## 📖 简介

Copilot for Microsoft 365 将大语言模型的能力与您的工作数据结合，在您最常用的办公应用中提供智能协助。

## 📊 应用集成

### 1. Word中的Copilot
- 初稿生成和重写
- 文档总结提炼
- 格式和风格调整
- 引用和脚注管理

### 2. Excel中的Copilot
- 数据分析洞察
- 公式推荐生成
- 图表自动创建
- 趋势预测分析

### 3. PowerPoint中的Copilot
- 演示文稿生成
- 设计建议优化
- 内容自动排版
- Speaker notes创建

### 4. Outlook中的Copilot
- 邮件智能撰写
- 会议纪要总结
- 日程安排优化
- 跟进提醒设置

## 🔧 高级功能

### 1. Business Chat
```
跨应用查询示例：
"总结本周所有关于项目X的邮件、
会议和文档，生成进度报告"
```

### 2. 智能模板
- 基于历史创建
- 公司风格学习
- 多语言支持
- 品牌一致性

### 3. 协作增强
- 实时建议
- 版本对比
- 评论总结
- 任务分配

## 💡 使用技巧

### Word技巧
1. **长文档处理**
   - "/总结" 快速概括
   - "/重写" 改变语气
   - "/扩展" 详细说明

2. **创作辅助**
   - 提供大纲生成全文
   - 指定受众调整内容
   - 多版本快速迭代

### Excel技巧
1. **数据分析**
   - "分析这些数据的趋势"
   - "创建月度对比图表"
   - "找出异常值"

2. **公式助手**
   - 自然语言描述需求
   - 复杂公式解释
   - 错误诊断修复

### PowerPoint技巧
1. **快速创建**
   - Word文档转演示
   - 主题自动应用
   - 图片智能配置

2. **设计优化**
   - 版式自动调整
   - 配色方案建议
   - 动画效果推荐

## 🎯 业务场景

### 报告编写
- 数据自动汇总
- 可视化生成
- 结论提炼
- 格式标准化

### 会议准备
- 议程自动生成
- 背景资料整理
- 决策点标注
- 后续行动规划

### 项目管理
- 进度报告生成
- 风险识别分析
- 资源分配建议
- 里程碑追踪

### 客户沟通
- 个性化邮件
- 提案快速定制
- 反馈总结分析
- 关系维护提醒

## 🚀 独特优势

- **深度集成**：原生嵌入Office
- **上下文感知**：理解工作数据
- **安全合规**：企业级数据保护
- **持续学习**：适应组织需求

## 💰 许可定价

### 商业版
- $30/用户/月
- 需要M365 E3/E5
- 全功能访问
- 管理员控制

### 功能包含
- 所有Office应用
- Business Chat
- 企业数据连接
- 安全和合规

### ROI价值
- 节省70%文档时间
- 提升50%分析效率
- 减少60%会议准备
- 改善80%邮件质量

*需要Microsoft 365 E3/E5基础许可*`,
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
      guideContent: `# Adobe Firefly 使用指南

## 📖 简介

Adobe Firefly 是专为创意专业人士设计的生成式AI，确保商业使用安全，与Creative Cloud深度集成。

## 🔥 核心功能

### 1. 文本到图像
- 商业安全内容
- 高分辨率输出
- 风格参考
- 品牌一致性

### 2. 生成填充
- 智能扩展画布
- 对象移除/添加
- 背景替换
- 无缝修复

### 3. 文字效果
- 3D文字生成
- 纹理应用
- 风格化处理
- 动态效果

### 4. 生成重新着色
- 矢量图重新配色
- 调色板生成
- 季节性变体
- 品牌色彩应用

## 🔧 Creative Cloud集成

### 1. Photoshop集成
```
生成式填充工作流：
1. 选择区域
2. 输入提示词
3. 选择生成结果
4. 精细调整
```

### 2. Illustrator集成
- 矢量图形生成
- 图案创建
- 配色方案
- 图标设计

### 3. Express集成
- 模板定制
- 快速设计
- 社交媒体素材
- 品牌套件

## 💡 专业特性

### 1. 内容凭证
- 创作者归属
- AI生成标记
- 编辑历史
- 真实性验证

### 2. 商业许可
- 完整商业权利
- 无版权风险
- 企业级保障
- 法律合规

### 3. 品牌管理
- 上传品牌资产
- 风格指南遵循
- 一致性保证
- 批量生成

## 🎯 应用场景

### 营销设计
- 广告素材生成
- 产品效果图
- 包装设计迭代
- 活动视觉

### 内容创作
- 博客配图
- 社交媒体图像
- 电子书插图
- 演示文稿素材

### 产品设计
- 概念可视化
- 原型制作
- 材质探索
- 配色测试

### 品牌设计
- Logo变体
- VI系统扩展
- 营销物料
- 季节性设计

## 🚀 独特优势

### 1. 训练数据
- Adobe Stock
- 公开许可内容
- 版权已过期作品
- 无争议来源

### 2. 创作者友好
- 不使用用户作品训练
- 支持"Do Not Train"标签
- 创作者补偿计划
- 透明度承诺

### 3. 企业功能
- SSO单点登录
- 团队协作
- 资产管理
- 使用分析

## 💰 定价方案

### 免费版
- 每月25个生成积分
- 基础功能
- 水印输出
- 个人使用

### Premium版
- $4.99/月
- 100个生成积分
- 无水印
- 商业授权
- Adobe字体

### Creative Cloud
- 包含在订阅中
- 无限生成积分
- 全部功能
- 深度集成

### 企业版
- 定制定价
- 集中管理
- API访问
- 专属支持

## 🎨 最佳实践

1. **提示词优化**
   - 具体描述风格
   - 参考艺术流派
   - 包含技术细节
   - 迭代改进

2. **工作流集成**
   - 结合传统工具
   - 保持原始文件
   - 建立命名规范
   - 版本控制

3. **品质控制**
   - 多次生成选择
   - 手动精修细节
   - 保持风格统一
   - 定期审查输出`,
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