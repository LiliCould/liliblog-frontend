import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import type { AdminTag, AdminTagQuery, AdminTagCreateDTO, AdminTagUpdateDTO } from '@/types/admin'

export function getAdminTags(params: AdminTagQuery) {
    return request.get<ApiResponse<PageResult<AdminTag>>>('/api/admin/tag', { params })
}

export function getAdminTagById(id: number) {
    return request.get<ApiResponse<AdminTag>>(`/api/admin/tag/${id}`)
}

export function createAdminTag(data: AdminTagCreateDTO) {
    return request.post<ApiResponse<null>>('/api/admin/tag', data)
}

export function updateAdminTag(id: number, data: AdminTagUpdateDTO) {
    return request.put<ApiResponse<null>>(`/api/admin/tag/${id}`, data)
}

export function deleteAdminTag(id: number) {
    return request.delete<ApiResponse<null>>(`/api/admin/tag/${id}`)
}

export function batchDeleteAdminTags(ids: number[]) {
    return request.delete<ApiResponse<null>>('/api/admin/tag', { data: ids })
}
