# 🤖 AI Agent 体验台

> 团队AI工具统一管理与体验平台 - 基于Next.js 14 + Ant Design + SQLite

## 🚀 项目简介

AI Agent体验台是一个现代化的团队AI工具管理平台，提供工具展示、使用指南、反馈收集和后台管理功能。支持自定义封面图片、反馈问卷配置，以及完整的后台管理功能。

### 📋 项目背景
本项目源于团队对高价值AI Agent工具的统一管理需求，旨在：
- 提升团队成员对AI工具的认知与应用效率
- 提供统一的工具介绍、学习资源和体验入口
- 收集使用反馈，优化工具选型
- 建立主理人制度，促进知识分享

## ✨ 核心功能

### 🔧 用户端功能
- **工具展示**: 精美的卡片式布局，支持封面图片
- **搜索过滤**: 实时搜索和标签筛选
- **使用指南**: 详细的工具使用说明
- **反馈系统**: 双按钮反馈（AI产品反馈 + 平台体验反馈）
- **响应式设计**: 完美适配手机、平板、电脑

### 🛠️ 管理端功能
- **工具管理**: 完整的CRUD操作
- **申请审核**: 处理"成为主理人"申请
- **反馈管理**: 查看和管理用户反馈
- **配置管理**: 自定义反馈问卷链接
- **图片上传**: 支持本地上传封面图片
- **数据统计**: 实时统计面板

## 🎯 快速开始

### 环境要求
- Node.js 18+ 
- npm/yarn/pnpm

### 安装启动

```bash
# 切换到项目目录
cd /Users/rocalight/同步空间/micraplus/AEXD/ai-agent-platform

# 安装依赖
npm install

# 初始化数据库
npx prisma db push
npx prisma db seed

# 启动开发服务器（默认端口3000）
npm run dev

# 或指定端口启动
npm run dev -- --port 3001
```

### 访问地址
- **主页**: http://localhost:3000
- **管理员登录**: http://localhost:3000/admin/login

### 管理员账号
- 邮箱: admin@example.com
- 密码: admin123

### ⚠️ 常见问题与解决方案

#### 1. 浏览器无法访问（ERR_CONNECTION_REFUSED）
- 确保服务器已启动（控制台显示 "Ready"）
- 检查端口是否正确（默认3000）
- 如果设置了代理，可能需要临时禁用
- 使用 `ps aux | grep "next dev"` 检查进程

#### 2. 在Obsidian中点击链接提示错误
- 请在浏览器（Chrome/Safari/Firefox）中打开，而不是Obsidian
- 复制链接地址到浏览器地址栏
- 或按住Cmd键（Mac）点击链接在浏览器中打开

#### 3. 端口被占用
- 使用 `lsof -i :3000` 查看端口占用
- 更换端口：`npm run dev -- --port 3001`

## 📁 项目结构

```
ai-agent-platform/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # 主页（含反馈按钮）
│   ├── admin/login/page.tsx     # 管理员登录
│   ├── admin/page.tsx           # 管理后台
│   ├── agents/[id]/page.tsx     # 工具详情页
│   └── api/                     # API路由
│       ├── agents/              # 工具管理API
│       ├── applications/        # 申请管理API
│       ├── feedback/            # 反馈管理API
│       ├── admin/login/         # 认证API
│       ├── feedback-config/     # 配置API
│       └── upload/              # 图片上传API
├── components/
│   ├── FeedbackButtons.tsx      # 主页反馈按钮
│   ├── ImageUpload.tsx          # 图片上传组件
│   ├── ApplicationForm.tsx      # 申请表单
│   └── FeedbackForm.tsx         # 反馈表单
├── public/uploads/              # 上传图片存储
├── prisma/
│   ├── schema.prisma            # 数据库模型
│   └── seed.ts                  # 初始化数据
├── package.json
└── README.md
```

## 🗄️ 数据库模型

### 主要表结构

```sql
-- AI工具表
agents {
  id, name, description, tags, manager,
  coverImage, guideContent, homepage, icon,
  enabled, createdAt, updatedAt
}

-- 管理员账号表
admins {
  id, email, password, name, createdAt, updatedAt
}

-- 反馈配置表
feedback_config {
  id, productFeedbackUrl, platformFeedbackUrl,
  createdAt, updatedAt
}
```

## 🎨 界面展示

### 主页特色
- **精美卡片**: 支持自定义封面图片
- **搜索筛选**: 实时搜索 + 标签过滤
- **右上角管理员入口**: 隐藏式设计

### 管理后台
- **统计面板**: 实时数据可视化
- **工具管理**: 完整CRUD操作
- **图片上传**: 拖拽式上传体验
- **配置管理**: 可视化问卷链接配置

## 🔧 技术栈

| 技术 | 版本 | 用途 |
|---|---|---|
| Next.js | 14.x | 全栈框架 |
| TypeScript | 5.x | 类型安全 |
| Ant Design | 5.x | UI组件库 |
| Prisma | 5.x | 数据库ORM |
| SQLite | - | 轻量级数据库 |
| bcryptjs | 3.x | 密码加密 |
| uuid | 11.x | 文件命名 |

## 📱 使用指南

### 用户操作
1. 访问主页浏览AI工具
2. 点击工具卡片查看详情
3. 使用底部反馈按钮提交意见
4. 通过标签筛选感兴趣的工具

### 管理员操作
1. 点击右上角"管理员登录"
2. 使用管理员账号登录
3. 在后台管理所有工具、申请和反馈
4. 配置反馈问卷链接

### 图片上传
1. 管理员登录后进入工具编辑
2. 使用"上传图片"按钮选择本地图片
3. 自动生成URL并预览

## 🚀 部署指南

### 本地部署
```bash
# 安装依赖
npm install

# 数据库初始化
npx prisma db push
npx prisma db seed

# 启动服务
npm run dev -- --port 3001
```

### 云部署准备
- **Vercel**: 一键部署，支持环境变量
- **Docker**: 已准备Dockerfile模板
- **环境变量**: 支持生产环境配置

### 环境变量
```env
# 生产环境示例
DATABASE_URL="file:./prod.db"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"
```

## 🔍 API文档

### 认证相关
- `POST /api/admin/login` - 管理员登录
- `DELETE /api/admin/login` - 管理员登出
- `GET /api/admin/login` - 检查登录状态

### 工具管理
- `GET /api/agents` - 获取工具列表
- `POST /api/agents` - 创建新工具
- `PUT /api/agents/:id` - 更新工具
- `DELETE /api/agents/:id` - 删除工具

### 图片上传
- `POST /api/upload` - 上传图片

## 🎯 开发计划

### 已完成功能 ✅
- [x] 基础架构搭建
- [x] UI重构为Ant Design
- [x] 管理员认证系统
- [x] 反馈系统
- [x] 图片上传功能
- [x] 响应式设计
- [x] 图片上传系统
- [x] 反馈问卷配置
- [x] 管理员后台管理

### 未来功能 🚀
- [ ] 云存储集成（AWS S3/阿里云OSS）
- [ ] 高级搜索功能
- [ ] 用户注册系统
- [ ] 工具使用统计
- [ ] 批量导入工具
- [ ] 移动端APP

## 📞 支持与反馈

- **管理员邮箱**: admin@example.com
- **测试账号**: admin@example.com / admin123
- **反馈问卷**: 可在管理后台配置

## 📄 许可证

MIT License - 可自由使用和修改

## 💡 项目说明

### 关于AEXD目录
AEXD（AI Experience Design）是整个项目的根目录，包含：
- **AI Agent 体验台总览页面设计.md** - 页面设计规范文档
- **AI Agent 体验台系统 PRD文档.md** - 详细的产品需求文档
- **ai-agent-platform/** - 实际的代码实现
- **triody-clone/** - 另一个独立的演示项目

### 开发建议
1. **先阅读文档**：建议先阅读PRD文档了解业务需求
2. **数据已初始化**：数据库已包含示例数据，可直接预览
3. **图片上传**：支持本地上传，存储在`public/uploads/`
4. **扩展性**：代码结构清晰，易于添加新功能

---

*最后更新: 2025-07-18*
*版本: v2.1 - 包含项目上下文说明*