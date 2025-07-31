import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDatabaseStatus } from '../../../lib/api-init';

export async function GET(request: NextRequest) {
  console.log('[Debug API] Called');
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: {
      VERCEL: process.env.VERCEL,
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      cwd: process.cwd()
    },
    tmpDirectory: {
      exists: fs.existsSync('/tmp'),
      contents: fs.existsSync('/tmp') ? fs.readdirSync('/tmp').filter(f => f.includes('.db')) : [],
      prodDbExists: fs.existsSync('/tmp/prod.db'),
      prodDbSize: fs.existsSync('/tmp/prod.db') ? fs.statSync('/tmp/prod.db').size : 0
    },
    publicDirectory: {
      exists: fs.existsSync('public'),
      dbDir: fs.existsSync('public/db'),
      prodDbExists: fs.existsSync('public/db/prod.db'),
      prodDbSize: fs.existsSync('public/db/prod.db') ? fs.statSync('public/db/prod.db').size : 0
    },
    prismaDirectory: {
      exists: fs.existsSync('prisma'),
      prodDbExists: fs.existsSync('prisma/prod.db'),
      prodDbSize: fs.existsSync('prisma/prod.db') ? fs.statSync('prisma/prod.db').size : 0
    },
    databaseStatus: await getDatabaseStatus()
  };

  return NextResponse.json(debugInfo, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
}