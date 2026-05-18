import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { Category } from '@/types/category'

export function getCategories(params?: Record<string, any>) {
    return request.get<ApiResponse<Category[]>>('/api/category', { params })
}

export function getCategoryById(id: number) {
    return request.get<ApiResponse<Category>>(`/api/category/${id}`)
}

export function createCategory(data: Partial<Category>) {
    return request.post<ApiResponse<number>>('/api/category', data)
}

export function updateCategory(id: number, data: Partial<Category>) {
    return request.put<ApiResponse<null>>(`/api/category/${id}`, data)
}

export function updateCategoryStatus(id: number) {
    return request.put<ApiResponse<null>>(`/api/category/${id}/status`)
}

export function deleteCategory(id: number) {
    return request.delete<ApiResponse<null>>(`/api/category/${id}`)
}
