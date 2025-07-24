# 🚀 AI Agent体验台 - 快速构建指南

## 一键构建Windows exe

### 1. 环境清理
```bash
# 如果遇到安装问题，先清理
rm -rf node_modules
rm -rf package-lock.json
npm cache clean --force
```

### 2. 最小化安装
```bash
# 只安装必要依赖
npm install --legacy-peer-deps --no-audit --no-fund
```

### 3. 构建Windows exe
```bash
# 构建Next.js应用
npm run build

# 生成数据库
npx prisma generate
npx prisma db push

# 构建Windows版本
npm run electron:win
```

### 4. 如果遇到Wine问题
```bash
# macOS安装Wine
brew install wine

# 或跳过Wine，使用GitHub Actions
# 推送代码到GitHub，自动构建Windows版本
```

### 5. 替代方案 - 使用现有脚本
```bash
# 直接使用启动脚本测试
./启动AI体验台.bat    # Windows
./启动AI体验台.command # macOS
./启动AI体验台.ps1     # PowerShell
```

## 📦 构建产物位置
- `dist-electron/AI Agent 体验台 Setup.exe` - Windows安装程序
- `dist-electron/win-unpacked/` - 解压版本（可直接测试）

## 🧪 测试Windows exe
1. **macOS Wine测试**: `wine dist-electron/win-unpacked/AI\ Agent\ 体验台.exe`
2. **虚拟机测试**: 使用VirtualBox/Parallels
3. **真实Windows**: 复制到Windows机器运行

## 🔧 故障排除
- **权限问题**: `sudo npm install`
- **网络问题**: 使用国内镜像 `npm config set registry https://registry.npmmirror.com`
- **磁盘空间**: 确保有5GB以上空间