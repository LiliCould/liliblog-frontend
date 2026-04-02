export interface LoginDTO {
    username: string
    password: string
}

export interface RegisterDTO {
    username: string
    email: string
    password: string
    nickname: string
}

export interface PasswordChangeDTO {
    oldPassword: string
    newPassword: string
}

export interface LoginVO {
    token: string
    username: string
    nickname: string
    role: string
    avatar: string
}

export interface UserVO {
    username: string
    email: string
    nickname: string
    avatar: string
    lastLoginTime: string
    createTime: string
}
