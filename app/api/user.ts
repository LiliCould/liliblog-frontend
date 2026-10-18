import request from '~/utils/request'
import type { ApiResponse, User } from '~/types'

export interface UserUpdateDTO {
  nickname?: string
  avatar?: string
  oldPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export function getCurrentUser(): Promise<ApiResponse<User>> {
  return request.get('/api/user/me') as unknown as Promise<ApiResponse<User>>
}

export function getUserById(id: number): Promise<ApiResponse<User>> {
  return request.get(`/api/user/${id}`) as unknown as Promise<ApiResponse<User>>
}

export function updateUser(data: UserUpdateDTO): Promise<ApiResponse<null>> {
  return request.put('/api/user', data) as unknown as Promise<ApiResponse<null>>
}
