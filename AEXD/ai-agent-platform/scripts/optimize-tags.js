const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// 定义优化后的标签体系
const TAG_MAPPING = {
  // AI助手类 -> 统一为"AI助手"
  'AI助手': 'AI助手',
  'AI智能体': 'AI助手', 
  '智能体': 'AI助手',
  '通用': 'AI助手',
  
  // 编程开发类 -> 统一为"编程开发"
  '编程': '编程开发',
  'AI编程': '编程开发',
  '代码编辑': '编程开发',
  '代码补全': '编程开发',
  '调试': '编程开发',
  'IDE': '编程开发',
  '开发工具': '编程开发',
  '命令行工具': '编程开发',
  'Agent编排': '编程开发',
  
  // 内容创作类 -> 统一为"内容创作"
  '写作': '内容创作',
  '设计': '内容创作',
  '图像生成': '内容创作',
  '艺术': '内容创作',
  
  // 信息搜索类 -> 统一为"信息搜索"
  '搜索': '信息搜索',
  '实时搜索': '信息搜索',
  '研究': '信息搜索',
  '信息获取': '信息搜索',
  '问答': '信息搜索',
  
  // 效率工具类 -> 统一为"效率工具"
  '自动化': '效率工具',
  '任务执行': '效率工具',
  '知识管理': '效率工具',
  '笔记': '效率工具',
  
  // 技术平台类 -> 统一为"技术平台"
  'API网关': '技术平台',
  '多模型': '技术平台',
  '成本优化': '技术平台',
  '开源': '技术平台',
  
  // 多模态保持独立
  '多模态': '多模态',
  
  // 公司标签保持独立（但简化）
  'Google': 'Google',
  'xAI': 'xAI'
}

// 优化后的标签体系（6个核心分类）
const OPTIMIZED_TAGS = [
  'AI助手',      // 通用AI助手和智能体
  '编程开发',    // 所有编程相关工具
  '内容创作',    // 写作、设计、图像生成
  '信息搜索',    // 搜索、研究、问答
  '效率工具',    // 自动化、管理类工具
  '技术平台'     // API、开源、技术服务
]

// 特殊标签（多模态、公司标签）可以作为附加标签
const SPECIAL_TAGS = ['多模态', 'Google', 'xAI']

// 产品标签映射表
const PRODUCT_TAG_MAPPING = {
  'Claude Code': ['编程开发', 'AI助手'],
  'ChatGPT Plus': ['AI助手', '内容创作'],
  'Midjourney': ['内容创作', '多模态'],
  'Cursor IDE': ['编程开发', 'AI助手'],
  'Perplexity AI': ['信息搜索', 'AI助手'],
  'Notion AI': ['效率工具', '内容创作'],
  'Manus AI': ['AI助手', '效率工具', '多模态'],
  'Gemini CLI': ['编程开发', 'Google'],
  'OpenRouter': ['技术平台', '编程开发'],
  'Grok AI': ['AI助手', '信息搜索', 'xAI'],
  'Windsurf': ['编程开发', 'AI助手']
}

async function optimizeTags() {
  try {
    console.log('🔄 开始优化标签体系...')
    
    // 获取所有产品
    const agents = await prisma.agent.findMany()
    
    console.log('\n📊 优化前后对比:')
    console.log('================')
    
    for (const agent of agents) {
      const oldTags = agent.tags.split(',').map(t => t.trim())
      const newTags = PRODUCT_TAG_MAPPING[agent.name] || ['AI助手'] // 默认标签
      
      console.log(`${agent.name}:`)
      console.log(`  优化前: ${oldTags.join(', ')}`)
      console.log(`  优化后: ${newTags.join(', ')}`)
      
      // 更新数据库
      await prisma.agent.update({
        where: { id: agent.id },
        data: { tags: newTags.join(', ') }
      })
    }
    
    console.log('\n✅ 标签优化完成!')
    
    // 显示优化后的标签统计
    console.log('\n📈 优化后的标签体系:')
    console.log('==================')
    
    const tagCount = {}
    const updatedAgents = await prisma.agent.findMany({ select: { tags: true } })
    
    updatedAgents.forEach(agent => {
      const tags = agent.tags.split(',').map(t => t.trim())
      tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    })
    
    Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([tag, count]) => {
        console.log(`  ${tag}: ${count} 个产品`)
      })
    
    console.log(`\n📉 标签数量: ${Object.keys(tagCount).length} 个 (原来 33 个)`)
    console.log('💡 减少了', 33 - Object.keys(tagCount).length, '个重复标签')
    
  } catch (error) {
    console.error('❌ 优化标签时出错:', error)
  } finally {
    await prisma.$disconnect()
  }
}

optimizeTags()