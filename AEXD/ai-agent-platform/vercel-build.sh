#!/bin/bash

echo "====== Vercel Build Script Started ======"
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# 列出当前目录结构
echo "====== Directory Structure ======"
ls -la

# 检查components目录
echo "====== Components Directory ======"
ls -la components/

# 检查特定组件文件
echo "====== Checking Component Files ======"
for file in ImageUpload.tsx MarkdownRenderer.tsx RichTextEditor.tsx FeedbackForm.tsx SearchSuggestions.tsx; do
  if [ -f "components/$file" ]; then
    echo "✓ components/$file exists ($(stat -f%z components/$file 2>/dev/null || stat -c%s components/$file 2>/dev/null) bytes)"
  else
    echo "✗ components/$file NOT FOUND"
  fi
done

# 运行实际的构建
echo "====== Running Build ======"
npm run db:setup && next build