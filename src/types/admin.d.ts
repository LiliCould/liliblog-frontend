import type { PageParams } from './common'

export interface AdminUser {
    id: number
    username: string
    nickname: string
    avatar: string
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
