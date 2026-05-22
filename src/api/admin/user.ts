import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import type { AdminUser, AdminUserQuery, AdminUserCreateDTO, AdminUserUpdateDTO } from '@/types/admin'

export function getAdminUsers(params: AdminUserQuery) {
    return request.get<ApiResponse<PageResult<AdminUser>>>('/api/admin/user', { params })
}

export function getAdminUserById(id: number) {
    return request.get<ApiResponse<AdminUser>>('/api/admin/user/id', { params: { id } })
}

export function createAdminUser(data: AdminUserCreateDTO) {
    return request.post<ApiResponse<null>>('/api/admin/user', data)
}

export function updateAdminUser(id: number, data: AdminUserUpdateDTO) {
    return request.put<ApiResponse<null>>('/api/admin/user/id', data, { params: { id } })
}

export function deleteAdminUser(id: number) {
    return request.delete<ApiResponse<null>>('/api/admin/user/id', { params: { id } })
}
