# LiliBlog 前端移动端全面适配规格文档

## 一、项目概况

- **项目**: liliblog-frontend
- **框架**: Vue 3 + Vite + TypeScript + Tailwind CSS 3
- **UI 库**: radix-vue (Headless) + lucide-vue-next
- **主题**: CSS 变量驱动的多主题系统（4 个主题）
- **当前移动端状态**: 仅有基础的汉堡菜单 + 侧边抽屉，大量页面和组件在移动端不可用或体验极差

---

## 二、适配原则

1. **移动优先断点**: 使用 Tailwind 的 `max-md:` / `md:` 断点策略，确保 PC/平板端不受影响
2. **不使用局部 CSS**: 所有适配通过 Tailwind 响应式类和组件结构调整实现，保持项目整体设计一致性
3. **不破坏 PC/平板端**: 所有移动端适配仅在 `md` 以下（<768px）生效，`md` 及以上断点样式不变
4. **触摸友好**: 所有可交互元素最小触摸目标 44x44px
5. **渐进增强**: 移动端隐藏非核心信息，保留核心功能

---

## 三、断点策略

| 断点 | 宽度范围 | 目标设备 |
|------|---------|---------|
| `sm` | ≥640px | 大屏手机横屏/小平板 |
| `md` | ≥768px | 平板竖屏 |
| `lg` | ≥1024px | 平板横屏/小笔记本 |

**移动端适配范围**: `<768px`（即 `max-md:` 或 `md:` 反向）

---

## 四、详细适配方案

### 4.1 移动端首屏 Hero 图取消

**文件**: `src/components/common/HeroCarousel.vue`, `src/views/home/HomeView.vue`

**问题**: Hero 轮播图占据全屏高度（`h-screen`），在移动端浪费首屏空间，用户需要滚动才能看到文章内容。

**方案**:
- 在 `HomeView.vue` 中，通过 `max-md:` 断点隐藏 Hero 区域
- `AppLayout` 的 `showHero` prop 在移动端不生效
- 不修改 HeroCarousel 组件本身，仅在父级控制显示

**具体改动**:

```
HomeView.vue:
- <AppLayout :show-hero="true"> 
+ <AppLayout :show-hero="true" class="[&_.hero-wrapper]:max-md:hidden">

AppLayout.vue:
- 为 hero slot 的包裹 div 添加 class="hero-wrapper"
```

**影响范围**: 仅移动端首页，PC/平板端 Hero 正常显示

---

### 4.2 写文章界面移动端适配

**文件**: `src/views/manage/ArticleEditor.vue`, `src/components/article/MarkdownEditor.vue`

**问题**:
1. 元数据面板 `w-80`（320px）在移动端占据全部宽度，编辑器不可见
2. `metaOpen` 默认 `true`，移动端首次加载侧边栏打开
3. 侧边栏切换按钮 `w-8`（32px）触摸目标过小
4. Header 按钮在移动端拥挤
5. Vditor 编辑器工具栏溢出，预览模式 `both` 在移动端不可用

**方案**:

#### ArticleEditor.vue 改动:

1. **元数据面板改为移动端底部抽屉**:
   - 移动端（`max-md:`）时，元数据面板从右侧固定面板改为从底部滑出的抽屉
   - 抽屉高度为屏幕的 70%（`h-[70dvh]`），可通过拖拽手柄关闭
   - 使用 `fixed inset-x-0 bottom-0` 定位

2. **移动端默认关闭元数据面板**:
   - 检测屏幕宽度，移动端 `metaOpen` 默认为 `false`
   - 切换按钮在移动端放大为 `w-10 h-10`（40px），增加触摸区域

3. **Header 按钮精简**:
   - 移动端仅显示图标按钮，隐藏文字（已有 `hidden sm:inline`）
   - 按钮间距调整为 `gap-1`
   - 自动保存状态仅显示图标

4. **编辑器全宽**:
   - 移动端编辑器 `flex-1` 占满全宽

#### MarkdownEditor.vue 改动:

1. **Vditor 配置响应式调整**:
   - 移动端禁用 `outline`（大纲面板）
   - 移动端预览模式改为 `editor`（仅编辑器），提供预览切换按钮
   - 移动端工具栏精简（保留核心按钮：标题、加粗、斜体、链接、代码、列表、图片上传）

2. **实现方式**:
   - 在 `onMounted` 中检测窗口宽度
   - 监听 `resize` 事件动态调整 Vditor 配置
   - 使用 `window.innerWidth < 768` 判断

**影响范围**: 仅 `/write` 和 `/write/:id` 页面的移动端视图

---

### 4.3 "我的主页"界面组件挤压

**文件**: `src/views/user/UserProfile.vue`

**问题**:
1. 头像 `w-24 h-24` + 操作按钮在 320px 宽度下挤压
2. 文章列表元信息溢出
3. 操作按钮 `w-7 h-7`（28px）触摸目标过小
4. 状态标签栏在移动端可能溢出
5. Banner 高度固定 `h-32`

**方案**:

1. **用户信息卡移动端纵向布局**:
   - 移动端 Banner 高度减小为 `h-24`
   - 头像缩小为 `w-16 h-16`
   - 头像和按钮区域改为垂直排列（`max-md:flex-col`）
   - 按钮区域 `max-md:w-full`，按钮 `max-md:flex-1`

2. **状态标签栏横向滚动**:
   - 添加 `overflow-x-auto` + `flex-nowrap`
   - 隐藏滚动条（`scrollbar-hide`）
   - 每个标签 `shrink-0` 防止压缩

3. **文章列表元信息精简**:
   - 移动端隐藏更新时间、评论数
   - 标签区域限制最多显示 2 个 + "更多"提示
   - 操作按钮放大为 `w-9 h-9`（36px），增加触摸区域

4. **文章卡片移动端紧凑布局**:
   - 减少内边距 `max-md:p-3`
   - 分类和标签使用更小字号 `max-md:text-xs`

**影响范围**: 仅 `/user/me` 和 `/user/:id` 页面的移动端视图

---

### 4.4 底部导航栏

**文件**: 新建 `src/components/layout/MobileBottomNav.vue`，修改 `src/App.vue`

**问题**:
- 当前移动端导航依赖汉堡菜单 + 右侧抽屉，入口深、操作多
- 移动端缺少搜索、分类、标签云等核心功能的快速入口
- 没有底部 Tab 导航，不符合移动端 UX 习惯

**方案**:

#### 新建 MobileBottomNav.vue:

1. **底部固定导航栏**:
   - 5 个 Tab: 首页、分类、搜索、我的、菜单（更多）
   - 固定在底部 `fixed bottom-0 inset-x-0`
   - 高度 `h-14`（56px），包含安全区域 `pb-safe`
   - 仅在移动端显示 `md:hidden`

2. **Tab 设计**:
   - 图标 + 文字标签
   - 当前页高亮（使用主题色）
   - 点击切换路由
   - "菜单" Tab 点击打开 MobileNav 抽屉

3. **图标选择**（lucide-vue-next）:
   - 首页: `Home`
   - 分类: `LayoutGrid`
   - 搜索: `Search`
   - 我的: `User`
   - 菜单: `Menu`

4. **安全区域适配**:
   - 使用 `env(safe-area-inset-bottom)` 适配 iPhone 底部安全区域

#### App.vue 改动:

1. 在 Default 布局中添加 MobileBottomNav 组件
2. 主内容区添加移动端底部内边距 `pb-14 md:pb-0`
3. AppFooter 在移动端隐藏（底部导航替代）

#### AppHeader.vue 改动:

1. 移动端隐藏汉堡菜单按钮（由底部导航"菜单"替代）
2. 移动端 Logo 区域居中显示

**影响范围**: 仅移动端，PC/平板端不显示底部导航

---

### 4.5 分页组件展示优化

**文件**: `src/components/ui/Pagination.vue`

**问题**:
1. 三栏并排（每页条数 | 页码 | 总数）在移动端溢出
2. 页码按钮 `w-8 h-8`（32px）触摸目标过小
3. 页码过多时溢出
4. 每页条数选择器在移动端不直观

**方案**:

1. **移动端三行堆叠布局**:
   - 第一行: 页码按钮区域（居中）
   - 第二行: 每页条数选择器 + 总条数（两端对齐）
   - 使用 `max-md:flex-col max-md:gap-3` 实现

2. **页码按钮放大**:
   - 移动端 `max-md:w-10 max-md:h-10`（40px），接近 44px 触摸目标
   - 移动端减少显示页码数量（最多显示 5 个 + 省略号）

3. **页码数量移动端精简**:
   - 修改 `displayedPages` 计算逻辑，移动端最多显示 3 个页码
   - 通过 `isMobile` 状态或 `window.innerWidth` 判断

4. **每页条数选择器移动端简化**:
   - 移动端选项减少为: 5/10/20
   - 触摸目标放大

**影响范围**: 所有使用 Pagination 组件的页面，但仅移动端布局变化

---

### 4.6 管理后台移动端适配

**文件**: `src/components/layout/AdminLayout.vue`, 所有 `src/views/admin/*.vue`

**问题**:
1. 多列表格在移动端完全不可用
2. 筛选区域在移动端堆叠过长
3. 内边距 `p-6` 在移动端过大
4. 操作按钮触摸目标过小
5. 弹窗在移动端溢出
6. 分页栏挤压

**方案**:

#### AdminLayout.vue 改动:

1. **主内容区内边距**:
   - `max-md:p-3` 替代 `p-6`
2. **Header 内边距**:
   - `max-md:px-3` 替代 `px-6`
3. **移动端侧边栏导航项触摸目标**:
   - `max-md:py-3` 增加导航项高度

#### 管理后台通用方案 - 表格移动端卡片视图:

1. **表格/卡片双视图**:
   - PC 端（`md:`）: 保持现有表格布局
   - 移动端（`max-md:`）: 隐藏表格，显示卡片列表
   - 每条数据一张卡片，纵向排列关键信息

2. **实现方式**:
   - 在每个管理页面中，表格区域包裹两层:
     ```
     <!-- 桌面端表格 -->
     <div class="hidden md:block">
       <table>...</table>
     </div>
     <!-- 移动端卡片列表 -->
     <div class="md:hidden space-y-3">
       <div v-for="item in data" class="card">...</div>
     </div>
     ```

3. **筛选区域移动端折叠**:
   - 移动端默认折叠筛选区域，仅显示"筛选"按钮
   - 点击展开筛选面板（使用 Transition 动画）
   - 展开后筛选字段全宽 `max-md:w-full`，移除 `min-w-[xxx]` 限制

4. **操作按钮放大**:
   - 移动端卡片中的操作按钮 `w-9 h-9`（36px）

5. **弹窗移动端全屏**:
   - 移动端弹窗 `max-md:inset-2 max-md:max-w-full max-md:max-h-[90dvh]`
   - 弹窗内容可滚动

#### 各管理页面具体适配:

**Dashboard.vue**:
- 统计卡片: 移动端 `grid-cols-2`（已有 `sm:grid-cols-2`，保持）
- 最近文章列表: 移动端简化为标题 + 状态 + 时间，隐藏作者列

**Articles.vue**:
- 移动端卡片: 标题 + 状态标签 + 分类 + 时间 + 操作按钮
- 筛选区折叠
- 预览弹窗移动端全屏

**Categories.vue**:
- 移动端卡片: 名称 + Slug + 文章数 + 操作按钮
- 筛选区折叠

**Tags.vue**:
- 移动端卡片: 颜色圆点 + 名称 + 文章数 + 操作按钮
- 筛选区折叠

**Comments.vue**:
- 移动端卡片: 评论内容（截断）+ 评论者 + 状态 + 时间 + 操作按钮
- 筛选区折叠

**Users.vue**:
- 移动端卡片: 头像 + 用户名 + 昵称 + 角色 + 状态 + 操作按钮
- 编辑弹窗移动端全屏可滚动
- 筛选区折叠

**AuditLogs.vue**:
- 移动端卡片: 用户 + 操作 + 模块 + 状态 + 时间 + 查看详情按钮
- 筛选区折叠
- 详情弹窗移动端全屏

**影响范围**: 所有管理后台页面，但仅移动端布局变化

---

### 4.7 补充问题（用户未提及但需要修复）

#### 4.7.1 移动端搜索入口缺失

**问题**: AppHeader 搜索框 `hidden md:flex`，移动端完全无搜索入口。

**方案**: 通过底部导航"搜索"Tab 解决（见 4.4），点击跳转 `/search` 页面。

#### 4.7.2 移动端侧边栏内容不可访问

**问题**: AppSidebar（分类、MyInfo）和 RightSidebar（随机文章、标签云）在 `lg` 以下完全隐藏。

**方案**:
- 分类: 通过底部导航"分类"Tab 跳转分类页面（已有 CategoryArticles 页面）
- 标签云: 在搜索页面或首页底部添加移动端标签云区域
- MyInfo: 在首页文章列表上方添加移动端博主信息卡（简化版）
- 随机文章: 移动端暂不提供（非核心功能）

#### 4.7.3 文章详情页移动端适配

**文件**: `src/views/article/ArticleDetail.vue`

**问题**:
1. 内边距 `p-8` 在移动端过大
2. 目录（TOC）在移动端不可见
3. 点赞按钮触摸目标过小
4. 封面图 `max-h-[400px]` 在移动端过高

**方案**:
1. `max-md:p-4` 减小内边距
2. 添加移动端 TOC 浮动按钮（右下角），点击弹出 TOC 面板
3. 点赞按钮移动端放大触摸区域 `max-md:px-4 max-md:py-2`
4. 封面图 `max-md:max-h-[200px]`

#### 4.7.4 ArticleCard 移动端优化

**文件**: `src/components/common/ArticleCard.vue`

**问题**:
1. 元信息项过多，移动端换行后卡片过高
2. 摘要 tooltip 在触摸设备无效

**方案**:
1. 移动端隐藏更新时间、评论数、点赞数（`max-md:hidden`）
2. 标签最多显示 2 个 + `+N` 标记
3. 摘要改为移动端直接显示在标题下方（截断 2 行），不使用 tooltip

#### 4.7.5 AppHeader 移动端优化

**文件**: `src/components/layout/AppHeader.vue`

**问题**:
1. 移动端无搜索/登录/主题入口
2. 汉堡菜单按钮与底部导航重复
3. Logo 宽度过大

**方案**:
1. 移动端隐藏汉堡菜单按钮（由底部导航"菜单"替代）
2. 移动端 Header 仅保留 Logo 居中
3. 登录/注册/主题入口通过底部导航"菜单"Tab 打开 MobileNav

#### 4.7.6 AppFooter 移动端适配

**文件**: `src/components/layout/AppLayout.vue` 中的 footer 区域

**方案**:
- 移动端隐藏 AppFooter（底部导航替代），避免底部内容重复
- 或简化为仅显示版权信息一行

#### 4.7.7 h-screen 在移动端不准确

**问题**: HeroCarousel 使用 `h-screen`，移动端浏览器地址栏导致高度不准确。

**方案**: 由于移动端已隐藏 Hero，此问题不再影响。但建议将 `h-screen` 改为 `h-dvh` 以备将来使用。

#### 4.7.8 Hover 交互在触摸设备失效

**问题**: MyInfo.vue 的信息展开、ArticleCard 的摘要 tooltip 依赖 hover。

**方案**:
- MyInfo: 移动端直接展示所有信息，不依赖 hover 展开
- ArticleCard: 见 4.7.4，移动端直接显示摘要

#### 4.7.9 移动端内边距统一优化

**问题**: 多个组件在移动端内边距过大。

**方案**: 统一调整:
- AppLayout: `max-md:px-4`
- ArticleDetail: `max-md:p-4`
- AdminLayout: `max-md:p-3`
- AppFooter: `max-md:px-4`

#### 4.7.10 SearchView 移动端适配

**文件**: `src/views/search/SearchView.vue`

**问题**: 提示文字"在顶部搜索框输入关键词后按回车"在移动端具有误导性。

**方案**:
- 移动端修改提示文字为"输入关键词后按搜索"
- 添加搜索输入框和搜索按钮（移动端专用）

#### 4.7.11 AboutView 移动端适配

**文件**: `src/views/about/AboutView.vue`

**方案**:
- `max-md:p-4` 减小内边距
- 装饰线 `max-md:w-16` 缩短

---

## 五、新增组件清单

| 组件 | 路径 | 说明 |
|------|------|------|
| MobileBottomNav | `src/components/layout/MobileBottomNav.vue` | 移动端底部导航栏 |
| MobileTocPanel | `src/components/article/MobileTocPanel.vue` | 移动端文章目录浮动面板 |

---

## 六、修改文件清单

| 文件 | 修改内容 | 影响范围 |
|------|---------|---------|
| `src/App.vue` | 添加 MobileBottomNav + 移动端底部内边距 | 移动端布局 |
| `src/components/common/HeroCarousel.vue` | 添加 `h-dvh` 替代 `h-screen` | 全端（兼容性提升） |
| `src/views/home/HomeView.vue` | 移动端隐藏 Hero | 仅移动端 |
| `src/components/layout/AppLayout.vue` | 移动端内边距 + hero-wrapper class | 仅移动端 |
| `src/components/layout/AppHeader.vue` | 移动端简化 Header | 仅移动端 |
| `src/components/layout/AppFooter.vue` | 移动端隐藏/简化 | 仅移动端 |
| `src/components/layout/MobileNav.vue` | 触摸目标优化 + active 状态 | 仅移动端 |
| `src/components/layout/AdminLayout.vue` | 移动端内边距 + 触摸目标 | 仅移动端 |
| `src/views/manage/ArticleEditor.vue` | 元数据面板改为底部抽屉 + Header 精简 | 仅移动端 |
| `src/components/article/MarkdownEditor.vue` | Vditor 移动端配置 | 仅移动端 |
| `src/views/user/UserProfile.vue` | 纵向布局 + 标签栏滚动 + 元信息精简 | 仅移动端 |
| `src/components/ui/Pagination.vue` | 移动端堆叠布局 + 按钮放大 | 仅移动端 |
| `src/components/common/ArticleCard.vue` | 移动端元信息精简 + 摘要显示 | 仅移动端 |
| `src/views/article/ArticleDetail.vue` | 内边距 + TOC 浮动按钮 + 封面图 | 仅移动端 |
| `src/views/search/SearchView.vue` | 移动端搜索框 + 提示文字 | 仅移动端 |
| `src/views/about/AboutView.vue` | 内边距 + 装饰线 | 仅移动端 |
| `src/views/admin/Dashboard.vue` | 文章列表移动端简化 | 仅移动端 |
| `src/views/admin/Articles.vue` | 卡片视图 + 筛选折叠 + 弹窗全屏 | 仅移动端 |
| `src/views/admin/Categories.vue` | 卡片视图 + 筛选折叠 | 仅移动端 |
| `src/views/admin/Tags.vue` | 卡片视图 + 筛选折叠 | 仅移动端 |
| `src/views/admin/Comments.vue` | 卡片视图 + 筛选折叠 | 仅移动端 |
| `src/views/admin/Users.vue` | 卡片视图 + 筛选折叠 + 弹窗全屏 | 仅移动端 |
| `src/views/admin/AuditLogs.vue` | 卡片视图 + 筛选折叠 + 弹窗全屏 | 仅移动端 |
| `src/stores/app.ts` | 添加 `isMobile` 状态 | 全局 |
| `src/assets/styles/variables.css` | 添加移动端 CSS 变量 | 全局 |
| `src/assets/styles/reset.css` | 添加移动端通用样式 | 全局 |

---

## 七、实现顺序

### Phase 1: 基础设施（全局状态 + 底部导航）
1. `app.ts` 添加 `isMobile` 状态 + 窗口宽度监听
2. 新建 `MobileBottomNav.vue` 底部导航组件
3. `App.vue` 集成底部导航 + 移动端底部内边距
4. `variables.css` / `reset.css` 添加移动端通用样式

### Phase 2: 布局层适配
5. `AppHeader.vue` 移动端简化
6. `AppLayout.vue` 移动端内边距 + Hero 隐藏
7. `HomeView.vue` 移动端隐藏 Hero
8. `AppFooter.vue` 移动端隐藏/简化
9. `MobileNav.vue` 触摸目标优化

### Phase 3: 前台页面适配
10. `ArticleCard.vue` 移动端元信息精简
11. `ArticleDetail.vue` 内边距 + TOC + 封面图
12. `UserProfile.vue` 纵向布局 + 标签栏
13. `SearchView.vue` 移动端搜索框
14. `AboutView.vue` 内边距调整
15. 新建 `MobileTocPanel.vue` 文章目录浮动面板

### Phase 4: 写文章页面适配
16. `ArticleEditor.vue` 元数据面板底部抽屉
17. `MarkdownEditor.vue` Vditor 移动端配置

### Phase 5: 分页组件
18. `Pagination.vue` 移动端堆叠布局

### Phase 6: 管理后台适配
19. `AdminLayout.vue` 移动端内边距
20. `Dashboard.vue` 文章列表简化
21. `Articles.vue` 卡片视图 + 筛选折叠
22. `Categories.vue` 卡片视图 + 筛选折叠
23. `Tags.vue` 卡片视图 + 筛选折叠
24. `Comments.vue` 卡片视图 + 筛选折叠
25. `Users.vue` 卡片视图 + 筛选折叠 + 弹窗全屏
26. `AuditLogs.vue` 卡片视图 + 筛选折叠 + 弹窗全屏

---

## 八、验收标准

1. 所有页面在 320px-768px 宽度下可用且无水平溢出
2. 所有可交互元素触摸目标 ≥ 40px（尽量接近 44px）
3. PC 端（≥1024px）和平板端（768px-1024px）UI 无任何变化
4. 不引入新的 CSS 文件，所有样式通过 Tailwind 类实现
5. 不修改组件的 Props/Emits 接口（保持向后兼容）
6. 移动端页面加载性能无明显下降
7. 底部导航栏在所有前台页面可见且功能正常
8. 管理后台移动端卡片视图数据完整、操作可用
