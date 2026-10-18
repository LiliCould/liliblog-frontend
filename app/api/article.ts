import request from '~/utils/request'
import type { ApiResponse, Article, ArticleDetail } from '~/types'

export interface ArticleCreateDTO {
  title: string
  slug?: string
  summary?: string
  content: string
  coverImage?: string
  status: number
  categoryId: number
  tags: number[]
}

export type ArticleUpdateDTO = ArticleCreateDTO

export function createArticle(data: ArticleCreateDTO): Promise<ApiResponse<number>> {
  return request.post('/api/article', data) as unknown as Promise<ApiResponse<number>>
}

export function updateArticle(id: number, data: ArticleUpdateDTO): Promise<ApiResponse<null>> {
  return request.put(`/api/article/${id}`, data) as unknown as Promise<ApiResponse<null>>
}

export function getArticleById(id: number): Promise<ApiResponse<ArticleDetail>> {
  return request.get(`/api/article/${id}`) as unknown as Promise<ApiResponse<ArticleDetail>>
}

export function deleteArticle(id: number): Promise<ApiResponse<null>> {
  return request.delete(`/api/article/${id}`) as unknown as Promise<ApiResponse<null>>
}

export function getArticles(params?: Record<string, unknown>): Promise<ApiResponse<{ records: Article[]; total: number }>> {
  return request.get('/api/article', { params }) as unknown as Promise<ApiResponse<{ records: Article[]; total: number }>>
}
