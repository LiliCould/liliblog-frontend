import request from '@/utils/request'
import type { ApiResponse } from '@/types/api.d'
import type { Article, ArticleCreateDTO, ArticleUpdateDTO } from '@/types/article.d'
import type { PageParams } from '@/types/common.d'

export function getMyArticles(params?: PageParams) {
    return request.get<ApiResponse<Article[]>>('/api/article', { params })
}

export function getArticleById(id: number) {
    return request.get<ApiResponse<Article>>(`/api/article/${id}`)
}

export function getArticleBySlug(slug: string) {
    return request.get<ApiResponse<Article>>(`/api/article/slug/${slug}`)
}

export function createArticle(username: string, data: ArticleCreateDTO) {
    return request.post<ApiResponse<number>>('/api/article', data, {
        params: { username },
    })
}

export function updateArticle(id: number, username: string, data: ArticleUpdateDTO) {
    return request.put<ApiResponse<null>>(`/api/article/${id}`, data, {
        params: { username },
    })
}

export function deleteArticle(id: number, username: string) {
    return request.delete<ApiResponse<null>>(`/api/article/${id}`, {
        params: { username },
    })
}
