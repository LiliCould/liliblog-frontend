export interface LoginByPwdDTO {
    loginType: string
    username: string
    password: string
}

export interface LoginByEmailDTO {
    loginType: string
    email: string
    code: string
}

export interface RegisterDTO {
    username: string
    email: string
    password: string
    confirmPassword: string
    nickname: string
}

export interface PasswordChangeDTO {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

export interface LoginVO {
    accessToken: string
    expiresIn: number
    userInfo: UserInfo
}

export interface UserInfo {
    id: number
    username: string
    nickname: string
    avatar: string
    role: number
    status: number
    lastLoginTime: string
}
