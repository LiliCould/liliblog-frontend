import request from '~/utils/request'
import type { ApiResponse } from '~/types'
import type { AdminBlogConfigSection } from '~/types/admin'

export function getAdminBlogConfigs(): Promise<ApiResponse<AdminBlogConfigSection[]>> {
  return request.get('/api/admin/blog-config') as unknown as Promise<ApiResponse<AdminBlogConfigSection[]>>
}

export function getAdminBlogConfig(key: string): Promise<ApiResponse<AdminBlogConfigSection>> {
  return request.get(`/api/admin/blog-config/${encodeURIComponent(key)}`) as unknown as Promise<ApiResponse<AdminBlogConfigSection>>
}

export function upsertAdminBlogConfig(
  key: string,
  value: unknown,
  params?: { enabled?: number; remark?: string },
): Promise<ApiResponse<null>> {
  const query: Record<string, string | number> = {}
  if (params?.enabled !== undefined) query.enabled = params.enabled
  if (params?.remark !== undefined) query.remark = params.remark
  return request.put(
    `/api/admin/blog-config/${encodeURIComponent(key)}`,
    value,
    { params: query },
  ) as unknown as Promise<ApiResponse<null>>
}

export function deleteAdminBlogConfig(key: string): Promise<ApiResponse<null>> {
  return request.delete(`/api/admin/blog-config/${encodeURIComponent(key)}`) as unknown as Promise<ApiResponse<null>>
}
