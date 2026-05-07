# Tasks

- [x] Task 1: 重构 CSS 变量体系 — 统一赛博朋克暗色主题
  - [x] SubTask 1.1: 重写 `variables.css`，将暖色系变量替换为赛博朋克暗色系变量（背景、文字、边框、阴影、霓虹色系）
  - [x] SubTask 1.2: 移除双重色彩系统，统一 Hero 和内容区变量
  - [x] SubTask 1.3: 新增赛博朋克专用变量（霓虹辉光强度、扫描线、网格背景等）

- [x] Task 2: 重构全局基础样式
  - [x] SubTask 2.1: 重写 `reset.css`，将 body 背景改为暗色渐变 + 网格图案，更新滚动条为霓虹青色
  - [x] SubTask 2.2: 重写 `element-override.css`，将 Element Plus 主题覆盖为暗色赛博朋克风格
  - [x] SubTask 2.3: 重写 `markdown.css`，适配暗色主题（终端风格代码块、霓虹链接、暗色表格）
  - [x] SubTask 2.4: 重写 `transitions.css`，更新 NProgress 为霓虹渐变、页面切换为暗色淡入
  - [x] SubTask 2.5: 优化 `performance.css`，减少 will-change 滥用、添加 content-visibility、优化动画策略

- [x] Task 3: 重构布局组件
  - [x] SubTask 3.1: 重构 `AppHeader.vue` — 暗色半透明背景 + 霓虹 logo + 扫描线装饰
  - [x] SubTask 3.2: 重构 `AppFooter.vue` — 暗色背景 + 霓虹分割线 + 数据流装饰
  - [x] SubTask 3.3: 重构 `AppSidebar.vue` — 暗色毛玻璃面板 + 霓虹边框流光
  - [x] SubTask 3.4: 重构 `MobileNav.vue` — 暗色底部导航 + 霓虹激活指示

- [x] Task 4: 重构通用组件
  - [x] SubTask 4.1: 重构 `ArticleCard.vue` — 暗色卡片 + 霓虹悬浮边框 + 流光效果
  - [x] SubTask 4.2: 重构 `CustomCursor.vue` — 优化性能，保持赛博朋克风格
  - [x] SubTask 4.3: 重构 `EmptyState.vue` — 暗色背景 + 霓虹图标
  - [x] SubTask 4.4: 重构 `SearchBar.vue` — 暗色输入框 + 霓虹聚焦效果
  - [x] SubTask 4.5: 重构 `TagBadge.vue` — 霓虹半透明背景标签
  - [x] SubTask 4.6: 重构 `ChatRoom.vue` — 暗色终端风格聊天界面
  - [x] SubTask 4.7: 重构 `ArticleMeta.vue` — 暗色元信息 + 霓虹图标
  - [x] SubTask 4.8: 重构 `ArticleToc.vue` — 暗色目录 + 霓虹激活指示

- [x] Task 5: 重构页面视图 — 首页与内容页
  - [x] SubTask 5.1: 重构 `HomeView.vue` — 内容区改为暗色背景 + 霓虹卡片，优化 Hero 动画性能
  - [x] SubTask 5.2: 重构 `ArticleDetail.vue` — 暗色阅读背景 + 霓虹标题 + 终端风格代码
  - [x] SubTask 5.3: 重构 `SearchResult.vue` — 暗色列表 + 霓虹高亮匹配
  - [x] SubTask 5.4: 重构 `ArchivesView.vue` — 暗色时间轴 + 霓虹节点 + 数据流装饰

- [x] Task 6: 重构页面视图 — 功能页
  - [x] SubTask 6.1: 重构 `AboutView.vue` — 暗色背景 + 霓虹技能条 + 全息个人信息卡
  - [x] SubTask 6.2: 重构 `LoginView.vue` — 暗色表单 + 霓虹输入框 + 赛博朋克装饰
  - [x] SubTask 6.3: 重构 `RegisterView.vue` — 暗色表单 + 霓虹输入框 + 赛博朋克装饰
  - [x] SubTask 6.4: 重构 `ProfileView.vue` — 暗色卡片 + 全息头像框
  - [x] SubTask 6.5: 重构 `ChatRoomView.vue` — 暗色终端风格 + 霓虹消息气泡
  - [x] SubTask 6.6: 重构 `ArticleEditor.vue` — 暗色编辑器 + 终端风格工具栏
  - [x] SubTask 6.7: 重构 `MyArticles.vue` — 暗色卡片列表 + 霓虹状态指示
  - [x] SubTask 6.8: 重构 `FilePreview.vue` — 暗色查看器 + 霓虹工具栏

- [x] Task 7: 更新配置文件与 App.vue
  - [x] SubTask 7.1: 更新 `uno.config.ts` 主题色为赛博朋克暗色系
  - [x] SubTask 7.2: 更新 `App.vue` 全局样式为暗色主题
  - [x] SubTask 7.3: 更新 `index.html` 主题色 meta 标签

- [x] Task 8: 性能优化验证
  - [x] SubTask 8.1: 审查并优化所有动画，确保首屏并发动画不超过3个
  - [x] SubTask 8.2: 使用 IntersectionObserver 延迟视口外动画启动
  - [x] SubTask 8.3: 清理不必要的 will-change 声明
  - [x] SubTask 8.4: 验证 `prefers-reduced-motion` 媒体查询正确禁用装饰性动画
  - [x] SubTask 8.5: 运行 `yarn build` 确保构建成功无错误

# Task Dependencies
- [Task 2] depends on [Task 1] (全局样式依赖变量体系)
- [Task 3] depends on [Task 1] (布局组件依赖变量体系)
- [Task 4] depends on [Task 1] (通用组件依赖变量体系)
- [Task 5] depends on [Task 1, Task 2, Task 3, Task 4] (页面视图依赖变量、全局样式、布局和通用组件)
- [Task 6] depends on [Task 1, Task 2, Task 3, Task 4] (同上)
- [Task 7] depends on [Task 1] (配置文件依赖变量体系)
- [Task 8] depends on [Task 1-7] (性能验证依赖所有重构完成)
- [Task 3, Task 4, Task 7] 可并行执行
- [Task 5, Task 6] 可并行执行
