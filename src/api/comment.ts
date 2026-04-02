import request from '@/utils/request'
import type { ApiResponse } from '@/types/api.d'
import type { Comment } from '@/types/comment.d'

export function getComments() {
    return request.get<ApiResponse<Comment[]>>('/api/comment')
}
