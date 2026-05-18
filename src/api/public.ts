import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { Article } from '@/types/article'

export function getPublicArticles(params?: Record<string, any>) {
    return request.get<ApiResponse<Article[]>>('/api/article', { params })
}

export function getPublicArticleById(id: number) {
    return request.get<ApiResponse<Article>>(`/api/article/${id}`)
}
