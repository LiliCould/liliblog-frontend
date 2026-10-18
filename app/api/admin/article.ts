import request from '~/utils/request'
import type { ApiResponse, PageResult } from '~/types'
import type { AdminArticle, AdminArticleDetail, AdminArticleQuery } from '~/types/admin'

export function getAdminArticles(params: AdminArticleQuery): Promise<ApiResponse<PageResult<AdminArticle>>> {
  return request.get('/api/admin/article', { params }) as unknown as Promise<ApiResponse<PageResult<AdminArticle>>>
}

export function getAdminArticleById(id: number): Promise<ApiResponse<AdminArticleDetail>> {
  return request.get(`/api/admin/article/${id}`) as unknown as Promise<ApiResponse<AdminArticleDetail>>
}

export function deleteAdminArticle(id: number): Promise<ApiResponse<string>> {
  return request.delete(`/api/admin/article/${id}`) as unknown as Promise<ApiResponse<string>>
}

export function batchDeleteAdminArticles(ids: number[]): Promise<ApiResponse<string>> {
  return request.delete('/api/admin/article', { data: ids }) as unknown as Promise<ApiResponse<string>>
}

export function reviewAdminArticle(id: number, status: number, reason?: string): Promise<ApiResponse<string>> {
  const data: Record<string, unknown> = {}
  if (reason) data.reason = reason
  return request.put(`/api/admin/article/${id}/${status}`, data) as unknown as Promise<ApiResponse<string>>
}
