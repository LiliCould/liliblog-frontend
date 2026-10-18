import request from '~/utils/request'
import type { ApiResponse, PageResult } from '~/types'
import type { AdminComment, AdminCommentQuery } from '~/types/admin'

export function getAdminComments(params: AdminCommentQuery): Promise<ApiResponse<PageResult<AdminComment>>> {
  return request.get('/api/admin/comment', { params }) as unknown as Promise<ApiResponse<PageResult<AdminComment>>>
}

export function deleteAdminComment(id: number): Promise<ApiResponse<null>> {
  return request.delete(`/api/admin/comment/${id}`) as unknown as Promise<ApiResponse<null>>
}

export function batchDeleteAdminComments(ids: number[]): Promise<ApiResponse<null>> {
  return request.delete('/api/admin/comment', { data: ids }) as unknown as Promise<ApiResponse<null>>
}

export function reviewAdminComment(id: number, status: number): Promise<ApiResponse<null>> {
  return request.put(`/api/admin/comment/${id}/${status}`) as unknown as Promise<ApiResponse<null>>
}
