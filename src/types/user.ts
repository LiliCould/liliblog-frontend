/**
 * 用户信息
 */
export interface UserInfo {
  /** 用户 ID */
  id: number
  /** 用户名 */
  username: string
  /** 昵称 */
  nickname: string
  /** 头像 URL */
  avatar: string
  /** 邮箱 */
  email?: string
  /** 角色，0-管理员 1-普通用户 */
  role: number
  /** 状态，0-禁用 1-启用 */
  status: number
  /** 上次登录时间 */
  lastLoginTime: string
}

/**
 * 登录成功结果
 */
export interface LoginResult {
  /** 访问令牌 */
  accessToken: string
  /** 过期时间 */
  expiresIn: number
  /** 用户信息 */
  userInfo: UserInfo
}

/**
 * 登录凭证
 */
export interface LoginCredentials {
  /** 登录类型：pwd/sms/wechat */
  loginType?: string
  /** 用户名 */
  username?: string
  /** 密码 */
  password?: string
  /** 邮箱 */
  email?: string
  /** 验证码 */
  code?: string
}

/**
 * 更新用户数据
 */
export interface UpdateUserData {
  /** 旧密码 */
  oldPassword?: string
  /** 新密码 */
  newPassword?: string
  /** 确认密码 */
  confirmPassword?: string
  /** 昵称 */
  nickname?: string
  /** 头像 URL */
  avatar?: string
  /** 邮箱 */
  email?: string
}

/**
 * 注册数据
 */
export interface RegisterData {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 确认密码 */
  confirmPassword?: string
  /** 邮箱 */
  email: string
  /** 昵称 */
  nickname: string
}
