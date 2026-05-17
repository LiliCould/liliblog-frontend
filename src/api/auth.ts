import request from './index'
import type { ApiResponse, LoginResult, LoginCredentials, RegisterData } from '@/types'

/**
 * 用户名密码登录
 * @param data 登录凭证，包含用户名和密码
 * @returns 登录成功结果，包含 accessToken 和用户信息
 */
export const loginByPassword = (data: LoginCredentials): Promise<ApiResponse<LoginResult>> => {
  return request.post('/auth/login/pwd', data)
}

/**
 * 邮箱验证码登录
 * @param data 登录凭证，包含邮箱和验证码
 * @returns 登录成功结果
 */
export const loginByEmail = (data: { email: string; code: string }): Promise<ApiResponse<LoginResult>> => {
  return request.post('/auth/login/email', data)
}

/**
 * 刷新 Token
 * @returns 新的登录结果，包含新的 accessToken
 * @description 使用 http-only Cookie 中的 refresh_token 自动刷新
 */
export const refreshToken = (): Promise<ApiResponse<LoginResult>> => {
  return request.post('/auth/refresh')
}

/**
 * 登出
 * @returns 登出结果
 * @description 清除服务端 refresh_token 和 redis 信息
 */
export const logout = (): Promise<ApiResponse<void>> => {
  return request.post('/auth/logout')
}

/**
 * 注册新用户
 * @param data 注册数据，包含用户名、密码、邮箱、昵称
 * @returns 注册结果
 * @description 需要管理员权限
 */
export const register = (data: RegisterData): Promise<ApiResponse<void>> => {
  return request.post('/auth/register', data)
}
