# 立里博客前端

[![Vue 3](https://img.shields.io/badge/Vue_3-4FC08D?logo=vue.js&logoColor=fff)](https://vuejs.org/)[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](https://vite.dev/)[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**立里博客**（LiliBlog）是一个基于 Vue 3 + TypeScript + Vite 构建的现代化个人博客系统前端。采用赛博朋克/霓虹美学设计，支持多主题切换、深色模式、完整的后台管理面板，以及基于 Vditor 的 Markdown 文章编辑器。

- 🌐 在线站点：<https://lilicould.cn>
- 📦 后端仓库(本仓库仅包含前端代码)：[LiliCould/liliblog-backend](https://github.com/LiliCould/liliblog-backend)

---

## 目录

- [技术栈](#技术栈)
- [功能特性](#功能特性)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [脚本命令](#脚本命令)
- [部署指南](#部署指南)
- [环境变量](#环境变量)
- [开发规范](#开发规范)
- [许可证](#许可证)

---

## 技术栈

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **Vue 3** | ^3.5.16 | 渐进式前端框架（Composition API + `<script setup>`） |
| **TypeScript** | ~5.8.3 | 类型安全 JavaScript |
| **Vite** | ^8.0.0 | 构建工具与开发服务器 |
| **Vue Router 4** | ^4.5.1 | 客户端路由 |
| **Pinia** | ^3.0.2 | 状态管理 |

### UI 与样式

| 技术 | 用途 |
|------|------|
| **Tailwind CSS** 3 | 工具类优先的 CSS 框架 |
| **@tailwindcss/typography** | Markdown 内容排版 |
| **Radix Vue** | 无样式、可访问的 UI 原语 |
| **Lucide Vue Next** | 开源图标库 |
| **class-variance-authority** | 组件变体管理 |
| **Tailwind Merge / clsx** | Tailwind 类名合并 |

### 编辑器

| 技术 | 用途 |
|------|------|
| **Vditor** 3.11.2 | 自托管 Markdown 编辑器（WYSIWYG / IR / SV 三种模式，支持 KaTeX、Mermaid、代码高亮） |

### 其他工具

| 技术 | 用途 |
|------|------|
| **Axios** | HTTP 客户端（自动 Token 刷新、请求队列） |
| **Day.js** | 轻量级日期格式化 |
| **DOMPurify** | HTML/Markdown 输出安全过滤 |
| **NProgress** | 页面顶部加载进度条 |
| **unplugin-auto-import** | 自动导入 Vue/Router/Pinia API |
| **unplugin-vue-components** | 自动注册组件 |

---

## 功能特性

### 前台功能

| 功能 | 说明 |
|------|------|
| 🏠 **首页** | 轮播大图 + 分页文章列表 |
| 📄 **文章详情** | Markdown 渲染、目录导航、点赞、评论区 |
| 📂 **分类过滤** | 按分类浏览文章 |
| 🏷️ **标签过滤** | 按标签浏览文章 |
| 👤 **用户主页** | 公开个人主页（`/user/:id`）与个人中心（`/user/me`） |
| 🔐 **认证系统** | 密码登录 + 邮箱验证码登录、注册、登出 |
| 🔍 **搜索** | 全站文章搜索 |
| ℹ️ **关于页面** | 博客介绍 |
| 🎨 **多主题** | 4 套内置主题（浅色、赛博暗色、海洋、森林）+ 自定义颜色覆盖 + 跟随系统 |
| 📱 **响应式设计** | 桌面三栏布局、平板、移动端侧滑导航 |
| 🌙 **深色模式** | 基于 class 策略的深色模式支持 |

### 后台管理

| 功能 | 说明 |
|------|------|
| 📊 **仪表盘** | 站点概览与统计数据 |
| 📝 **文章管理** | CRUD、批量删除、审核 |
| 📁 **分类管理** | CRUD、批量删除 |
| 🏷️ **标签管理** | CRUD、批量删除 |
| 💬 **评论管理** | 审核、删除、批量删除 |
| 👥 **用户管理** | CRUD、角色/状态管理 |
| 📋 **审计日志** | 操作日志查看 |

### 文章编辑器

- 基于 Vditor 的完整 Markdown 编辑器，支持 WYSIWYG / IR / SV 三种编辑模式
- 自动保存草稿到 IndexedDB + localStorage（30 秒间隔）
- 重新访问时恢复未保存的草稿
- 保留最近 10 个版本的草稿历史
- 离开前未保存内容提醒（`beforeunload`）

### SEO 优化

- 📍 XML 网站地图（`/sitemap.xml`）
- 🤖 爬虫规则（`/robots.txt`）
- 📝 Open Graph / Twitter Card 元标签
- 🔗 Canonical URL
- 🧩 JSON-LD 结构化数据
- 🚀 字体与 API 预连接（`preconnect`）

---

## 项目结构

```
├── public/                      # 静态资源
│   ├── avatar.png               # 默认头像
│   ├── favicon.svg              # 网站图标
│   ├── manifest.json            # PWA manifest
│   ├── robots.txt               # 爬虫规则
│   ├── sitemap.xml              # 网站地图
│   └── vditor/                  # 自托管 Vditor 编辑器资源
├── src/
│   ├── api/                     # API 服务层
│   │   ├── admin/               # 后台管理 API
│   │   │   ├── article.ts
│   │   │   ├── auditLog.ts
│   │   │   ├── category.ts
│   │   │   ├── comment.ts
│   │   │   ├── tag.ts
│   │   │   └── user.ts
│   │   ├── article.ts
│   │   ├── auth.ts
│   │   ├── category.ts
│   │   ├── comment.ts
│   │   ├── file.ts
│   │   ├── tag.ts
│   │   └── user.ts
│   ├── assets/
│   │   ├── heros/               # 轮播图资源
│   │   ├── logo.svg             # 应用 Logo
│   │   ├── my.png               # 个人照片
│   │   └── styles/
│   │       ├── markdown.css     # Markdown 内容样式
│   │       ├── reset.css        # CSS 重置 + 全局样式
│   │       ├── tailwind.css     # Tailwind 指令入口
│   │       ├── transitions.css  # 路由过渡动画
│   │       └── variables.css    # CSS 自定义属性（主题变量）
│   ├── components/
│   │   ├── article/             # 文章相关组件
│   │   │   ├── ArticleList.vue
│   │   │   ├── ArticleToc.vue
│   │   │   ├── MarkdownEditor.vue
│   │   │   └── MarkdownViewer.vue
│   │   ├── auth/                # 认证组件
│   │   │   └── AuthModal.vue
│   │   ├── comment/             # 评论组件
│   │   │   ├── CommentItem.vue
│   │   │   └── CommentSection.vue
│   │   ├── common/              # 通用组件
│   │   │   ├── ArticleCard.vue
│   │   │   ├── EmptyState.vue
│   │   │   ├── HeroCarousel.vue
│   │   │   ├── MyInfo.vue
│   │   │   ├── TagBadge.vue
│   │   │   ├── ThemePanel.vue
│   │   │   └── ToastContainer.vue
│   │   ├── layout/              # 布局组件
│   │   │   ├── AdminLayout.vue
│   │   │   ├── AppFooter.vue
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppLayout.vue
│   │   │   ├── AppSidebar.vue
│   │   │   ├── MobileNav.vue
│   │   │   └── RightSidebar.vue
│   │   ├── ui/                  # UI 基础组件
│   │   │   ├── CustomSelect.vue
│   │   │   └── Pagination.vue
│   │   └── user/
│   │       └── ChangePasswordModal.vue
│   ├── composables/             # 组合式函数
│   │   ├── useAuthModal.ts
│   │   ├── useAutoSave.ts
│   │   ├── useTheme.ts
│   │   ├── useToast.ts
│   │   └── useTokenRefresh.ts
│   ├── directives/              # 自定义指令
│   │   └── lazy.ts              # v-lazy 图片懒加载
│   ├── router/
│   │   ├── index.ts             # 路由设置 + 导航守卫
│   │   └── routes.ts            # 路由定义
│   ├── stores/                  # Pinia 状态管理
│   │   ├── app.ts               # 应用配置（分类、标签、全局 UI）
│   │   ├── article.ts           # 文章数据
│   │   ├── index.ts             # Pinia 实例
│   │   └── user.ts              # 用户认证信息
│   ├── types/                   # TypeScript 类型定义
│   │   ├── admin.d.ts
│   │   ├── api.d.ts
│   │   ├── article.d.ts
│   │   ├── auth.d.ts
│   │   ├── category.d.ts
│   │   ├── comment.d.ts
│   │   ├── common.d.ts
│   │   ├── router.d.ts
│   │   ├── tag.d.ts
│   │   └── user.d.ts
│   ├── utils/                   # 工具函数
│   │   ├── format.ts            # 日期/头像/数字格式化
│   │   ├── request.ts           # Axios 实例 + 拦截器
│   │   └── storage.ts           # localStorage 封装
│   ├── views/                   # 页面视图
│   │   ├── about/
│   │   │   └── AboutView.vue
│   │   ├── admin/
│   │   │   ├── Articles.vue
│   │   │   ├── AuditLogs.vue
│   │   │   ├── Categories.vue
│   │   │   ├── Comments.vue
│   │   │   ├── Dashboard.vue
│   │   │   ├── Tags.vue
│   │   │   └── Users.vue
│   │   ├── article/
│   │   │   └── ArticleDetail.vue
│   │   ├── auth/
│   │   │   ├── LoginRedirect.vue
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterRedirect.vue
│   │   │   └── RegisterView.vue
│   │   ├── category/
│   │   │   └── CategoryArticles.vue
│   │   ├── home/
│   │   │   └── HomeView.vue
│   │   ├── manage/
│   │   │   └── ArticleEditor.vue
│   │   ├── tag/
│   │   │   └── TagArticles.vue
│   │   ├── user/
│   │   │   ├── ProfileEdit.vue
│   │   │   └── UserProfile.vue
│   │   └── NotFound.vue
│   ├── App.vue                  # 根组件
│   ├── main.ts                  # 应用入口
│   ├── env.d.ts                 # 环境变量类型声明
│   ├── auto-imports.d.ts        # 自动生成（unplugin-auto-import）
│   └── components.d.ts          # 自动生成（unplugin-vue-components）
├── .env.development             # 开发环境变量
├── .env.production              # 生产环境变量
├── .gitignore
├── index.html                   # SPA 入口
├── package.json
├── vite.config.ts               # Vite 配置
├── tsconfig.json                # TypeScript 配置
├── tsconfig.app.json
├── tsconfig.node.json
├── tailwind.config.js           # Tailwind 配置
├── postcss.config.js            # PostCSS 配置
├── .yarnrc.yml                  # Yarn 配置
└── yarn.lock
```

---

## 快速开始

### 环境要求

- **Node.js** >= 18
- **npm** 或 **yarn**

### 安装依赖

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

开发服务器默认运行在 `http://localhost:3000`，API 请求会自动代理到 `http://localhost:8080`。

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建产物输出到 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
# 或
yarn preview
```

---

## 脚本命令

| 命令 | 说明 |
|------|------|
| `dev` | 启动 Vite 开发服务器 |
| `build` | TypeScript 类型检查 + Vite 生产构建 |
| `preview` | 预览生产构建结果 |

---

## 部署指南

### 静态文件部署

1. 执行 `npm run build` 构建生产版本
2. 将 `dist/` 目录下的文件部署到 Nginx、CDN 或任何静态文件服务器

### 推荐 Nginx 配置

```nginx
server {
    listen 80;
    server_name lilicould.cn www.lilicould.cn;

    root /path/to/dist;
    index index.html;

    # SPA 路由重写
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理
    location /api {
        proxy_pass https://api.lilicould.cn;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /auth {
        proxy_pass https://api.lilicould.cn;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /file {
        proxy_pass https://api.lilicould.cn;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 环境变量

项目使用两个环境文件：

| 文件 | 用途 |
|------|------|
| `.env.development` | 开发环境配置 |
| `.env.production` | 生产环境配置 |

| 变量 | 说明 | 开发环境值 | 生产环境值 |
|------|------|-----------|-----------|
| `VITE_API_BASE_URL` | API 基础地址 | `http://localhost:8080` | `https://api.lilicould.cn` |

> 开发时 Vite 通过 proxy 将 `/api`、`/auth`、`/file` 路径代理到 `http://localhost:8080`，因此开发环境也设置为后端地址。

---

## 路由一览

| 路径 | 页面 | 权限 | 布局 |
|------|------|------|------|
| `/` | 首页 | - | 默认 |
| `/article/:id` | 文章详情 | - | 默认 |
| `/category/:slug` | 分类文章列表 | - | 默认 |
| `/tag/:slug` | 标签文章列表 | - | 默认 |
| `/search?q=` | 搜索结果 | - | 默认 |
| `/user/me` | 个人主页 | 登录 | 默认 |
| `/user/:id` | 用户公开主页 | - | 默认 |
| `/login` | 登录 | - | 默认 |
| `/register` | 注册 | - | 默认 |
| `/profile/edit` | 编辑资料 | 登录 | 默认 |
| `/write` | 写文章 | 登录 | 空白 |
| `/write/:id` | 编辑文章 | 登录 | 空白 |
| `/admin` | 管理仪表盘 | 管理员 | 管理 |
| `/admin/articles` | 文章管理 | 管理员 | 管理 |
| `/admin/categories` | 分类管理 | 管理员 | 管理 |
| `/admin/tags` | 标签管理 | 管理员 | 管理 |
| `/admin/comments` | 评论管理 | 管理员 | 管理 |
| `/admin/users` | 用户管理 | 管理员 | 管理 |
| `/admin/audit-logs` | 审计日志 | 管理员 | 管理 |
| `/about` | 关于 | - | 默认 |
| `/*` | 404 页面 | - | 默认 |

---

## 开发规范

- **语言**：TypeScript 严格模式
- **框架**：Vue 3 Composition API + `<script setup>` 语法
- **样式**：Tailwind CSS 工具类优先，CSS 变量驱动主题
- **组件命名**：PascalCase，文件名与组件名一致
- **Git 提交**：遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范

### 自动导入

本项目使用 `unplugin-auto-import` 和 `unplugin-vue-components`，以下 API 无需手动 import：
- Vue API（`ref`、`computed`、`watch` 等）
- Vue Router API（`useRoute`、`useRouter` 等）
- Pinia API（`defineStore`、`storeToRefs` 等）
- `src/components/` 下的所有组件

---

## 许可证

[MIT License](LICENSE)

---

## 关于

- 作者：**LiliCould**（立里可）
- 网站：<https://lilicould.cn>
- GitHub：<https://github.com/LiliCould>

---

⭐ 如果你喜欢这个项目，欢迎给个 Star！
