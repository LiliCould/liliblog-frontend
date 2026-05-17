import request from './index'
import type { ApiResponse, UserInfo, UpdateUserData } from '@/types'

/**
 * 获取当前登录用户信息
 * @returns 当前用户信息
 * @description 需要登录状态
 */
export const getCurrentUser = (): Promise<ApiResponse<UserInfo>> => {
  return request.get('/api/user/me')
}

/**
 * 获取指定用户信息
 * @param id 用户 ID
 * @returns 用户信息
 * @description 无需登录即可访问
 */
export const getUserById = (id: number): Promise<ApiResponse<UserInfo>> => {
  return request.get(`/api/user/${id}`)
}

/**
 * 更新用户信息
 * @param data 更新数据，包含密码或昵称、头像等
 * @returns 更新结果
 * @description 需要登录，修改密码成功后需主动调用登出接口
 */
export const updateUser = (data: UpdateUserData): Promise<ApiResponse<void>> => {
  return request.put('/api/user', data)
}
