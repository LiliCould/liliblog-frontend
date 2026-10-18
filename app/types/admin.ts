import type { PageResult } from './index'

export interface AdminArticleCategory {
  id: number
  name: string
  slug: string
  description: string
  sortOrder: number
}

export interface AdminArticleTag {
  id: number
  name: string
  color: string
}

export interface AdminArticleUser {
  id: number
  username: string
  nickname: string
  email?: string
  avatar: string
  role: number
  status: number
  lastLoginTime: string
}

export interface AdminArticle {
  id: number
  title: string
  slug: string
  summary: string
  coverImage: string
  viewCount: number
  likeCount: number
  commentCount: number
  status: number
  category: AdminArticleCategory | null
  tags: AdminArticleTag[]
  updateTime: string
  updater: AdminArticleUser | null
  createTime: string
  creator: AdminArticleUser | null
}

export interface AdminArticleDetail extends AdminArticle {
  content: string
  contentHtml: string
}

export interface AdminArticleQuery {
  current?: number
  size?: number
  title?: string
  createBy?: number
  categoryId?: number
  status?: number
  startTime?: string
  endTime?: string
}

export interface AdminCategory {
  id: number
  name: string
  slug: string
  description: string
  sortOrder: number
  articleCount: number
  createTime: string
  updateTime: string
}

export interface AdminCategoryQuery {
  current?: number
  size?: number
  name?: string
  slug?: string
}

export interface AdminCategoryCreateDTO {
  name: string
  slug: string
  description?: string
  sortOrder?: number
}

export type AdminCategoryUpdateDTO = Partial<AdminCategoryCreateDTO>

export interface AdminTag {
  id: number
  name: string
  color: string
  articleCount: number
  createTime: string
  updateTime: string
}

export interface AdminTagQuery {
  current?: number
  size?: number
  name?: string
}

export interface AdminTagCreateDTO {
  name: string
  color: string
}

export type AdminTagUpdateDTO = Partial<AdminTagCreateDTO>

export interface AdminCommentCreator {
  id: number
  username: string
  nickname: string
  email?: string
  avatar: string
  role: number
  status: number
  lastLoginTime: string
}

export interface AdminComment {
  id: number
  content: string
  likeCount: number
  childCount: number
  articleId: number
  parentId: number
  ipAddress?: string
  ipAddressLocation?: string
  status: number
  createTime: string
  creator: AdminCommentCreator | null
  level: number
}

export interface AdminCommentQuery {
  current?: number
  size?: number
  content?: string
  articleId?: number
  status?: number
  startTime?: string
  endTime?: string
}

export interface AdminUser {
  id: number
  username: string
  nickname: string
  avatar: string
  email?: string
  role: number
  status: number
  lastLoginTime: string
}

export interface AdminUserQuery {
  current?: number
  size?: number
  id?: number
  role?: number
  status?: number
  username?: string
  nickname?: string
  email?: string
  createTimeStart?: string
  createTimeEnd?: string
  lastLoginTimeStart?: string
  lastLoginTimeEnd?: string
}

export interface AdminUserCreateDTO {
  username: string
  password: string
  confirmPassword: string
  email: string
  nickname: string
}

export interface AdminUserUpdateDTO {
  oldPassword?: string
  newPassword?: string
  confirmPassword?: string
  nickname?: string
  avatar?: string
  username?: string
  role?: number
  status?: number
  email?: string
}

export interface AdminAuditLog {
  id: number
  username: string
  module: string
  operation: string
  target: string
  targetType: string
  description: string
  requestMethod: string
  requestUri: string
  ipAddress: string
  userAgent: string
  executionTime: number
  status: number
  errorMessage: string
  createTime: string
}

export interface AdminAuditLogQuery {
  current?: number
  size?: number
  username?: string
  module?: string
  operation?: string
  status?: number
  startTime?: string
  endTime?: string
}

export type AdminPage<T> = PageResult<T>
