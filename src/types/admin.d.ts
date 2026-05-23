import type { PageParams } from './common'

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

export interface AdminUserQuery extends PageParams {
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
    updateTimeStart?: string
    updateTimeEnd?: string
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
    email: string
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
    category: AdminArticleCategory
    tags: AdminArticleTag[]
    updateTime: string
    updater: AdminArticleUser
    createTime: string
    creator: AdminArticleUser
}

export interface AdminArticleDetail extends AdminArticle {
    content: string
    contentHtml: string
}

export interface AdminArticleQuery extends PageParams {
    title?: string
    createBy?: number
    categoryId?: number
    status?: number
    startTime?: string
    endTime?: string
}
