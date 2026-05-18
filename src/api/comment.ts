import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { Comment, CommentCreateDTO } from '@/types/comment'

export function getComments(params: { id: number; current?: number; size?: number }) {
    return request.get<ApiResponse<Comment[]>>('/api/comment', { params })
}

export function getChildComments(params: { id: number; current?: number; size?: number }) {
    return request.get<ApiResponse<Comment[]>>('/api/comment/child', { params })
}

export function createComment(data: CommentCreateDTO) {
    return request.post<ApiResponse<null>>('/api/comment', data)
}

export function deleteComment(id: number) {
    return request.delete<ApiResponse<null>>(`/api/comment/${id}`)
}
