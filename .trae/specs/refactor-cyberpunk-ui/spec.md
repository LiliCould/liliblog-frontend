# 赛博朋克全站 UI/UX 重构 Spec

## Why
当前站点存在**双重设计系统**的割裂问题：Hero 区域采用赛博朋克风格（青色+玫红霓虹），而内容区域使用暖橙棕色系，两者视觉语言严重不统一。同时，全站动画和视觉效果存在性能隐患——多重并发动画（glitch、打字机、霓虹呼吸、轮播）、大量 `backdrop-filter` 和 `will-change` 滥用，导致加载时间过长和动画卡顿。需要统一为完整的赛博朋克设计语言，同时进行性能优化。

## What Changes
- **BREAKING**: 全站色彩系统从暖橙棕色系迁移至赛博朋克暗色系（深色背景 + 霓虹青/品红/紫色）
- 重构 CSS 变量体系，统一为赛博朋克暗色主题
- 重构所有页面视图组件的样式（11个视图文件）
- 重构所有布局和通用组件的样式（10个组件文件）
- 重构 Element Plus 主题覆盖为暗色赛博朋克风格
- 重构全局样式文件（reset、markdown、transitions、performance）
- 优化动画性能：减少并发动画、使用 CSS containment、优化 will-change 使用
- 优化资源加载：延迟非关键动画、减少首屏渲染阻塞
- 更新 UnoCSS 配置以匹配新主题
- 更新 NProgress 进度条为赛博朋克风格

## Impact
- Affected specs: 全站视觉系统、性能优化、可访问性
- Affected code:
  - `src/assets/styles/` 下全部6个CSS文件
  - `src/views/` 下全部11个视图组件
  - `src/components/` 下全部10个组件
  - `src/App.vue`
  - `uno.config.ts`
  - `vite.config.ts`

## ADDED Requirements

### Requirement: 赛博朋克暗色主题色彩系统
系统 SHALL 提供统一的赛博朋克暗色主题色彩系统，替代当前暖橙棕色系。

核心色彩定义：
- **背景色系**: 深色渐变 `#0a0a0f` → `#12121a` → `#1a1a2e`
- **卡片/面板色**: `rgba(20, 20, 35, 0.85)` 带 `backdrop-filter: blur(12px)`
- **主色调（霓虹青）**: `#00f0ff` — 用于主要交互元素、链接、高亮
- **辅助色（霓虹品红）**: `#ff2d78` — 用于强调、警告、特殊状态
- **第三色（霓虹紫）**: `#b967ff` — 用于渐变过渡、装饰元素
- **文字色**: 主标题 `#e2e8f0`，正文 `#94a3b8`，弱化 `#64748b`
- **边框色**: `rgba(0, 240, 255, 0.15)` 默认，`rgba(0, 240, 255, 0.4)` 悬浮
- **阴影系统**: 霓虹辉光阴影 `0 0 Xpx rgba(0, 240, 255, Y)`

#### Scenario: 色彩系统一致性
- **WHEN** 用户浏览任何页面
- **THEN** 所有页面使用统一的赛博朋克暗色主题，不存在暖色系残留

#### Scenario: 暗色对比度可读性
- **WHEN** 用户在暗色背景上阅读内容
- **THEN** 正文文字与背景的对比度至少达到 WCAG AA 标准（4.5:1）

### Requirement: 赛博朋克视觉特效系统
系统 SHALL 提供一套统一的赛博朋克视觉特效，包括：

1. **霓虹辉光效果**: 关键元素（标题、按钮、边框）带有 `box-shadow` / `text-shadow` 霓虹辉光
2. **扫描线纹理**: 可选的 CRT 扫描线叠加效果（通过 CSS 伪元素实现，低性能开销）
3. **故障效果**: 保留并优化 Hero 区域的 Glitch 效果，减少 DOM 操作
4. **数据流动画**: 加载状态使用数据流/矩阵雨风格动画
5. **边框流光**: 卡片和面板边框带有流光扫描动画
6. **网格背景**: 页面背景使用微妙的网格线图案

#### Scenario: 视觉特效性能
- **WHEN** 页面同时运行多个视觉特效
- **THEN** FPS 不低于 55fps（在中等性能设备上），无可见卡顿

#### Scenario: 减少动画偏好
- **WHEN** 用户系统设置了 `prefers-reduced-motion: reduce`
- **THEN** 所有装饰性动画被禁用，仅保留必要的状态转换

### Requirement: 性能优化体系
系统 SHALL 实施以下性能优化措施：

1. **动画优化**:
   - 限制同时运行的 CSS 动画数量（首屏不超过3个并发动画）
   - 使用 `IntersectionObserver` 延迟启动视口外动画
   - 将 anime.js 时间线动画替换为纯 CSS 动画（Hero 入场动画除外）
   - 移除不必要的 `will-change` 声明，仅在交互时动态添加

2. **渲染优化**:
   - 使用 `content-visibility: auto` 优化长列表渲染
   - 减少 `backdrop-filter` 使用范围，仅在关键组件使用
   - 使用 CSS `contain` 属性隔离重绘范围

3. **资源优化**:
   - 首屏关键 CSS 内联
   - 非关键动画延迟到 `requestIdleCallback` 后启动
   - 图片使用 `loading="lazy"` + `decoding="async"`

4. **字体优化**:
   - 使用 `font-display: swap` 避免字体加载阻塞渲染
   - 赛博朋克主题字体使用系统等宽字体作为 fallback

#### Scenario: 首屏加载性能
- **WHEN** 用户首次访问首页
- **THEN** LCP（最大内容绘制）不超过 2.5 秒

#### Scenario: 动画帧率
- **WHEN** 用户滚动页面并触发滚动动画
- **THEN** 动画帧率不低于 55fps，无掉帧

### Requirement: Element Plus 暗色主题适配
系统 SHALL 将 Element Plus 组件库主题覆盖为赛博朋克暗色风格。

- 所有 Element Plus 组件使用暗色背景和霓虹色交互
- 输入框使用暗色背景 + 霓虹青聚焦边框
- 按钮使用霓虹色渐变或透明边框风格
- 对话框/弹出层使用暗色毛玻璃背景
- 表格使用暗色交替行
- 标签使用霓虹色半透明背景

#### Scenario: Element Plus 组件视觉一致性
- **WHEN** 用户与任何 Element Plus 组件交互
- **THEN** 组件视觉风格与赛博朋克主题完全一致

### Requirement: 页面级赛博朋克重构
每个页面 SHALL 按照赛博朋克设计语言重构：

1. **首页 (HomeView)**: Hero 保持赛博朋克风格，内容区改为暗色背景 + 霓虹卡片
2. **关于页 (AboutView)**: 暗色背景 + 霓虹技能条 + 全息个人信息卡
3. **归档页 (ArchivesView)**: 暗色时间轴 + 霓虹节点 + 数据流装饰
4. **文章详情 (ArticleDetail)**: 暗色阅读背景 + 霓虹标题 + 代码块终端风格
5. **搜索结果 (SearchResult)**: 暗色列表 + 霓虹高亮匹配
6. **登录/注册 (LoginView/RegisterView)**: 暗色表单 + 霓虹输入框 + 赛博朋克装饰
7. **个人资料 (ProfileView)**: 暗色卡片 + 全息头像框
8. **聊天室 (ChatRoomView)**: 暗色终端风格 + 霓虹消息气泡
9. **文章编辑 (ArticleEditor)**: 暗色编辑器 + 终端风格工具栏
10. **我的文章 (MyArticles)**: 暗色卡片列表 + 霓虹状态指示
11. **文件预览 (FilePreview)**: 暗色查看器 + 霓虹工具栏

#### Scenario: 页面视觉统一性
- **WHEN** 用户在任意两个页面间导航
- **THEN** 视觉风格保持一致，无暖色系残留

### Requirement: 组件级赛博朋克重构
每个通用组件 SHALL 按照赛博朋克设计语言重构：

1. **AppHeader**: 暗色半透明背景 + 霓虹 logo + 扫描线装饰
2. **AppFooter**: 暗色背景 + 霓虹分割线 + 数据流装饰
3. **AppSidebar**: 暗色毛玻璃面板 + 霓虹边框流光
4. **MobileNav**: 暗色底部导航 + 霓虹激活指示
5. **ArticleCard**: 暗色卡片 + 霓虹悬浮边框 + 流光效果
6. **CustomCursor**: 保持现有赛博朋克风格，优化性能
7. **EmptyState**: 暗色背景 + 霓虹图标
8. **SearchBar**: 暗色输入框 + 霓虹聚焦效果
9. **TagBadge**: 霓虹半透明背景标签
10. **ChatRoom**: 暗色终端风格聊天界面
11. **ArticleMeta**: 暗色元信息 + 霓虹图标
12. **ArticleToc**: 暗色目录 + 霓虹激活指示

#### Scenario: 组件交互反馈
- **WHEN** 用户悬浮或点击任何交互组件
- **THEN** 提供赛博朋克风格的视觉反馈（霓虹辉光、边框流光等）

## MODIFIED Requirements

### Requirement: 全局样式变量系统
当前变量系统包含暖色系和赛博朋克 Hero 色两套体系，SHALL 统一为单一赛博朋克暗色体系：

- 移除所有暖色系变量（`--color-primary: #C45D35` 等）
- 统一为赛博朋克暗色变量
- 保留并扩展 Hero 区域的赛博朋克变量为全站通用
- 新增暗色主题专用变量（暗色背景梯度、霓虹辉光强度等）

### Requirement: Markdown 内容渲染
Markdown 渲染样式 SHALL 适配暗色主题：

- 代码块使用终端风格（深色背景 + 霓虹语法高亮色）
- 链接使用霓虹青色
- 引用块使用霓虹青左边框 + 暗色半透明背景
- 表格使用暗色交替行
- 行内代码使用霓虹青色文字 + 暗色背景

### Requirement: 全局过渡动画
过渡动画 SHALL 适配赛博朋克风格并优化性能：

- NProgress 进度条使用霓虹青 → 霓虹紫渐变
- 页面切换动画使用暗色淡入淡出
- 列表动画使用霓虹辉光入场效果

## REMOVED Requirements

### Requirement: 暖橙棕色系
**Reason**: 与赛博朋克主题不兼容，造成视觉割裂
**Migration**: 所有暖色系变量和样式替换为赛博朋克暗色系对应值

### Requirement: 双重色彩系统
**Reason**: Hero 赛博朋克 + 内容暖色的双重系统导致视觉不统一
**Migration**: 统一为单一赛博朋克暗色系统
