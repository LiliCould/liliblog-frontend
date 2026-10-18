import request from '~/utils/request'
import type { ApiResponse, PageResult } from '~/types'
import type { AdminTag, AdminTagCreateDTO, AdminTagQuery, AdminTagUpdateDTO } from '~/types/admin'

export function getAdminTags(params: AdminTagQuery): Promise<ApiResponse<PageResult<AdminTag>>> {
  return request.get('/api/admin/tag', { params }) as unknown as Promise<ApiResponse<PageResult<AdminTag>>>
}

export function getAdminTagById(id: number): Promise<ApiResponse<AdminTag>> {
  return request.get(`/api/admin/tag/${id}`) as unknown as Promise<ApiResponse<AdminTag>>
}

export function createAdminTag(data: AdminTagCreateDTO): Promise<ApiResponse<null>> {
  return request.post('/api/admin/tag', data) as unknown as Promise<ApiResponse<null>>
}

export function updateAdminTag(id: number, data: AdminTagUpdateDTO): Promise<ApiResponse<null>> {
  return request.put(`/api/admin/tag/${id}`, data) as unknown as Promise<ApiResponse<null>>
}

export function deleteAdminTag(id: number): Promise<ApiResponse<null>> {
  return request.delete(`/api/admin/tag/${id}`) as unknown as Promise<ApiResponse<null>>
}

export function batchDeleteAdminTags(ids: number[]): Promise<ApiResponse<null>> {
  return request.delete('/api/admin/tag', { data: ids }) as unknown as Promise<ApiResponse<null>>
}
