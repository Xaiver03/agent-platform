const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化数据库...');

  try {
    // 1. 创建默认管理员
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      console.log('创建默认管理员...');
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
      console.log('✓ 默认管理员创建成功');
    }

    // 2. 创建默认反馈按钮
    const buttonCount = await prisma.feedbackButton.count();
    if (buttonCount === 0) {
      console.log('创建默认反馈按钮...');
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
      console.log('✓ 反馈按钮创建成功');
    }

    // 3. 创建示例Agent数据
    const agentCount = await prisma.agent.count();
    if (agentCount === 0) {
      console.log('创建示例Agent数据...');
      await prisma.agent.createMany({
        data: [
          {
            name: 'ChatGPT',
            description: 'OpenAI的大型语言模型，可进行自然对话和文本生成',
            tags: 'AI助手,对话,写作',
            manager: '张三',
            homepage: 'https://chat.openai.com',
            icon: '🤖',
            themeColor: '#10A37F',
            enabled: true,
            clickCount: 1500
          },
          {
            name: 'Claude',
            description: 'Anthropic的AI助手，擅长分析和创作',
            tags: 'AI助手,对话,分析',
            manager: '李四',
            homepage: 'https://claude.ai',
            icon: '🧠',
            themeColor: '#6B3AA0',
            enabled: true,
            clickCount: 800
          },
          {
            name: 'Midjourney',
            description: 'AI图像生成工具，创造惊人的艺术作品',
            tags: '图像生成,设计,创意',
            manager: '王五',
            homepage: 'https://midjourney.com',
            icon: '🎨',
            themeColor: '#FF6B6B',
            enabled: true,
            clickCount: 600
          },
          {
            name: 'GitHub Copilot',
            description: 'AI编程助手，提升编码效率',
            tags: '编程,代码,开发工具',
            manager: '赵六',
            homepage: 'https://github.com/features/copilot',
            icon: '💻',
            themeColor: '#24292E',
            enabled: true,
            clickCount: 450
          },
          {
            name: 'Notion AI',
            description: '智能笔记和文档助手',
            tags: '写作,笔记,效率工具',
            manager: '钱七',
            homepage: 'https://notion.so',
            icon: '📝',
            themeColor: '#000000',
            enabled: true,
            clickCount: 300
          }
        ]
      });
      console.log('✓ 示例Agent数据创建成功');
    }

    // 4. 创建示例弹幕
    const danmakuCount = await prisma.danmaku.count();
    if (danmakuCount === 0) {
      console.log('创建示例弹幕...');
      await prisma.danmaku.createMany({
        data: [
          { text: '欢迎来到AI星系！', color: '#FF6B6B' },
          { text: 'ChatGPT真的很强大', color: '#4ECDC4' },
          { text: '期待更多AI工具', color: '#45B7D1' },
          { text: 'Midjourney的图像太棒了', color: '#96CEB4' },
          { text: 'AI改变世界', color: '#DDA0DD' }
        ]
      });
      console.log('✓ 示例弹幕创建成功');
    }

    console.log('\n✓ 数据库初始化完成！');
    console.log('\n数据统计：');
    console.log(`- 管理员数量: ${await prisma.admin.count()}`);
    console.log(`- 反馈按钮数量: ${await prisma.feedbackButton.count()}`);
    console.log(`- Agent数量: ${await prisma.agent.count()}`);
    console.log(`- 弹幕数量: ${await prisma.danmaku.count()}`);

  } catch (error) {
    console.error('初始化失败:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });