const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const aiProducts = [
  {
    name: "Manus AI",
    description: "世界首个通用AI智能体，能够将想法转化为行动。支持自主任务执行、多智能体架构，在GAIA基准测试中表现优异。",
    tags: "AI智能体,自动化,任务执行,多模态",
    manager: "Monica.im团队", 
    homepage: "https://manus.im",
    icon: "🤖",
    guideContent: `# Manus AI 使用指南

## 📖 简介

Manus AI 是世界首个通用AI智能体，由Monica.im开发，能够将想法转化为实际行动。与传统聊天机器人不同，Manus AI不仅提供建议，还能直接交付完整的任务结果。

## 🚀 核心功能

### 1. 自主任务执行
- 系统性规划和执行任务，主动调用各种工具
- 端到端完成复杂任务，无需持续监督
- 拥有独立的计算环境，可独立工作

### 2. 多智能体架构
- 结合多个AI模型独立处理任务
- 研究、分析数据、生成报告、自动化工作流
- 编写和部署代码

### 3. 专业能力
- 旅行规划
- 股票分析
- 内容创作
- 房产购买
- 游戏编程
- 合同分析
- 财务报表处理

## 💡 使用技巧

1. **明确任务描述**：详细描述你想要完成的任务
2. **提供背景信息**：分享相关的上下文和约束条件
3. **利用透明功能**：使用"Manus的电脑"功能查看执行步骤
4. **回放学习**：通过时间轴回放功能学习任务处理过程

## 📊 性能表现

- 在GAIA基准测试中实现SOTA性能
- 人类GAIA测试得分92%，GPT-4插件版仅15%
- Manus AI显著超越当前先进模型

## 🔧 访问方式

- 目前处于私测阶段，需要邀请码
- 计划推出开源组件
- 服务器限制可能延迟完全公开发布

## ⚠️ 注意事项

- 当前仅限邀请制访问
- 新增的幻灯片功能备受专业人士赞誉
- 支持Google Slides导出`,
    enabled: true,
    themeColor: "#6366f1"
  },
  {
    name: "Gemini CLI",
    description: "Google开源的AI终端工具，直接在命令行中使用Gemini AI。支持代码编写、调试、项目管理，具有多模态能力和扩展性。",
    tags: "命令行工具,开发工具,Google,开源",
    manager: "Google团队",
    homepage: "https://github.com/google-gemini/gemini-cli",
    icon: "💻",
    guideContent: `# Gemini CLI 使用指南

## 📖 简介

Gemini CLI 是Google开发的开源AI智能体，将Gemini的强大功能直接带入终端。于2025年6月发布，专为开发者设计的命令行AI助手。

## 🚀 核心功能

### 1. 编程助手
- 代码编写和调试
- 项目管理
- 文档查询
- 代码解释
- 测试覆盖率改进

### 2. 多模态能力
- 从PDF或草图生成新应用
- 使用Veo 3模型创建视频
- Deep Research代理生成研究报告
- 实时Google搜索集成

### 3. 扩展性
- 基于模型上下文协议(MCP)标准
- 连接外部服务和添加新功能
- 支持工具和MCP服务器

## 💰 定价方案

### 免费套餐
- 每分钟60个模型请求
- 每天1000个请求
- 支持Gemini 2.5 Pro（100万token上下文窗口）
- 使用个人Google账户免费登录

### 企业选项
- Google AI Studio或Vertex AI密钥
- 基于使用量计费
- Gemini Code Assist标准版或企业版许可

## 🔧 技术特性

### 平台支持
- Mac、Linux（包括ChromeOS）、Windows
- Windows版本原生支持，无需WSL

### 安全功能
- 本地代理，内置安全措施
- 命令执行需要明确用户确认
- 支持"允许一次"、"始终允许"或拒绝操作
- macOS原生沙盒支持
- 其他平台支持容器（Podman/Docker）

### 配置
- 使用gemini.md文件配置
- 自动保存上下文信息

## 💡 使用技巧

1. **项目配置**：在项目根目录创建gemini.md配置文件
2. **命令确认**：留意命令执行确认提示
3. **上下文利用**：充分利用100万token的上下文窗口
4. **工具集成**：连接MCP服务器扩展功能
5. **自动化脚本**：使用非交互式脚本模式

## 🎯 使用场景

- CI/CD工作流自动化
- 大型代码库查询和编辑
- Pull request查询处理
- 复杂的代码重构
- 操作任务自动化

## ⚠️ 注意事项

- 目前处于预览阶段
- 开源Apache 2.0许可证
- 与VS Code和Gemini Code Assist集成`,
    enabled: true,
    themeColor: "#4285f4"
  },
  {
    name: "OpenRouter",
    description: "统一AI API网关，通过单一端点访问400+个AI模型。支持自动故障转移、成本优化，无需管理多个API。",
    tags: "API网关,多模型,成本优化,开发工具",
    manager: "OpenRouter团队",
    homepage: "https://openrouter.ai",
    icon: "🌐",
    guideContent: `# OpenRouter 使用指南

## 📖 简介

OpenRouter 是统一的AI API网关，提供对400+个AI模型的访问，包括OpenAI、Anthropic、Google、DeepSeek等主要提供商的模型。

## 🚀 核心功能

### 1. 统一API访问
- 通过单一标准化API端点访问数百个AI模型
- 完全兼容OpenAI API
- 无需管理多个提供商集成

### 2. 可靠性和性能
- 分布式基础设施，自动故障转移
- 边缘运行，仅增加约25ms延迟
- 智能负载均衡，提供更好的正常运行时间

### 3. 自定义提供商密钥
- 使用自己的提供商API密钥
- 保持OpenRouter的路由和故障转移功能

### 4. 数据保护
- 细粒度数据策略
- 确保提示仅发送到信任的模型和提供商

## 💰 定价策略

### 定价模式
- 按使用付费，无预付费用
- 从不对底层提供商定价加价
- 透明的定价结构
- 支持按需付费和订阅计划

### 信用系统
- 信用是OpenRouter上的预存款
- 用于LLM推理时从信用中扣除费用
- 每个模型和提供商价格不同

### 动态定价
- 基于响应时间和价格选择最佳API
- 价格可能每小时变化

## 🎯 模型变体

### 动态变体
- \`:online\` - 运行查询提取网络结果
- \`:nitro\` - 按吞吐量排序，优化响应时间
- \`:floor\` - 按价格排序，优先最经济选项

## 💡 使用技巧

1. **账户设置**：创建账户并在信用页面添加信用
2. **API密钥**：创建API密钥并开始使用API
3. **模型选择**：根据需求选择合适的模型变体
4. **监控使用**：使用活动仪表板监控实时使用指标
5. **成本优化**：利用动态路由获得最佳性价比

## 📊 监控和管理

- 实时使用指标
- 最近30天的token使用和成本报告
- 透明的定价结构

## 🔧 开始使用

1. 创建账户
2. 添加信用
3. 使用聊天室或创建API密钥
4. 开始使用API

## ⚠️ 注意事项

- Token计数在不同模型间可能有差异
- 成本按使用模型的分词器计算和计费
- 提供商可能会根据性能和价格动态选择`,
    enabled: true,
    themeColor: "#00d4aa"
  },
  {
    name: "Grok AI",
    description: "由xAI开发的AI助手，能回答其他AI拒绝的敏感问题。Grok 4在多项基准测试中表现领先，支持实时搜索和多模态功能。",
    tags: "AI助手,实时搜索,多模态,xAI",
    manager: "Elon Musk / xAI",
    homepage: "https://x.ai",
    icon: "🚀",
    guideContent: `# Grok AI 使用指南

## 📖 简介

Grok是由Elon Musk的xAI公司开发的AI助手和聊天机器人。Grok能够访问实时信息，通过网络和X平台获取最新数据，并愿意回答其他AI系统通常拒绝的"敏感"问题。

## 🚀 最新版本：Grok 4

### 核心功能
- 被称为"世界上最智能的AI"
- 完美SAT成绩和近乎完美的GRE成绩
- 在"人类最后考试"中得分25.4%，超越Gemini 2.5 Pro(21.6%)和OpenAI o3(21%)

### 技术特性
1. **工具集成**：原生工具使用和实时搜索集成
2. **语音和视觉**：Grok Vision、多语言音频、实时语音模式
3. **多智能体系统**：Grok 4 Heavy支持多个智能体同时工作

## 💰 定价方案

### 免费访问
- 所有X用户免费使用基础版本
- 有查询限制和功能限制

### X Premium订阅
- X Premium：$7/月（年付）或 $8/月（月付）
- X Premium+：$32.92/月（年付）或 $40/月（月付）

### SuperGrok套餐
- SuperGrok：$30/月（单智能体版本）
- SuperGrok Heavy：$300/月（多智能体版本）

## 🎯 访问方式

### 多平台支持
- X平台免费访问
- Grok.com官网
- Grok移动应用
- xAI API

### 使用限制
- 免费用户有查询限制
- Premium用户获得更高使用限制
- SuperGrok用户享受优先权限

## 💡 特色功能

### 1. Grok Vision
- 使用设备摄像头分析真实世界
- 识别文本、物体和环境
- 提供即时上下文和信息

### 2. 实时搜索
- 通过X平台获取实时信息
- 网络搜索集成
- 最新事件和新闻更新

### 3. 无审查对话
- 回答敏感或争议性问题
- "反觉醒"立场
- 不同于其他AI的保守回答策略

## 🔧 使用技巧

1. **充分利用实时性**：询问最新事件和趋势
2. **探索敏感话题**：Grok愿意讨论其他AI回避的话题
3. **使用视觉功能**：通过Grok Vision分析图像和环境
4. **多智能体协作**：Heavy版本可让多个智能体协同工作
5. **API集成**：开发者可通过xAI API集成Grok

## 📊 性能表现

- 在多项基准测试中表现领先
- 人文、科学、数学等领域全面优秀
- 实时信息处理能力突出

## 🎖️ 最新发展

- 2025年7月获得美国国防部2亿美元合同
- 帮助政府服务提高效率
- 与OpenAI、Google、Anthropic直接竞争

## ⚠️ 注意事项

- 敏感问题回答可能包含争议性内容
- 需要X账户才能使用完整功能
- SuperGrok Heavy价格较高，适合企业用户
- 实时信息可能需要验证准确性`,
    enabled: true,
    themeColor: "#1d9bf0"
  },
  {
    name: "Windsurf",
    description: "世界首个AI原生IDE，具有深度代码库理解和实时协作能力。支持多文件编辑、自主执行脚本、测试和调试。",
    tags: "IDE,AI编程,代码编辑,智能体",
    manager: "Codeium团队", 
    homepage: "https://windsurf.com",
    icon: "🏄‍♂️",
    guideContent: `# Windsurf IDE 使用指南

## 📖 简介

Windsurf 是世界首个AI原生IDE，专为开发者和企业设计的最先进AI编程助手。让开发者保持在最佳工作状态，提供无缝的AI协作体验。

## 🚀 核心功能

### 1. Cascade技术
- 深度代码库理解
- 广泛的高级工具
- 实时感知开发者操作
- 强大、无缝的协作流程

### 2. Windsurf Tab（超级补全）
- 上下文感知的自动补全
- 完整函数补全，包括文档字符串
- 一键触发，无限可能

### 3. 多文件编辑
- 保持上下文完整性
- 在多个文件间工作不丢失状态
- 简化复杂项目开发

### 4. 智能体能力
- AI自主创建文件
- 执行脚本、测试和调试
- 最少输入，最大输出

### 5. 实时协作
- Flows - 实时同步AI助手
- 理解项目上下文
- 有效协作

## 💰 定价方案

### 免费套餐
- 免费试用，有限制信用

### Ultimate计划
- $60/月
- 无限用户提示
- 3000个Flow操作
- 优先AI协助

### 团队和企业计划
- 定制解决方案
- 团队范围AI协作
- 企业级功能

## 🎯 核心优势

### 1. 用户体验
- Product Hunt评分4.9/5
- 出色的AI集成和易用性
- 比竞争对手更好的工作流程

### 2. 开发者友好
- 理想的前端和全栈开发
- 基于图像的HTML/CSS生成
- 实时预览功能

### 3. 隐私优先
- 零训练非许可数据
- 传输加密
- 可选零日数据保留

## 💡 使用技巧

1. **充分利用Cascade**：让AI理解整个项目上下文
2. **多文件协作**：同时编辑多个相关文件
3. **Flows功能**：使用实时协作进行复杂任务
4. **Vision功能**：从图像生成UI代码
5. **信用管理**：合理管理AI提示和流程信用

## 🔧 开始使用

1. 下载Windsurf Editor
2. 创建项目或导入现有项目
3. 使用Windsurf Tab进行智能补全
4. 启用Flows进行AI协作
5. 利用Cascade技术优化工作流程

## 📊 与竞争对手比较

### 优势
- 比Cursor和Copilot流程更流畅
- AI不会陷入循环
- 更好的多文件处理
- 强大的图像到代码功能

### 注意事项
- 偶尔的性能稳定性问题
- 服务器超时情况
- 基于信用的定价可能限制重度使用

## 🎖️ 最新发展

**重要消息**：2025年7月17日，Cognition已与Windsurf达成收购协议，这对Google和OpenAI有重要影响。

## ⚠️ 使用建议

- 适合需要深度AI集成的开发者
- 特别适合前端和UI开发
- 重度用户需要注意信用消耗
- 关注性能稳定性更新`,
    enabled: true,
    themeColor: "#0ea5e9"
  }
]

async function addAIProducts() {
  try {
    console.log('开始添加AI产品数据...')
    
    for (const product of aiProducts) {
      const existingAgent = await prisma.agent.findFirst({
        where: { name: product.name }
      })
      
      if (existingAgent) {
        console.log(`产品 "${product.name}" 已存在，跳过...`)
        continue
      }
      
      const agent = await prisma.agent.create({
        data: product
      })
      
      console.log(`✅ 成功添加: ${agent.name}`)
    }
    
    console.log('🎉 所有AI产品数据添加完成!')
    
    // 显示当前数据库中的所有agent
    const allAgents = await prisma.agent.findMany({
      select: { name: true, enabled: true }
    })
    
    console.log('\n📊 当前数据库中的所有AI产品:')
    allAgents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.name} ${agent.enabled ? '✅' : '❌'}`)
    })
    
  } catch (error) {
    console.error('❌ 添加数据时出错:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addAIProducts()