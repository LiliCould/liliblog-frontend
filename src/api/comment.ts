import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import type { Comment, CommentCreateDTO } from '@/types/comment'

export function getComments(params: { id: number; current?: number; size?: number }) {
    return request.get<ApiResponse<PageResult<Comment>>>('/api/comment', { params })
}

export function getChildComments(params: { id: number; current?: number; size?: number }) {
    return request.get<ApiResponse<PageResult<Comment>>>('/api/comment/child', { params })
}

export function createComment(data: CommentCreateDTO) {
    return request.post<ApiResponse<null>>('/api/comment', data)
}

export function deleteComment(id: number) {
    return request.delete<ApiResponse<null>>(`/api/comment/${id}`)
}

export function likeComment(id: number) {
    return request.put<ApiResponse<null>>(`/api/comment/${id}/like`)
}

export function unlikeComment(id: number) {
    return request.put<ApiResponse<null>>(`/api/comment/${id}/unlike`)
}

export function getCommentLikeStatus(id: number) {
    return request.get<ApiResponse<boolean>>(`/api/comment/${id}/like`)
}
