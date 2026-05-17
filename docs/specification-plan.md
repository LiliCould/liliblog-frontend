# 立里博客 LiliBlog 前端重构 — 详细规格计划书

> 版本: v1.0  
> 日期: 2026-05-17  
> 状态: 待审批

---

## 目录

1. [项目概述](#1-项目概述)
2. [现状分析与差距评估](#2-现状分析与差距评估)
3. [重构范围与目标](#3-重构范围与目标)
4. [技术方案与方法论](#4-技术方案与方法论)
5. [实施阶段划分](#5-实施阶段划分)
6. [质量保障与测试策略](#6-质量保障与测试策略)
7. [风险识别与缓解方案](#7-风险识别与缓解方案)
8. [交付物与验收标准](#8-交付物与验收标准)
9. [附录](#9-附录)

---

## 1. 项目概述

### 1.1 背景

立里博客（LiliBlog）前端项目基于 Vue 3 + Vite + Tailwind CSS v4 构建，目前已具备基础的文章展示、用户认证、后台管理等功能。根据 `docs/` 目录下的五份设计文档（API 文档、技术栈选型、UI 风格规范、整体设计、开发规范），项目需要在以下维度进行系统性重构，以完全对齐设计规范并提升代码质量与可维护性。

### 1.2 重构目标

- **完全对齐设计规范**：实现文档中定义的新人文主义界面（Neo-Humanist Interface）与反算法美学
- **架构升级**：引入组合式函数（Composables）、完善类型系统、优化状态管理
- **功能补全**：实现评论系统、Hero 特效组件、移动端抽屉等缺失功能
- **代码质量**：统一注释规范、完善错误处理、提升类型安全
- **目录结构重组**：按功能域重新组织源码，提升可维护性

---

## 2. 现状分析与差距评估

### 2.1 当前架构概览

| 维度 | 当前状态 |
|------|----------|
| 框架 | Vue 3.5 + Composition API + `<script setup>` |
| 构建工具 | Vite 6 |
| 路由 | Vue Router 4（History 模式 + 路由守卫） |
| 状态管理 | Pinia 2（auth / app / theme 三个 Store） |
| HTTP | Axios（统一实例 + 拦截器 + Token 刷新） |
| CSS | Tailwind CSS v4 + 自定义 CSS 变量 |
| 图标 | Lucide Vue Next |
| 编辑器 | Vditor |
| 包管理 | Yarn |

### 2.2 差距矩阵

| 领域 | 当前状态 | 目标状态 | 差距等级 |
|------|----------|----------|----------|
| **路由架构** | 扁平路由，无嵌套路由布局 | 嵌套路由 + 布局组件自动匹配 | 中 |
| **API 层** | 基础封装，部分类型缺失 | 完整类型覆盖 + 统一错误处理 + 请求缓存策略 | 中 |
| **UI/UX 设计** | Neo-Brutalism 硬边风格 | Neo-Humanist 柔和几何 + 内容驱动色谱 | **高** |
| **功能完整性** | 评论系统未实现、Hero 无动效、缺少特效组件 | 完整评论嵌套、GlitchText/TypewriterText/NoiseOverlay | **高** |
| **目录结构** | 基础分层（api/components/views/stores） | 功能域组织 + composables + 完善的 ui/comment 子目录 | 中 |
| **代码规范** | 部分注释、基础 ESLint/Prettier | 全中文注释、严格类型、统一命名 | 中 |
| **响应式布局** | 基础断点处理 | 完整三栏响应式 + 移动端抽屉 | 中 |
| **主题系统** | 硬切暗色模式 | 硬切 + 故障切换效果 + 系统偏好同步 | 低 |

---

## 3. 重构范围与目标

### 3.1 组件一：应用路由架构重构

#### 3.1.1 范围

- 路由配置重组为嵌套结构
- 布局组件通过路由元信息自动匹配
- 路由守卫增强（权限校验、重定向、滚动行为）

#### 3.1.2 目标

- 公开页面（`/`、`/article/:id`、`/category/:slug`、`/tag/:slug`、`/about`、`/login`）使用 `MainLayout`
- 需登录页面（`/user/me`、`/settings`）使用 `MainLayout` + 路由守卫
- 管理员页面（`/admin/*`、`/write`、`/write/:id`、`/register`）使用独立布局
- 实现路由级懒加载与预加载策略

#### 3.1.3 路由映射表

| 路径 | 名称 | 布局 | 权限 | 说明 |
|------|------|------|------|------|
| `/` | Home | MainLayout | 公开 | Hero + 三栏文章列表 |
| `/article/:id` | ArticleDetail | MainLayout | 公开 | 文章详情 + 评论 |
| `/category/:slug` | Category | MainLayout | 公开 | 分类文章列表 |
| `/tag/:slug` | Tag | MainLayout | 公开 | 标签文章列表 |
| `/about` | About | MainLayout | 公开 | 关于页面（ID=1 文章） |
| `/login` | Login | None | 公开 | 登录页（独立居中） |
| `/user/me` | MyHome | MainLayout | 需登录 | 我的文章（状态筛选） |
| `/user/:id` | UserHome | MainLayout | 公开 | 用户主页 |
| `/settings` | Settings | MainLayout | 需登录 | 账号设置 |
| `/register` | Register | None | 需管理员 | 注册新用户 |
| `/write` | Write | None | 需管理员 | 写文章 |
| `/write/:id` | EditArticle | None | 需管理员 | 编辑文章 |
| `/admin` | AdminDashboard | AdminLayout | 需管理员 | 仪表盘 |
| `/admin/articles` | AdminArticles | AdminLayout | 需管理员 | 文章管理 |
| `/admin/categories` | AdminCategories | AdminLayout | 需管理员 | 分类管理 |
| `/admin/tags` | AdminTags | AdminLayout | 需管理员 | 标签管理 |
| `/admin/comments` | AdminComments | AdminLayout | 需管理员 | 评论管理 |

---

### 3.2 组件二：API 接口实现重构

#### 3.2.1 范围

- Axios 实例配置优化
- 响应拦截器增强（无感刷新、统一错误处理）
- API 模块类型补全
- 新增请求缓存与去重机制

#### 3.2.2 目标

- 双令牌机制完整实现（accessToken → localStorage；refreshToken → http-only Cookie）
- 401 自动刷新并重试原请求
- refreshToken 过期时自动跳转登录页
- 所有 API 函数返回类型完整定义
- 统一错误码处理与 Toast 提示

#### 3.2.3 API 模块清单

| 模块 | 文件 | 接口数 | 状态 |
|------|------|--------|------|
| 认证 | `auth.ts` | 5 | 已存在，需增强错误处理 |
| 用户 | `user.ts` | 3 | 已存在，类型完整 |
| 文章 | `article.ts` | 8 | 已存在，需补全参数类型 |
| 分类 | `category.ts` | 6 | 已存在，类型完整 |
| 标签 | `tag.ts` | 5 | 已存在，类型完整 |
| 评论 | `comment.ts` | 4 | 已存在，需验证嵌套场景 |
| 文件 | `file.ts` | 1 | 已存在，类型完整 |

---

### 3.3 组件三：UI/UX 设计系统重构

#### 3.3.1 范围

- 全局样式系统升级（CSS 变量、暗色模式、色彩层级）
- 布局组件重构（三栏网格、响应式断点）
- 特效组件实现（GlitchText、TypewriterText、NoiseOverlay）
- 组件圆角/阴影/边框统一调整

#### 3.3.2 设计 Token 系统

| Token | 值 | 用途 |
|-------|-----|------|
| `--bg-canvas` | `#ffffff` / `#0f172a` | 页面背景 |
| `--bg-surface` | `#f8fafc` / `#1e293b` | 卡片、面板 |
| `--primary` | `#4f46e5` | 链接、按钮、激活态 |
| `--accent-toxic` | `#a3e635` | 状态筛选下划线、Hover 高亮 |
| `--accent-rose` | `#f43f5e` | 点赞数、热度、删除、错误 |
| `--accent-amber` | `#f59e0b` | "新文章"角标、警告 |
| `--text-title` | `#0f172a` / `#ffffff` | 标题 |
| `--text-body` | `#334155` / `#cbd5e1` | 正文 |
| `--text-meta` | `#64748b` / `#94a3b8` | 元数据、时间 |

#### 3.3.3 圆角规范调整

| Token | 当前值 | 目标值 | 用途 |
|-------|--------|--------|------|
| 封面图圆角 | `0px` | `12px` (rounded-xl) | 现代友好 |
| 卡片容器圆角 | `0px` | `16px` (rounded-2xl) | App-like 年轻感 |
| 标签/徽章 | `0px` | `9999px` (Pill) | 胶囊形态 |
| 头像 | `0px` | `50%` (Circular) | 人格化 |

#### 3.3.4 阴影规范调整

| 场景 | 当前值 | 目标值 |
|------|--------|--------|
| 卡片默认 | 硬阴影 `4px 4px 0px` | 弥散阴影 `0 1px 2px rgba(15,23,42,0.05)` |
| 卡片 Hover | 位移 + 阴影消失 | `translateY(-4px)` + `0 4px 6px rgba(15,23,42,0.1)` |

#### 3.3.5 新增特效组件

| 组件 | 功能 | 实现方式 |
|------|------|----------|
| `GlitchText.vue` | Hero 主标题抖音故障闪动 | CSS `text-shadow` 错位 + `clip-path` 切片动画 |
| `TypewriterText.vue` | Hero 副标题打字机效果 | JS 逐字显示 + 闪烁光标 `_` |
| `NoiseOverlay.vue` | 全局噪点纹理叠加 | `fixed` + `opacity-5` + `pointer-events-none` |
| `SocialLinks.vue` | 社交链接图标组 | Lucide 图标 + 悬停毒性色高亮 |

---

### 3.4 组件四：功能增强

#### 3.4.1 评论系统完整实现

- 一级评论列表展示（`GET /api/comment?id={articleId}`）
- 二级评论嵌套加载（`GET /api/comment/child?id={rootCommentId}`）
- 评论发布（`POST /api/comment`）
- 评论删除（`DELETE /api/comment/{id}`）
- 评论组件：`CommentItem.vue`（递归/嵌套层级）、`CommentSection.vue`

#### 3.4.2 Hero 区域升级

- 背景图 + 暗色遮罩
- `GlitchText` 主标题动画
- `TypewriterText` 副标题打字机效果
- 全局噪点层叠加

#### 3.4.3 我的文章状态筛选

- 全部 / 已发布 / 审核中 / 草稿 胶囊形筛选标签
- 毒性色 Chartreuse 下划线高亮当前激活项
- 切换时硬切无动画

#### 3.4.4 移动端体验优化

- 左侧边栏抽屉（`< 768px` 时汉堡菜单展开）
- 右侧边栏内容折叠到页面底部
- 响应式断点完整实现

#### 3.4.5 关于页面重构

- 从静态内容改为动态加载 `GET /api/article/1`
- 使用 `contentHtml` + `prose` 渲染
- 布局同文章详情页

---

### 3.5 组件五：项目目录结构重组

#### 3.5.1 目标目录结构

```
src/
├── api/                          # API 封装（已存在，优化）
│   ├── index.ts                  # Axios 实例 + 拦截器
│   ├── auth.ts
│   ├── article.ts
│   ├── category.ts
│   ├── tag.ts
│   ├── comment.ts
│   ├── user.ts
│   └── file.ts
├── components/
│   ├── layout/                   # 布局组件
│   │   ├── MainLayout.vue        # 三栏布局（原 AppLayout）
│   │   ├── AdminLayout.vue       # 后台 Sidebar 布局
│   │   ├── AppHeader.vue         # 顶部导航
│   │   ├── AppFooter.vue         # 页脚
│   │   ├── LeftSidebar.vue       # 左侧边栏（原 AppSidebar）
│   │   ├── RightSidebar.vue      # 右侧边栏
│   │   └── MobileDrawer.vue      # 移动端侧边栏抽屉（新增）
│   ├── article/
│   │   ├── ArticleCard.vue       # 文章卡片（重构样式）
│   │   ├── ArticleList.vue       # 文章列表（含分页，新增）
│   │   └── ArticleMeta.vue       # 文章元数据行（新增）
│   ├── comment/                  # 评论组件（新增目录）
│   │   ├── CommentItem.vue       # 评论项（嵌套层级）
│   │   └── CommentSection.vue    # 评论区容器
│   ├── ui/                       # 特效/UI 组件（新增目录）
│   │   ├── GlitchText.vue        # 抖音故障文字
│   │   ├── TypewriterText.vue    # 打字机效果
│   │   ├── NoiseOverlay.vue      # 全局噪点层
│   │   ├── Pagination.vue        # 分页器（从 common 迁移）
│   │   ├── Toast.vue             # 消息提示（新增）
│   │   ├── ConfirmDialog.vue     # 确认弹窗（新增）
│   │   ├── EmptyState.vue        # 空状态（从 common 迁移）
│   │   ├── LoadingBlock.vue      # 加载态（从 common 迁移）
│   │   └── ErrorState.vue        # 错误态（新增）
│   └── user/
│       ├── UserCard.vue          # 用户信息卡片（新增）
│       └── SocialLinks.vue       # 社交链接组（新增）
├── composables/                  # 组合式函数（新增目录）
│   ├── useAuth.ts                # 认证逻辑封装
│   ├── useTheme.ts               # 主题切换逻辑
│   ├── useArticle.ts             # 文章数据获取封装
│   ├── useComment.ts             # 评论数据获取封装
│   └── useApi.ts                 # API 调用通用封装
├── stores/                       # Pinia 状态（已存在，优化）
│   ├── auth.ts
│   ├── theme.ts
│   └── app.ts
├── router/
│   └── index.ts                  # 路由配置 + 导航守卫
├── types/                        # TypeScript 类型（已存在，补全）
│   ├── index.ts
│   ├── api.ts
│   ├── user.ts
│   ├── article.ts
│   ├── category.ts
│   ├── tag.ts
│   └── comment.ts
├── utils/                        # 工具函数（已存在，优化）
│   ├── format.ts
│   ├── storage.ts
│   └── validate.ts
├── assets/
│   └── styles/
│       └── global.css            # 全局样式 + Tailwind + 自定义变量
├── views/                        # 页面视图
│   ├── HomeView.vue              # 首页（Hero + 三栏）
│   ├── UserHomeView.vue          # 用户首页（重构状态筛选）
│   ├── ArticleDetailView.vue     # 文章详情（重构 + 评论）
│   ├── CategoryView.vue          # 分类文章
│   ├── TagView.vue               # 标签文章
│   ├── AboutView.vue             # 关于（重构为动态加载）
│   ├── LoginView.vue             # 登录
│   ├── RegisterView.vue          # 注册
│   ├── WriteView.vue             # 写文章/编辑
│   ├── SettingsView.vue          # 用户设置
│   └── admin/                    # 后台管理
│       ├── DashboardView.vue
│       ├── ArticleManage.vue
│       ├── CategoryManage.vue
│       ├── TagManage.vue
│       └── CommentManage.vue
├── App.vue
└── main.ts
```

---

## 4. 技术方案与方法论

### 4.1 路由架构方案

- 使用 Vue Router 嵌套路由（children）将布局与页面解耦
- 路由元信息（`meta.layout`、`meta.requiresAuth`、`meta.requiresAdmin`）驱动布局切换
- `App.vue` 中通过 `route.matched` 或 `meta.layout` 动态渲染对应 Layout 组件
- 路由守卫统一处理权限校验与重定向

### 4.2 API 层方案

- Axios 实例保持单例模式
- 请求拦截器：自动附加 `Authorization: Bearer` 头
- 响应拦截器：
  - 正常响应：返回 `response.data`
  - 401 错误：调用 `/auth/refresh` 刷新 Token，成功后重试原请求
  - refreshToken 过期：清除状态并跳转 `/login`
- 统一错误处理：根据 `code` 和 `msg` 显示 Toast 提示

### 4.3 UI/UX 方案

- Tailwind CSS v4 原子化样式为主
- CSS 变量驱动主题系统（亮色/暗色模式）
- 硬切主题切换（0ms 过渡）
- 组件圆角、阴影、边框严格遵循设计 Token
- 特效组件使用纯 CSS/JS 实现，不引入额外动效库

### 4.4 状态管理方案

- Pinia 保持三个 Store：
  - `auth.ts`：用户认证状态（token、userInfo、isAdmin）
  - `theme.ts`：主题状态（isDark、硬切切换）
  - `app.ts`：应用 UI 状态（sidebarOpen、pageTitle、globalLoading）
- 新增 Composables 封装业务逻辑（useAuth、useTheme、useArticle 等）

### 4.5 代码规范方案

- 所有注释使用中文编写
- 函数/组件/类型定义使用 JSDoc 注释
- ESLint + Prettier 统一代码风格
- 命名规范：
  - 组件文件：PascalCase（`ArticleCard.vue`）
  - 组合式函数：camelCase + `use` 前缀（`useAuth.ts`）
  - 类型接口：PascalCase（`UserInfo`）
  - 常量：UPPER_SNAKE_CASE

---

## 5. 实施阶段划分

### 阶段一：基础架构重构（预计 2-3 天）

| 任务 | 说明 |
|------|------|
| 5.1.1 目录结构重组 | 新建 `composables/`、`components/ui/`、`components/comment/` 目录；迁移现有组件 |
| 5.1.2 路由架构重构 | 实现嵌套路由 + 布局自动匹配；完善路由守卫 |
| 5.1.3 API 层优化 | 增强拦截器错误处理；补全类型定义；统一错误码处理 |
| 5.1.4 全局样式升级 | 更新 CSS 变量（色彩、圆角、阴影）；调整 `global.css` |

### 阶段二：核心组件重构（预计 3-4 天）

| 任务 | 说明 |
|------|------|
| 5.2.1 布局组件重构 | `MainLayout` 三栏响应式；`LeftSidebar`/`RightSidebar` 样式调整；新增 `MobileDrawer` |
| 5.2.2 文章卡片重构 | `ArticleCard` 圆角/阴影调整；新增 `ArticleList`、`ArticleMeta` |
| 5.2.3 特效组件实现 | `GlitchText`、`TypewriterText`、`NoiseOverlay` |
| 5.2.4 通用 UI 组件 | `Toast`、`ConfirmDialog`、`ErrorState` |

### 阶段三：功能增强（预计 3-4 天）

| 任务 | 说明 |
|------|------|
| 5.3.1 评论系统实现 | `CommentItem`（嵌套）、`CommentSection`；一级/二级评论加载与发布 |
| 5.3.2 Hero 区域升级 | 背景图 + `GlitchText` + `TypewriterText` + 噪点层 |
| 5.3.3 我的文章状态筛选 | 胶囊形筛选标签 + 毒性色下划线 |
| 5.3.4 关于页面重构 | 动态加载 `GET /api/article/1`；`prose` 渲染 |
| 5.3.5 用户首页横幅 | 顶部横幅背景图 + 用户信息区域 |

### 阶段四：后台管理与优化（预计 2-3 天）

| 任务 | 说明 |
|------|------|
| 5.4.1 后台页面优化 | 仪表盘统计、文章/分类/标签/评论管理表格优化 |
| 5.4.2 写文章页面优化 | Vditor 主题同步、标签多选组件 |
| 5.4.3 移动端适配 | 抽屉菜单、底部折叠边栏、触摸优化 |
| 5.4.4 性能优化 | 路由懒加载、图片懒加载、组件按需渲染 |

### 阶段五：质量保障与验收（预计 2 天）

| 任务 | 说明 |
|------|------|
| 5.5.1 类型检查 | `vue-tsc --noEmit` 全量类型检查 |
| 5.5.2 代码检查 | ESLint + Prettier 全量检查与修复 |
| 5.5.3 功能测试 | 各页面功能走查、API 联调 |
| 5.5.4 响应式测试 | 多端断点测试（xl/lg/md/sm） |
| 5.5.5 暗色模式测试 | 主题切换、组件暗色样式验证 |

---

## 6. 质量保障与测试策略

### 6.1 代码质量检查

| 检查项 | 工具 | 标准 |
|--------|------|------|
| 类型检查 | `vue-tsc --noEmit` | 零类型错误 |
| 代码风格 | ESLint + Prettier | 全量通过 |
| 注释规范 | 人工审查 | 所有函数/组件/复杂逻辑必须有中文注释 |
| 命名规范 | 人工审查 | 符合 PascalCase/camelCase/UPPER_SNAKE_CASE 规范 |

### 6.2 功能测试策略

| 模块 | 测试点 |
|------|--------|
| 路由 | 各页面访问正常、权限控制生效、404 处理 |
| 认证 | 登录/登出/Token 刷新/权限校验 |
| 文章 | 列表分页、详情渲染、点赞/取消点赞 |
| 评论 | 一级评论加载、二级评论展开、发布/删除 |
| 分类/标签 | 筛选、文章列表展示 |
| 后台管理 | CRUD 操作、状态切换、分页 |
| 主题 | 亮色/暗色切换、系统偏好同步、持久化 |
| 响应式 | 三栏/两栏/单栏布局切换、抽屉菜单 |

### 6.3 验收标准

- 所有页面无控制台报错（除允许的 `console.error`/`console.warn`）
- 类型检查零错误
- ESLint 零错误（warn 允许）
- 暗色/亮色模式切换正常
- 移动端布局无溢出或错位
- API 调用正常，无 401/403 异常（除预期场景）

---

## 7. 风险识别与缓解方案

| 风险 | 影响 | 可能性 | 缓解方案 |
|------|------|--------|----------|
| Tailwind v4 样式冲突 | 高 | 中 | 逐步替换样式类，保留旧类作为 fallback；每阶段完成后验证 |
| 评论嵌套组件复杂度 | 中 | 高 | 采用扁平化递归组件，限制嵌套层级；充分测试边界情况 |
| Token 刷新并发问题 | 高 | 中 | 使用队列机制确保同时只有一个刷新请求；添加 `_retry` 标记 |
| 移动端抽屉交互 bug | 中 | 中 | 使用标准 CSS transform 动画；充分测试触摸事件 |
| Vditor 主题同步问题 | 低 | 中 | 监听 `html.dark` 类变化，动态调用 Vditor 主题切换 API |
| 重构范围过大导致延期 | 高 | 中 | 严格按阶段执行，每阶段结束后评审；必要时裁剪低优先级功能 |
| 后端 API 与文档不一致 | 中 | 低 | 提前与后端确认接口字段；前端添加防御性编程（可选链、默认值） |

---

## 8. 交付物与验收标准

### 8.1 交付物清单

| 编号 | 交付物 | 说明 |
|------|--------|------|
| D1 | 重构后的源代码 | 完整 `src/` 目录，符合新目录结构 |
| D2 | 路由配置文件 | `src/router/index.ts`，嵌套路由 + 守卫 |
| D3 | API 层代码 | `src/api/`，完整类型覆盖 + 错误处理 |
| D4 | 组件库 | `src/components/`，含新增特效组件 |
| D5 | 组合式函数 | `src/composables/`，业务逻辑封装 |
| D6 | 状态管理 | `src/stores/`，Pinia Store |
| D7 | 全局样式 | `src/assets/styles/global.css`，设计 Token |
| D8 | 类型定义 | `src/types/`，完整 TypeScript 类型 |
| D9 | 构建产物 | `yarn build` 成功，无类型/语法错误 |

### 8.2 验收标准

- **功能验收**：所有文档中定义的页面和功能正常运行
- **设计验收**：UI 符合设计规范（色彩、圆角、阴影、动效）
- **代码验收**：类型检查通过、ESLint 通过、注释完整
- **性能验收**：首屏加载时间 < 3s（开发环境）、路由切换流畅
- **兼容性验收**：Chrome/Firefox/Edge 最新版正常、移动端布局正常

---

## 9. 附录

### 9.1 参考文档

- `00-立里博客 LiliBlog API 文档 .md` — 后端接口规范
- `01-技术栈选型.md` — 技术选型说明
- `02-UI风格规范.md` — UI 设计规范
- `03-整体设计.md` — 完整设计文档（含页面设计、组件设计、API 映射）
- `04-开发规范文档.md` — 代码规范、Git 规范、测试规范

### 9.2 关键设计决策

1. **不使用 shadcn-vue**：虽然技术栈选型文档提到，但当前项目已使用纯 Tailwind CSS，引入 shadcn-vue 会增加复杂度。保持现有方案，通过自定义组件实现设计规范。
2. **不引入 GSAP**：特效组件（GlitchText、TypewriterText）使用纯 CSS/JS 实现，避免引入额外依赖。
3. **保持 Vditor**：Markdown 编辑器继续使用 Vditor，已验证与 Vue 3 兼容。
4. **评论嵌套限制**：前端限制评论嵌套展示层级为 2 级（一级 + 二级），与后端设计一致。

### 9.3 变更日志

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2026-05-17 | 初始版本，基于五份设计文档编制 |

---

> **审批状态**: 待审批  
> **审批人**: ________________  
> **审批日期**: ________________  
> **备注**: ________________
