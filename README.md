# 立里博客前端

[![Nuxt](https://img.shields.io/badge/Nuxt_4-00DC82?logo=nuxt&logoColor=fff)](https://nuxt.com/)[![Vue 3](https://img.shields.io/badge/Vue_3-4FC08D?logo=vue.js&logoColor=fff)](https://vuejs.org/)[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**立里博客**（LiliBlog）是一个基于 **Nuxt 4 + Vue 3 + TypeScript** 构建的个人博客前端，使用 SSR 渲染，采用赛博朋克/霓虹美学设计，支持多主题切换、深色模式、后台管理面板，以及基于 Vditor 的 Markdown 文章编辑器。

- 在线站点：<https://lilicould.cn>
- 后端仓库（本仓库仅包含前端代码）：[LiliCould/liliblog-backend](https://github.com/LiliCould/liliblog-backend)

---

## 目录

- [技术栈](#技术栈)
- [功能特性](#功能特性)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [脚本命令](#脚本命令)
- [环境变量](#环境变量)
- [路由一览](#路由一览)
- [构建与部署](#构建与部署)
- [开发规范](#开发规范)
- [许可证](#许可证)

---

## 技术栈

### 核心框架

| 技术 | 用途 |
|---|---|
| **Nuxt 4** | SSR 应用框架，文件路由、自动导入、Nitro 服务端 |
| **Vue 3** | Composition API + `<script setup>` |
| **TypeScript** | 严格模式类型检查 |
| **Nitro** | Nuxt 服务端引擎，负责 SSR、同源 API 代理、sitemap/robots |
| **Pinia** | 状态管理 |
| **Vue Router 5** | 由 Nuxt 集成，负责页面路由与导航守卫 |

### UI 与样式

| 技术 | 用途 |
|---|---|
| **Tailwind CSS 3** | 工具类优先的 CSS 框架 |
| **@tailwindcss/typography** | Markdown 内容排版 |
| **Reka UI** | 无样式、可访问的 UI 原语 |
| **Lucide Vue Next** | 图标库 |
| **vue-sonner** | Toast 提示 |
| **NProgress** | 页面加载进度条 |

### 内容与编辑器

| 技术 | 用途 |
|---|---|
| **Vditor** | 自托管 Markdown 编辑器（WYSIWYG / IR / SV） |
| **marked** | Markdown 渲染 |
| **highlight.js** | 代码高亮 |
| **DOMPurify** | HTML 输出安全过滤 |

### 其他工具

| 技术 | 用途 |
|---|---|
| **Axios** | HTTP 客户端（Token 刷新、请求队列） |
| **Day.js** | 日期格式化 |
| **VueUse** | 常用组合式工具 |

---

## 功能特性

### 前台

- 首页轮播大图 + 分页文章列表
- 文章详情、目录导航、阅读进度、点赞与评论区
- 分类、标签、全站搜索
- 用户公开主页与个人中心
- 密码登录、邮箱验证码登录、注册、登出
- 4 套内置主题：浅色、赛博暗色、海洋、森林，支持自定义颜色
- 响应式布局，适配桌面、平板和移动端

### 后台管理

- 仪表盘与站点统计
- 文章、分类、标签、评论、用户管理
- 审计日志查看
- 管理员路由守卫与 `noindex` 保护

### 文章编辑器

- Vditor Markdown 编辑器，支持 WYSIWYG / IR / SV 三种模式
- 自动保存草稿到 IndexedDB + localStorage
- 重新访问时恢复草稿，保留最近版本
- 离开页面前未保存提醒
- 图片/文件上传，支持七牛前端直传或后端中转

### SEO 与 SSR

- 服务端渲染，文章正文可直接被爬虫抓取
- 动态 `/sitemap.xml` 与 `/robots.txt`
- Open Graph、Twitter Card、Canonical、JSON-LD
- 后台、登录、写作、搜索页面自动加 `X-Robots-Tag: noindex, nofollow`

---

## 项目结构

```text
├── app/                         # Nuxt 应用源码（srcDir）
│   ├── api/                     # 后端接口封装
│   ├── assets/                  # 图片、Logo、全局样式与代码主题
│   ├── components/              # 文章、评论、布局、UI 等组件
│   ├── composables/             # 主题、上传、自动保存等组合式函数
│   ├── layouts/                 # default / admin / blank 布局
│   ├── middleware/              # auth / admin 路由守卫
│   ├── pages/                   # 文件路由页面
│   ├── plugins/                 # Nuxt 插件
│   ├── stores/                  # Pinia stores
│   ├── types/                   # TypeScript 类型
│   ├── utils/                   # 请求、格式化、SEO、目录等工具
│   ├── app.vue                  # 根组件
│   ├── error.vue                # 错误页
│   └── router.options.ts        # 路由滚动行为
├── server/
│   ├── middleware/api-proxy.ts  # 同源 /api、/auth、/file 代理
│   ├── middleware/legacy-redirects.ts
│   └── routes/                  # sitemap.xml、robots.txt
├── public/                      # favicon、manifest、Vditor 静态资源
├── scripts/copy-vditor.mjs      # 将 Vditor 复制到 public/vditor
├── deploy/                      # 通用部署手册、systemd、Nginx 配置
├── .github/workflows/deploy.yml # GitHub Actions 自动部署
├── nuxt.config.ts               # Nuxt 配置
├── tailwind.config.js           # Tailwind 配置
├── tsconfig.json                # 引用 .nuxt 生成的 tsconfig
├── package.json
└── yarn.lock
```

> `.nuxt/`、`.output/`、`.data/` 均为本地生成目录，已加入 `.gitignore`。其中 `.data/kv` 是 Nitro 开发时的本地 KV 存储。

---

## 快速开始

### 环境要求

- **Node.js** >= 22.19，推荐 24 LTS
- **Yarn** 4.18（通过 Corepack 启用）
- 已运行的后端服务，本地默认 `http://localhost:8080`

### 安装与启动

```bash
corepack enable
corepack prepare yarn@4.18.0 --activate
yarn install
yarn dev
```

开发服务器默认运行在 <http://localhost:3000>。

- 浏览器请求同源 `/api`、`/auth`、`/file`，由 Nitro 转发到后端。
- 后端地址由 `NUXT_API_BASE` 控制，开发环境默认 `http://localhost:8080`。
- `predev` 和 `postinstall` 会自动把 Vditor 资源复制到 `public/vditor`。

### 生产预览

```bash
yarn build
yarn preview
```

---

## 脚本命令

| 命令 | 说明 |
|---|---|
| `yarn dev` | 启动 Nuxt 开发服务器 |
| `yarn build` | 构建生产产物到 `.output/` |
| `yarn preview` | 预览生产构建 |
| `yarn typecheck` | 使用 `vue-tsc` 执行类型检查 |
| `yarn postinstall` | 复制 Vditor 资源并执行 `nuxt prepare` |

---

## 环境变量

| 变量 | 说明 | 默认值 |
|---|---|---|
| `NUXT_API_BASE` | 服务端 SSR 请求后端使用的地址 | 开发 `http://localhost:8080`，生产 `https://api.lilicould.cn` |
| `NUXT_PUBLIC_API_BASE` | 浏览器端 API 前缀，留空表示同源 | 空 |
| `NUXT_PUBLIC_SITE_URL` | sitemap、canonical、OG 使用的站点地址 | `https://lilicould.cn` |
| `NUXT_PUBLIC_UPLOAD_MODE` | 上传模式：`direct` 前端直传，`proxy` 后端中转 | `direct` |

示例：

```bash
NUXT_API_BASE=http://localhost:8080
NUXT_PUBLIC_SITE_URL=https://example.com
NUXT_PUBLIC_UPLOAD_MODE=direct
```

开发和生产配置分别放在 `.env.development`、`.env.production`。不要把 Token、数据库密码等敏感信息提交到仓库。

---

## 路由一览

| 路径 | 页面 | 权限 | 布局 |
|---|---|---|---|
| `/` | 首页 | - | default |
| `/article/:slug` | 文章详情 | - | default |
| `/article/id/:id` | 按 ID 访问文章（兼容旧链接） | - | default |
| `/categories` | 分类总览 | - | default |
| `/category/:slug` | 分类文章列表 | - | default |
| `/tag/:slug` | 标签文章列表 | - | default |
| `/search?q=` | 搜索结果 | - | default |
| `/about` | 关于 | - | default |
| `/user/:id` | 用户公开主页 | - | default |
| `/user/me` | 我的主页 | 登录 | default |
| `/profile/edit` | 编辑资料 | 登录 | default |
| `/login` | 登录 | - | blank |
| `/register` | 注册 | - | blank |
| `/write` | 写文章 | 登录 | blank |
| `/write/:id` | 编辑文章 | 登录 | blank |
| `/admin` | 管理仪表盘 | 管理员 | admin |
| `/admin/articles` | 文章管理 | 管理员 | admin |
| `/admin/categories` | 分类管理 | 管理员 | admin |
| `/admin/tags` | 标签管理 | 管理员 | admin |
| `/admin/comments` | 评论管理 | 管理员 | admin |
| `/admin/users` | 用户管理 | 管理员 | admin |
| `/admin/audit-logs` | 审计日志 | 管理员 | admin |
| `/*` | 404 页面 | - | default |

---

## 构建与部署

```bash
yarn build
```

构建产物位于 `.output/`，由 Node 运行：

```bash
node .output/server/index.mjs
```

生产环境推荐：

- 使用 systemd 运行 Nuxt SSR，监听 `127.0.0.1:3000`
- 使用 Nginx 或 OpenResty 反向代理 `80/443`
- 浏览器始终请求同源 `/api`、`/auth`、`/file`

完整步骤、systemd 单元和 Nginx 配置见 [deploy/DEPLOY.md](deploy/DEPLOY.md)。

仓库也提供 GitHub Actions 工作流 `.github/workflows/deploy.yml`，在推送到 `main` 时构建并部署 `.output/`。

---

## 开发规范

- **语言**：TypeScript 严格模式
- **框架**：Vue 3 Composition API + `<script setup>`
- **样式**：Tailwind CSS 工具类优先，主题由 CSS 变量驱动
- **组件命名**：PascalCase，文件名与组件名保持一致
- **自动导入**：使用 Nuxt 内置自动导入，无需手动导入 Vue、Router、Pinia API
- **提交规范**：遵循 [Conventional Commits](https://www.conventionalcommits.org/)
- **提交前检查**：执行 `yarn typecheck` 和 `yarn build`

---

## 许可证

[MIT License](LICENSE)

---

## 关于

- 作者：**LiliCould**（立里可）
- 网站：<https://lilicould.cn>
- GitHub：<https://github.com/LiliCould>
