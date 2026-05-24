import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import type { AdminCategory, AdminCategoryQuery, AdminCategoryCreateDTO, AdminCategoryUpdateDTO } from '@/types/admin'

export function getAdminCategories(params: AdminCategoryQuery) {
    return request.get<ApiResponse<PageResult<AdminCategory>>>('/api/admin/category', { params })
}

export function getAdminCategoryById(id: number) {
    return request.get<ApiResponse<AdminCategory>>(`/api/admin/category/${id}`)
}

export function createAdminCategory(data: AdminCategoryCreateDTO) {
    return request.post<ApiResponse<null>>('/api/admin/category', data)
}

export function updateAdminCategory(id: number, data: AdminCategoryUpdateDTO) {
    return request.put<ApiResponse<null>>(`/api/admin/category/${id}`, data)
}

export function deleteAdminCategory(id: number) {
    return request.delete<ApiResponse<null>>(`/api/admin/category/${id}`)
}

export function batchDeleteAdminCategories(ids: number[]) {
    return request.delete<ApiResponse<null>>('/api/admin/category', { data: ids })
}
