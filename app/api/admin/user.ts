import request from '~/utils/request'
import type { ApiResponse, PageResult } from '~/types'
import type { AdminUser, AdminUserCreateDTO, AdminUserQuery, AdminUserUpdateDTO } from '~/types/admin'

export function getAdminUsers(params: AdminUserQuery): Promise<ApiResponse<PageResult<AdminUser>>> {
  return request.get('/api/admin/user', { params }) as unknown as Promise<ApiResponse<PageResult<AdminUser>>>
}

export function getAdminUserById(id: number): Promise<ApiResponse<AdminUser>> {
  return request.get('/api/admin/user/id', { params: { id } }) as unknown as Promise<ApiResponse<AdminUser>>
}

export function createAdminUser(data: AdminUserCreateDTO): Promise<ApiResponse<null>> {
  return request.post('/api/admin/user', data) as unknown as Promise<ApiResponse<null>>
}

export function updateAdminUser(id: number, data: AdminUserUpdateDTO): Promise<ApiResponse<null>> {
  return request.put('/api/admin/user/id', data, { params: { id } }) as unknown as Promise<ApiResponse<null>>
}

export function deleteAdminUser(id: number): Promise<ApiResponse<null>> {
  return request.delete('/api/admin/user/id', { params: { id } }) as unknown as Promise<ApiResponse<null>>
}
