import fs from 'fs';
import path from 'path';
import prisma from './prisma';

let initialized = false;

export async function initializeApi() {
  if (initialized) return;
  
  console.log('[API Init] Starting initialization...');
  
  // 只在Vercel环境执行
  if (process.env.VERCEL === '1') {
    try {
      // 复制数据库到/tmp
      const sourceDb = path.join(process.cwd(), 'prisma', 'prod.db');
      const targetDb = '/tmp/prod.db';
      
      if (!fs.existsSync(targetDb) && fs.existsSync(sourceDb)) {
        console.log('[API Init] Copying database to /tmp...');
        fs.copyFileSync(sourceDb, targetDb);
        console.log('[API Init] Database copied successfully');
      }
      
      // 测试数据库连接
      const count = await prisma.agent.count();
      console.log('[API Init] Database connected, agents count:', count);
      
      // 如果数据库为空，创建默认数据
      if (count === 0) {
        console.log('[API Init] Creating default agents...');
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
            }
          ]
        });
        
        // 创建默认反馈按钮
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
      }
      
    } catch (error) {
      console.error('[API Init] Initialization error:', error);
      // 不要抛出错误，让API继续运行
    }
  }
  
  initialized = true;
  console.log('[API Init] Initialization complete');
}