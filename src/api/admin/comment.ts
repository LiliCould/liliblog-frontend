import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import type { AdminComment, AdminCommentQuery } from '@/types/admin'

export function getAdminComments(params: AdminCommentQuery) {
    return request.get<ApiResponse<PageResult<AdminComment>>>('/api/admin/comment', { params })
}

export function deleteAdminComment(id: number) {
    return request.delete<ApiResponse<null>>(`/api/admin/comment/${id}`)
}

export function batchDeleteAdminComments(ids: number[]) {
    return request.delete<ApiResponse<null>>('/api/admin/comment', { data: ids })
}

export function reviewAdminComment(id: number, status: number) {
    return request.put<ApiResponse<null>>(`/api/admin/comment/${id}/${status}`)
}
