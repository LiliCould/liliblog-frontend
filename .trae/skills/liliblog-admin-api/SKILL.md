---
name: "liliblog-admin-api"
description: "LiliBlog 管理端接口对接规范。当用户要求新增或修改管理端功能（如文章/分类/标签/评论/用户管理）时调用，确保管理端 API 与前台 API 严格隔离。"
---

# LiliBlog 管理端接口对接规范

## 核心原则：管理端与前台 API 严格隔离

管理端接口路径统一为 `/api/admin/*`，前台接口路径为 `/api/*`。**管理端页面严禁调用前台接口**，防止权限混淆。

## 文件结构规范

```
src/
├── api/
│   ├── article.ts          # 前台：/api/article/*
│   ├── category.ts         # 前台：/api/category/*
│   ├── tag.ts              # 前台：/api/tag/*
│   ├── comment.ts          # 前台：/api/comment/*
│   ├── user.ts             # 前台：/api/user/*（获取当前用户、更新个人资料）
│   └── admin/              # 管理端 API 目录
│       └── user.ts         # 管理端：/api/admin/user/*
├── types/
│   ├── article.d.ts        # 前台文章类型
│   ├── user.d.ts           # 前台用户类型（User, UserUpdateDTO）
│   └── admin.d.ts          # 管理端类型（AdminUser, AdminUserQuery, Admin*DTO）
└── views/
    └── admin/              # 管理端页面
        ├── Dashboard.vue
        ├── Articles.vue
        ├── Categories.vue
        ├── Tags.vue
        ├── Comments.vue
        └── Users.vue
```

## 新增管理端模块的完整步骤

当后端新增管理端接口时，按以下顺序执行：

### 步骤 1：在 `types/admin.d.ts` 中添加类型定义

```typescript
// 管理端实体类型（与前台类型隔离）
export interface AdminXxx {
    id: number
    // ...字段与后端接口响应一致
}

// 分页查询参数（继承 PageParams）
export interface AdminXxxQuery extends PageParams {
    // ...筛选条件
}

// 创建请求体
export interface AdminXxxCreateDTO {
    // ...必填字段
}

// 更新请求体
export interface AdminXxxUpdateDTO {
    // ...可选字段（未修改的传 null）
}
```

**关键规则**：
- 管理端类型以 `Admin` 前缀命名，与前台类型区分
- 查询参数继承 `PageParams`（来自 `types/common.d.ts`）
- 更新 DTO 的字段全部可选，遵循后端"未修改传 null"的约定

### 步骤 2：在 `api/admin/` 下创建 API 封装文件

```typescript
// api/admin/xxx.ts
import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import type { AdminXxx, AdminXxxQuery, AdminXxxCreateDTO, AdminXxxUpdateDTO } from '@/types/admin'

export function getAdminXxxs(params: AdminXxxQuery) {
    return request.get<ApiResponse<PageResult<AdminXxx>>>('/api/admin/xxx', { params })
}

export function getAdminXxxById(id: number) {
    return request.get<ApiResponse<AdminXxx>>(`/api/admin/xxx/id`, { params: { id } })
}

export function createAdminXxx(data: AdminXxxCreateDTO) {
    return request.post<ApiResponse<null>>('/api/admin/xxx', data)
}

export function updateAdminXxx(id: number, data: AdminXxxUpdateDTO) {
    return request.put<ApiResponse<null>>('/api/admin/xxx/id', data, { params: { id } })
}

export function deleteAdminXxx(id: number) {
    return request.delete<ApiResponse<null>>('/api/admin/xxx/id', { params: { id } })
}
```

**关键规则**：
- 所有路径以 `/api/admin/` 开头
- 函数名以 `Admin` 前缀或使用 `getAdmin*`/`createAdmin*` 命名
- 删除和详情查询的 id 作为查询参数传递（`{ params: { id } }`），不是路径参数
- 响应类型统一使用 `ApiResponse<T>` 和 `PageResult<T>`

### 步骤 3：创建管理端页面 `views/admin/Xxxs.vue`

页面必须遵循以下结构：

```vue
<template>
  <div class="space-y-6">
    <!-- 标题栏 + 操作按钮 -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-t-title">XXX管理</h2>
      <button class="..." @click="openCreateDialog">添加</button>
    </div>

    <!-- 数据表格 -->
    <div class="rounded-xl bg-t-surface border border-t-border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-t-border">
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">列名</th>
            </tr>
          </thead>
          <tbody><!-- 数据行 --></tbody>
        </table>
      </div>
      <!-- 空状态 -->
      <!-- 分页 -->
    </div>

    <!-- 添加/编辑弹窗（使用 Teleport to="body"） -->
    <Teleport to="body">
      <!-- 弹窗内容 -->
    </Teleport>

    <!-- 删除确认弹窗 -->
    <Teleport to="body">
      <!-- 确认弹窗 -->
    </Teleport>
  </div>
</template>
```

**样式规范**：
- 使用主题变量（`text-t-title`、`bg-t-surface`、`border-t-border`、`text-t-muted`、`text-t-body`、`text-t-primary` 等）
- **严禁硬编码颜色**（如 `text-white`、`text-[#00f0ff]`、`bg-[#111118]`），确保明亮/暗色主题都可用
- 表格行 hover：`hover:bg-[rgba(var(--color-primary-rgb),0.03)]`
- 表格行分隔：`border-b border-[rgba(var(--color-primary-rgb),0.08)]`
- 弹窗遮罩：`bg-black/60 backdrop-blur-sm`
- 弹窗容器：`bg-t-surface border border-t-border`
- 主按钮：`bg-t-primary text-white hover:opacity-90`
- 次按钮：`text-t-muted border border-t-border hover:text-t-body`
- 危险按钮：`bg-[#f43f5e] text-white hover:opacity-90`
- 圆角：`rounded-xl`（卡片）、`rounded-lg`（按钮/输入框）
- z-index 层级：弹窗 `z-[1200]`，删除确认 `z-[1300]`

**逻辑规范**：
- 页面不包裹 `<AdminLayout>`（由 App.vue 统一包裹）
- 不 import `AdminLayout`
- 使用 `useToast()` 做操作反馈
- 错误处理由 request 拦截器统一处理，catch 块留空即可
- 分页使用 `PageResult` 泛型

### 步骤 4：注册路由

在 `router/routes.ts` 中添加：

```typescript
{
    path: '/admin/xxxs',
    name: 'AdminXxxs',
    component: () => import('@/views/admin/Xxxs.vue'),
    meta: { title: 'XXX管理', requiresAuth: true, requiresAdmin: true, layout: 'admin' },
}
```

### 步骤 5：更新侧边栏导航

在 `components/layout/AdminLayout.vue` 中：

1. 导入对应图标（从 `lucide-vue-next`）
2. 在 `navItems` 数组中添加导航项

## 已知的管理端接口路径模式

| 模块 | 列表 | 详情 | 创建 | 更新 | 删除 |
|------|------|------|------|------|------|
| 用户 | `GET /api/admin/user` | `GET /api/admin/user/id` | `POST /api/admin/user` | `PUT /api/admin/user/id` | `DELETE /api/admin/user/id` |

**注意**：后端管理端接口的 id 参数是通过**查询参数**传递的（如 `?id=1`），不是路径参数（如 `/1`）。

## 常见陷阱

1. **管理端页面不要重复包裹 AdminLayout**：App.vue 已根据 `meta.layout === 'admin'` 自动包裹
2. **不要在管理端调用前台 API**：如 `/api/user`、`/api/article` 等，管理端必须用 `/api/admin/*`
3. **不要硬编码赛博暗夜颜色**：如 `text-white`、`text-[#00f0ff]`、`bg-[#111118]`，这些在明亮主题下不可见
4. **Toast 样式使用主题变量**：不要硬编码渐变和毛玻璃效果
5. **Lucide 品牌图标已弃用**：如 `Github`，需用 Simple Icons SVG 内联替代
6. **路由不要重复定义**：如 `/manage/editor` 和 `/write` 不要同时存在

## 后端接口文档位置

- 主 API 文档：`e:/文档文件/1笔记/开发文档/立里博客 LiliBlog API 文档 .md`
- 管理端新增接口：`c:/Users/Lili/Downloads/立里博客 LiliBlog API 文档 (2).md`
- 设计文档：`c:/Users/Lili/Downloads/立里博客前端重构_完整设计文档_v3_API对齐版.md`
