import prisma from './prisma';

export async function ensureDatabase() {
  try {
    // 检查是否有数据
    const agentCount = await prisma.agent.count();
    console.log('[DB] Current agents count:', agentCount);
    
    if (agentCount === 0) {
      console.log('[DB] No agents found, creating default data...');
      
      // 创建默认管理员
      const adminCount = await prisma.admin.count();
      if (adminCount === 0) {
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash('miracleplus666,.', 10);
        
        await prisma.admin.create({
          data: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: '超级管理员',
            role: 'super_admin',
            canChangePassword: true,
            canManageAdmins: true
          }
        });
        console.log('[DB] Admin created');
      }
      
      // 创建默认agents
      await prisma.agent.createMany({
        data: [
          {
            name: 'ChatGPT',
            description: '强大的AI对话助手',
            tags: '对话,写作,编程',
            manager: 'OpenAI',
            homepage: 'https://chat.openai.com',
            icon: '💬',
            enabled: true,
            clickCount: 50,
            themeColor: '#74AA9C'
          },
          {
            name: 'Claude',
            description: '安全可靠的AI助手',
            tags: '对话,分析,编程',
            manager: 'Anthropic',
            homepage: 'https://claude.ai',
            icon: '🤖',
            enabled: true,
            clickCount: 30,
            themeColor: '#8B7EC8'
          },
          {
            name: 'Midjourney',
            description: 'AI图像生成工具',
            tags: '图像,设计,创意',
            manager: 'Midjourney',
            homepage: 'https://midjourney.com',
            icon: '🎨',
            enabled: true,
            clickCount: 80,
            themeColor: '#FFB347'
          },
          {
            name: 'GitHub Copilot',
            description: 'AI代码助手',
            tags: '编程,开发,AI助手',
            manager: 'GitHub',
            homepage: 'https://github.com/features/copilot',
            icon: '🐙',
            enabled: true,
            clickCount: 120,
            themeColor: '#24292E'
          },
          {
            name: 'DALL-E 3',
            description: 'OpenAI的图像生成模型',
            tags: '图像生成,创意,设计',
            manager: 'OpenAI',
            homepage: 'https://openai.com/dall-e-3',
            icon: '🎭',
            enabled: true,
            clickCount: 95,
            themeColor: '#10A37F'
          }
        ]
      });
      
      // 创建反馈按钮
      const buttonCount = await prisma.feedbackButton.count();
      if (buttonCount === 0) {
        await prisma.feedbackButton.createMany({
          data: [
            {
              title: 'AI产品反馈',
              description: '对具体AI工具的使用反馈',
              url: 'https://forms.gle/example1',
              icon: 'message',
              color: '#1890ff',
              order: 1,
              enabled: true
            },
            {
              title: '平台体验反馈',
              description: '对体验台平台的建议',
              url: 'https://forms.gle/example2',
              icon: 'form',
              color: '#52c41a',
              order: 2,
              enabled: true
            }
          ]
        });
        console.log('[DB] Feedback buttons created');
      }
      
      console.log('[DB] Default data created successfully');
    }
  } catch (error) {
    console.error('[DB] Error ensuring database:', error);
  }
}