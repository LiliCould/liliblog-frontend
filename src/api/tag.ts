import request from './index'
import type { ApiResponse, Tag, TagListParams, PageResult } from '@/types'

/**
 * 获取标签列表
 * @param params 查询参数，支持按名称筛选
 * @returns 分页结果，包含标签列表
 */
export const getTagList = (params?: TagListParams): Promise<ApiResponse<PageResult<Tag>>> => {
  return request.get('/api/tag', { params })
}

/**
 * 获取所有标签（不分页）
 * @returns 标签列表
 */
export const getAllTags = (): Promise<ApiResponse<Tag[]>> => {
  return request.get('/api/tag/all')
}

/**
 * 获取标签详情
 * @param id 标签 ID
 * @returns 标签信息
 */
export const getTagById = (id: number): Promise<ApiResponse<Tag>> => {
  return request.get(`/api/tag/${id}`)
}

/**
 * 根据别名获取标签
 * @param slug 标签别名
 * @returns 标签信息
 */
export const getTagBySlug = (slug: string): Promise<ApiResponse<Tag>> => {
  return request.get(`/api/tag/slug/${slug}`)
}

/**
 * 添加标签
 * @param data 标签数据，包含名称和颜色
 * @returns 添加结果
 * @description 需要管理员权限
 */
export const createTag = (data: Partial<Tag>): Promise<ApiResponse<void>> => {
  return request.post('/api/tag', data)
}

/**
 * 更新标签
 * @param id 标签 ID
 * @param data 标签更新数据
 * @returns 更新结果
 * @description 需要管理员权限
 */
export const updateTag = (id: number, data: Partial<Tag>): Promise<ApiResponse<void>> => {
  return request.put(`/api/tag/${id}`, data)
}

/**
 * 删除标签
 * @param id 标签 ID
 * @returns 删除结果
 * @description 需要管理员权限
 */
export const deleteTag = (id: number): Promise<ApiResponse<void>> => {
  return request.delete(`/api/tag/${id}`)
}
