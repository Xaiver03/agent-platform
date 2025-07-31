#!/bin/bash

# 设置Vercel环境变量
echo "Setting up Vercel environment variables..."

# 设置必要的环境变量
vercel env add DATABASE_URL production < echo "file:/tmp/prod.db"
vercel env add NODE_ENV production < echo "production"  
vercel env add VERCEL production < echo "1"

echo "Environment variables set!"
echo ""
echo "Please also add these environment variables in Vercel dashboard:"
echo "1. DATABASE_URL = file:/tmp/prod.db"
echo "2. NODE_ENV = production"
echo "3. VERCEL = 1"