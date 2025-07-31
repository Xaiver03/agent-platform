import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Global state to track initialization
let initializationState: 'pending' | 'running' | 'completed' | 'failed' = 'pending';
let initializationPromise: Promise<void> | null = null;

/**
 * Smart API initialization for Vercel environment
 * Handles database setup with multiple fallback strategies
 */
export async function initializeApi(): Promise<void> {
  // If already initialized or initializing, return the existing promise
  if (initializationState === 'completed') {
    console.log('[API Init] Already initialized');
    return;
  }
  
  if (initializationState === 'running' && initializationPromise) {
    console.log('[API Init] Initialization already in progress, waiting...');
    return initializationPromise;
  }
  
  // Start initialization
  initializationState = 'running';
  initializationPromise = performInitialization();
  
  try {
    await initializationPromise;
    initializationState = 'completed';
  } catch (error) {
    initializationState = 'failed';
    throw error;
  }
  
  return initializationPromise;
}

async function performInitialization(): Promise<void> {
  console.log('[API Init] Starting initialization...');
  console.log('[API Init] Environment:', {
    VERCEL: process.env.VERCEL,
    NODE_ENV: process.env.NODE_ENV,
    cwd: process.cwd()
  });
  
  // Only run in Vercel environment
  if (process.env.VERCEL !== '1') {
    console.log('[API Init] Not in Vercel environment, skipping initialization');
    return;
  }
  
  try {
    // Strategy 1: Check if database already exists in /tmp
    const targetDb = '/tmp/prod.db';
    
    if (fs.existsSync(targetDb)) {
      console.log('[API Init] Database already exists in /tmp, verifying content...');
      
      const isValid = await verifyDatabase(targetDb);
      if (isValid) {
        console.log('[API Init] Existing database is valid, initialization complete');
        return;
      } else {
        console.log('[API Init] Existing database is invalid, will recreate');
        try {
          fs.unlinkSync(targetDb);
        } catch (e) {
          console.error('[API Init] Failed to remove invalid database:', e);
        }
      }
    }
    
    // Strategy 2: Copy from multiple possible locations
    const possibleSources = [
      path.join(process.cwd(), 'public', 'db', 'prod.db'),
      path.join(process.cwd(), 'prisma', 'prod.db'),
      path.join(process.cwd(), '.next', 'static', 'db', 'prod.db'),
      path.join(process.cwd(), 'prod.db')
    ];
    
    console.log('[API Init] Looking for database in the following locations:');
    possibleSources.forEach(source => {
      const exists = fs.existsSync(source);
      console.log(`  - ${source}: ${exists ? '✅ Found' : '❌ Not found'}`);
    });
    
    let databaseCopied = false;
    
    for (const source of possibleSources) {
      if (fs.existsSync(source)) {
        console.log(`[API Init] Copying database from ${source}...`);
        
        try {
          fs.copyFileSync(source, targetDb);
          
          // Verify the copied database
          const isValid = await verifyDatabase(targetDb);
          if (isValid) {
            console.log('[API Init] Database copied and verified successfully');
            databaseCopied = true;
            break;
          } else {
            console.log('[API Init] Copied database is invalid, trying next source');
            fs.unlinkSync(targetDb);
          }
        } catch (error) {
          console.error(`[API Init] Failed to copy from ${source}:`, error);
        }
      }
    }
    
    // Strategy 3: Create minimal database with seed data
    if (!databaseCopied) {
      console.log('[API Init] No valid database found, creating new one with seed data...');
      
      // Create empty database file
      fs.writeFileSync(targetDb, '');
      
      // Initialize with schema and seed data
      await createMinimalDatabase(targetDb);
    }
    
    // Final verification
    const finalCheck = await verifyDatabase(targetDb);
    if (!finalCheck) {
      throw new Error('Database initialization failed - unable to create valid database');
    }
    
    console.log('[API Init] Initialization completed successfully');
    
  } catch (error) {
    console.error('[API Init] Critical initialization error:', error);
    // Don't throw - let the app run with potential issues rather than crash
    console.error('[API Init] Continuing despite initialization errors');
  }
}

/**
 * Verify database integrity and content
 */
async function verifyDatabase(dbPath: string): Promise<boolean> {
  console.log(`[API Init] Verifying database at ${dbPath}...`);
  
  if (!fs.existsSync(dbPath)) {
    console.log('[API Init] Database file does not exist');
    return false;
  }
  
  const stats = fs.statSync(dbPath);
  console.log(`[API Init] Database size: ${(stats.size / 1024).toFixed(2)} KB`);
  
  if (stats.size < 1024) { // Less than 1KB means it's likely empty
    console.log('[API Init] Database file is too small, likely empty');
    return false;
  }
  
  // Test database connection and content
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${dbPath}`
      }
    },
    log: ['error', 'warn']
  });
  
  try {
    // Check critical tables
    const [agentCount, adminCount, configCount] = await Promise.all([
      prisma.agent.count(),
      prisma.admin.count(), 
      prisma.starMagnitudeConfig.count()
    ]);
    
    console.log('[API Init] Database content:', {
      agents: agentCount,
      admins: adminCount,
      starConfigs: configCount
    });
    
    // Database is valid if it has at least some data
    const isValid = agentCount > 0 && adminCount > 0 && configCount > 0;
    
    if (!isValid) {
      console.log('[API Init] Database is missing critical data');
    }
    
    return isValid;
    
  } catch (error: any) {
    console.error('[API Init] Database verification error:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Create a minimal database with essential seed data
 */
async function createMinimalDatabase(dbPath: string): Promise<void> {
  console.log('[API Init] Creating minimal database with seed data...');
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${dbPath}`
      }
    },
    log: ['error', 'warn']
  });
  
  try {
    // Push schema
    console.log('[API Init] Pushing schema to database...');
    const { execSync } = require('child_process');
    execSync('npx prisma db push', {
      env: {
        ...process.env,
        DATABASE_URL: `file:${dbPath}`
      },
      stdio: 'pipe'
    });
    
    // Create essential data
    console.log('[API Init] Creating essential data...');
    
    // 1. Admin account
    const bcrypt = await import('bcryptjs');
    await prisma.admin.create({
      data: {
        email: 'admin@example.com',
        password: await bcrypt.hash('miracleplus666,.', 10),
        name: '超级管理员',
        role: 'super_admin',
        canChangePassword: true,
        canManageAdmins: true
      }
    });
    
    // 2. Star magnitude configs
    await prisma.starMagnitudeConfig.createMany({
      data: [
        {
          magnitude: 1,
          minClicks: 500,
          maxClicks: null,
          size: 8,
          brightness: 1.0,
          glow: 20,
          color: '#FF0080',
          label: '超亮星',
          description: '最受欢迎的明星',
          orderIndex: 1
        },
        {
          magnitude: 2,
          minClicks: 100,
          maxClicks: 499,
          size: 6,
          brightness: 0.8,
          glow: 15,
          color: '#00FFFF',
          label: '一等星',
          description: '非常受欢迎',
          orderIndex: 2
        },
        {
          magnitude: 3,
          minClicks: 0,
          maxClicks: 99,
          size: 4,
          brightness: 0.6,
          glow: 10,
          color: '#FFD700',
          label: '普通星',
          description: '标准星星',
          orderIndex: 3
        }
      ]
    });
    
    // 3. Essential agents
    await prisma.agent.createMany({
      data: [
        {
          name: 'ChatGPT',
          description: '强大的AI对话助手，支持多种任务',
          tags: '对话,写作,编程',
          manager: 'OpenAI',
          homepage: 'https://chat.openai.com',
          icon: '💬',
          enabled: true,
          clickCount: 150,
          themeColor: '#74AA9C'
        },
        {
          name: 'Claude',
          description: '安全可靠的AI助手，擅长分析和编程',
          tags: '对话,分析,编程',
          manager: 'Anthropic',
          homepage: 'https://claude.ai',
          icon: '🤖',
          enabled: true,
          clickCount: 120,
          themeColor: '#8B7EC8'
        },
        {
          name: 'Midjourney',
          description: 'AI图像生成工具，创造惊人的艺术作品',
          tags: '图像,设计,创意',
          manager: 'Midjourney',
          homepage: 'https://midjourney.com',
          icon: '🎨',
          enabled: true,
          clickCount: 200,
          themeColor: '#FFB347'
        },
        {
          name: 'GitHub Copilot',
          description: 'AI代码助手，提供智能代码补全',
          tags: '编程,开发,效率',
          manager: 'GitHub',
          homepage: 'https://github.com/features/copilot',
          icon: '🐙',
          enabled: true,
          clickCount: 80,
          themeColor: '#24292E'
        },
        {
          name: 'DALL-E 3',
          description: 'OpenAI的图像生成模型',
          tags: '图像,创意,AI绘画',
          manager: 'OpenAI',
          homepage: 'https://openai.com/dall-e-3',
          icon: '🎭',
          enabled: true,
          clickCount: 95,
          themeColor: '#10A37F'
        }
      ]
    });
    
    // 4. Feedback buttons
    await prisma.feedbackButton.createMany({
      data: [
        {
          title: 'AI产品反馈',
          description: '对AI工具的使用反馈',
          url: 'https://forms.gle/example1',
          icon: 'message',
          color: '#1890ff',
          order: 1,
          enabled: true
        },
        {
          title: '平台体验反馈',
          description: '对平台的建议',
          url: 'https://forms.gle/example2',
          icon: 'form',
          color: '#52c41a',
          order: 2,
          enabled: true
        }
      ]
    });
    
    // 5. Feedback config
    await prisma.feedbackConfig.create({
      data: {
        productFeedbackUrl: 'https://forms.gle/example1',
        platformFeedbackUrl: 'https://forms.gle/example2'
      }
    });
    
    console.log('[API Init] Essential data created successfully');
    
  } catch (error) {
    console.error('[API Init] Failed to create minimal database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Export additional utilities
export async function getDatabaseStatus(): Promise<{
  initialized: boolean;
  state: string;
  location?: string;
  stats?: any;
}> {
  const dbPath = '/tmp/prod.db';
  
  return {
    initialized: initializationState === 'completed',
    state: initializationState,
    location: process.env.VERCEL === '1' ? dbPath : process.env.DATABASE_URL,
    stats: fs.existsSync(dbPath) ? {
      exists: true,
      size: fs.statSync(dbPath).size,
      isValid: await verifyDatabase(dbPath)
    } : { exists: false }
  };
}