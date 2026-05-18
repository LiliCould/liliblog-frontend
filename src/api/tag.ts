import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { Tag } from '@/types/tag'

export function getTags(params?: Record<string, any>) {
    return request.get<ApiResponse<Tag[]>>('/api/tag', { params })
}

export function getTagById(id: number) {
    return request.get<ApiResponse<Tag>>(`/api/tag/${id}`)
}

export function createTag(data: Partial<Tag>) {
    return request.post<ApiResponse<number>>('/api/tag', data)
}

export function updateTag(id: number, data: Partial<Tag>) {
    return request.put<ApiResponse<null>>(`/api/tag/${id}`, data)
}

export function deleteTag(id: number) {
    return request.delete<ApiResponse<null>>(`/api/tag/${id}`)
}
