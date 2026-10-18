import request from '~/utils/request'
import type { ApiResponse, Category, PageResult } from '~/types'

export function getCategories(params?: Record<string, unknown>): Promise<ApiResponse<PageResult<Category>>> {
  return request.get('/api/category', { params }) as unknown as Promise<ApiResponse<PageResult<Category>>>
}
