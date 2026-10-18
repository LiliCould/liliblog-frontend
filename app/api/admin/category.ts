import request from '~/utils/request'
import type { ApiResponse, PageResult } from '~/types'
import type {
  AdminCategory,
  AdminCategoryCreateDTO,
  AdminCategoryQuery,
  AdminCategoryUpdateDTO,
} from '~/types/admin'

export function getAdminCategories(params: AdminCategoryQuery): Promise<ApiResponse<PageResult<AdminCategory>>> {
  return request.get('/api/admin/category', { params }) as unknown as Promise<ApiResponse<PageResult<AdminCategory>>>
}

export function getAdminCategoryById(id: number): Promise<ApiResponse<AdminCategory>> {
  return request.get(`/api/admin/category/${id}`) as unknown as Promise<ApiResponse<AdminCategory>>
}

export function createAdminCategory(data: AdminCategoryCreateDTO): Promise<ApiResponse<null>> {
  return request.post('/api/admin/category', data) as unknown as Promise<ApiResponse<null>>
}

export function updateAdminCategory(id: number, data: AdminCategoryUpdateDTO): Promise<ApiResponse<null>> {
  return request.put(`/api/admin/category/${id}`, data) as unknown as Promise<ApiResponse<null>>
}

export function deleteAdminCategory(id: number): Promise<ApiResponse<null>> {
  return request.delete(`/api/admin/category/${id}`) as unknown as Promise<ApiResponse<null>>
}

export function batchDeleteAdminCategories(ids: number[]): Promise<ApiResponse<null>> {
  return request.delete('/api/admin/category', { data: ids }) as unknown as Promise<ApiResponse<null>>
}
