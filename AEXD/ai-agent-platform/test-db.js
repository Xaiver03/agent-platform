const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  console.log('=== 测试数据库连接 ===\n');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    // 1. 测试连接
    console.log('1. 测试数据库连接...');
    await prisma.$connect();
    console.log('✅ 数据库连接成功\n');
    
    // 2. 检查agents表
    console.log('2. 检查agents表...');
    const agentCount = await prisma.agent.count();
    console.log(`✅ Agents数量: ${agentCount}`);
    
    if (agentCount > 0) {
      const agents = await prisma.agent.findMany({ take: 3 });
      console.log('前3个agents:');
      agents.forEach(agent => {
        console.log(`  - ${agent.name} (clicks: ${agent.clickCount})`);
      });
    }
    console.log('');
    
    // 3. 检查feedbackButton表
    console.log('3. 检查feedbackButton表...');
    const buttonCount = await prisma.feedbackButton.count();
    console.log(`✅ FeedbackButtons数量: ${buttonCount}`);
    
    if (buttonCount > 0) {
      const buttons = await prisma.feedbackButton.findMany();
      console.log('所有反馈按钮:');
      buttons.forEach(btn => {
        console.log(`  - ${btn.title} (${btn.url})`);
      });
    }
    console.log('');
    
    // 4. 检查admin表
    console.log('4. 检查admin表...');
    const adminCount = await prisma.admin.count();
    console.log(`✅ Admin数量: ${adminCount}`);
    
    if (adminCount > 0) {
      const admins = await prisma.admin.findMany({
        select: { email: true, name: true, role: true }
      });
      console.log('管理员:');
      admins.forEach(admin => {
        console.log(`  - ${admin.email} (${admin.name}, ${admin.role})`);
      });
    }
    console.log('');
    
    // 5. 测试写入
    console.log('5. 测试写入操作...');
    const testAgent = await prisma.agent.create({
      data: {
        name: 'Test Agent ' + Date.now(),
        description: '测试AI工具',
        tags: '测试',
        manager: 'Test Manager',
        enabled: true,
        clickCount: 0
      }
    });
    console.log(`✅ 成功创建测试Agent: ${testAgent.name}`);
    
    // 清理测试数据
    await prisma.agent.delete({ where: { id: testAgent.id } });
    console.log('✅ 清理测试数据成功\n');
    
    console.log('=== 数据库测试完成，一切正常 ===');
    
  } catch (error) {
    console.error('❌ 数据库错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行测试
testDatabase();