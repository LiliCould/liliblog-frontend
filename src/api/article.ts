import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { Article, ArticleCreateDTO, ArticleUpdateDTO } from '@/types/article'

export function getArticles(params?: Record<string, any>) {
    return request.get<ApiResponse<Article[]>>('/api/article', { params })
}

export function getArticleById(id: number) {
    return request.get<ApiResponse<Article>>(`/api/article/${id}`)
}

export function getArticleBySlug(slug: string) {
    return request.get<ApiResponse<Article>>(`/api/article/slug/${slug}`)
}

export function createArticle(data: ArticleCreateDTO) {
    return request.post<ApiResponse<number>>('/api/article', data)
}

export function updateArticle(id: number, data: ArticleUpdateDTO) {
    return request.put<ApiResponse<null>>(`/api/article/${id}`, data)
}

export function deleteArticle(id: number) {
    return request.delete<ApiResponse<null>>(`/api/article/${id}`)
}

export function getArticleLikeStatus(id: number) {
    return request.get<ApiResponse<boolean>>(`/api/article/${id}/like`)
}

export function likeArticle(id: number) {
    return request.put<ApiResponse<null>>(`/api/article/${id}/like`)
}

export function unlikeArticle(id: number) {
    return request.put<ApiResponse<null>>(`/api/article/${id}/unlike`)
}
