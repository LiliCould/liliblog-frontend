import request from '@/utils/request'
import type { ApiResponse } from '@/types/api.d'
import type { Category } from '@/types/category.d'

export function getCategories() {
    return request.get<ApiResponse<Category[]>>('/api/categories')
}
