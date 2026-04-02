# 立里博客前端

## 📋 项目简介

立里博客前端是一个基于 Vue 3 + TypeScript + Vite 开发的现代化个人博客网站前端项目。采用了响应式设计，支持桌面端和移动端访问，具有美观的界面和流畅的用户体验。

## 🛠️ 技术栈

- **前端框架**: Vue 3
- **开发语言**: TypeScript
- **构建工具**: Vite
- **UI 组件**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **CSS 预处理器**: SCSS
- **图标库**: Element Plus Icons
- **代码规范**: ESLint + Prettier
- **Markdown 解析**: md-editor-v3

## ✨ 功能特性

### 核心功能
- ✅ 文章列表展示
- ✅ 文章详情查看
- ✅ 文章搜索功能
- ✅ 标签分类
- ✅ 文章归档
- ✅ 评论系统
- ✅ 个人中心
- ✅ 后台管理
- ✅ 文章编辑

### 界面特性
- 🎨 现代化设计风格
- 📱 响应式布局
- 🌸 可莉光标挂件（PC端）
- 💫 鼠标跟随动画效果
- 🌊 毛玻璃效果
- 🎭 主题切换功能
- 🌙 深色模式支持

### SEO 优化
- 📍 网站地图 (sitemap.xml)
- 🤖 爬虫规则 (robots.txt)
- 📝 优化的 Meta 标签
- 🔗 规范链接 (canonical)
- 🌐 Open Graph 标签

## 📁 项目结构

```
├── public/              # 静态资源
│   ├── favicon.svg      # 网站图标
│   ├── robots.txt       # 爬虫规则
│   └── sitemap.xml      # 网站地图
├── src/                 # 源代码
│   ├── assets/          # 资源文件
│   │   ├── styles/      # 样式文件
│   │   └── images/      # 图片资源
│   ├── components/      # 组件
│   │   ├── common/      # 通用组件
│   │   ├── layout/      # 布局组件
│   │   └── article/     # 文章相关组件
│   ├── views/           # 页面
│   │   ├── home/        # 首页
│   │   ├── article/     # 文章页
│   │   ├── auth/        # 认证页
│   │   └── manage/      # 管理页
│   ├── router/          # 路由
│   ├── stores/          # 状态管理
│   ├── api/             # API 调用
│   ├── utils/           # 工具函数
│   ├── types/           # TypeScript 类型
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── .env.development     # 开发环境配置
├── .env.production      # 生产环境配置
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
└── package.json         # 项目依赖
```

## 🚀 安装和运行

### 环境要求
- Node.js 16+ 
- npm 或 yarn

### 安装依赖

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install
```

### 开发模式

```bash
# 使用 npm
npm run dev

# 使用 yarn
yarn dev
```

### 构建生产版本

```bash
# 使用 npm
npm run build

# 使用 yarn
yarn build
```

### 预览生产版本

```bash
# 使用 npm
npm run preview

# 使用 yarn
yarn preview
```

## 📦 部署

### 静态文件部署

1. 执行 `npm run build` 构建生产版本
2. 将 `dist` 目录下的文件部署到静态文件服务器

### Nginx 配置

```nginx
server {
    listen 80;
    server_name lilicould.cn www.lilicould.cn;
    
    root /path/to/your/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass https://lilicould.cn:8888;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔧 环境配置

### 开发环境

创建 `.env.development` 文件：

```env
VITE_API_BASE_URL=https://lilicould.cn:8888
```

### 生产环境

创建 `.env.production` 文件：

```env
VITE_API_BASE_URL=https://lilicould.cn:8888
```

## 🎨 自定义

### 主题配置
- 修改 `src/assets/styles/variables.css` 中的 CSS 变量
- 支持自定义颜色、字体、间距等

### 光标效果
- 可莉光标挂件配置在 `src/components/common/KleeCursor.vue`
- 支持在移动设备上自动隐藏

### 动画效果
- 鼠标跟随效果配置在 `src/components/common/MouseEffects.vue`
- 支持气泡和波纹效果

## 📝 开发规范

### 代码风格
- 使用 ESLint 和 Prettier 进行代码规范检查
- 遵循 Vue 3 组合式 API 最佳实践
- 使用 TypeScript 类型定义

### 组件命名
- 组件名使用 PascalCase
- 文件名与组件名保持一致
- 通用组件放在 `components/common` 目录

### 提交规范
- 使用语义化提交信息
- 遵循 Conventional Commits 规范

## 🌟 特色功能

### 可莉光标挂件
- 基于物理引擎的跟随效果
- 移动时的摆动动画
- 移动端自动隐藏

### 主题切换
- 支持 6 种预览主题
- 支持 8 种代码高亮主题
- 实时预览效果

### 响应式设计
- 适配桌面端、平板和移动端
- 流畅的布局切换
- 优化的触摸体验

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 联系

- 作者: LiliCould
- 网站: https://lilicould.cn
- GitHub: https://github.com/LiliCould

---

⭐ 如果你喜欢这个项目，欢迎给个 star！