import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import type { AdminArticle, AdminArticleDetail, AdminArticleQuery } from '@/types/admin'

export function getAdminArticles(params: AdminArticleQuery) {
    return request.get<ApiResponse<PageResult<AdminArticle>>>('/api/admin/article', { params })
}

export function getAdminArticleById(id: number) {
    return request.get<ApiResponse<AdminArticleDetail>>(`/api/admin/article/${id}`)
}

export function deleteAdminArticle(id: number) {
    return request.delete<ApiResponse<string>>(`/api/admin/article/${id}`)
}

export function batchDeleteAdminArticles(ids: number[]) {
    return request.delete<ApiResponse<string>>('/api/admin/article', { data: ids })
}

export function reviewAdminArticle(id: number, status: number, reason?: string) {
    const params: Record<string, string> = {}
    if (reason) params.reason = reason
    return request.get<ApiResponse<string>>(`/api/admin/article/${id}/${status}`, { params })
}
