import request from '~/utils/request'
import type { ApiResponse, PageResult, Tag } from '~/types'

export function getTags(params?: Record<string, unknown>): Promise<ApiResponse<PageResult<Tag>>> {
  return request.get('/api/tag', { params }) as unknown as Promise<ApiResponse<PageResult<Tag>>>
}
