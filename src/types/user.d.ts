export interface User {
    id: number
    username: string
    nickname: string
    avatar: string
    email?: string
    role: number
    status: number
    lastLoginTime: string
}

export interface UserUpdateDTO {
    nickname?: string
    avatar?: string
    oldPassword?: string
    newPassword?: string
    confirmPassword?: string
}
