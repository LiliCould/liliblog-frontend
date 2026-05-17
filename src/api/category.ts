import request from './index'
import type { ApiResponse, Category, CategoryListParams, PageResult } from '@/types'

/**
 * 获取分类列表
 * @param params 查询参数，支持按名称、别名、描述筛选
 * @returns 分页结果，包含分类列表
 */
export const getCategoryList = (params?: CategoryListParams): Promise<ApiResponse<PageResult<Category>>> => {
  return request.get('/api/category', { params })
}

/**
 * 获取分类详情
 * @param id 分类 ID
 * @returns 分类展示对象
 */
export const getCategoryById = (id: number): Promise<ApiResponse<Category>> => {
  return request.get(`/api/category/${id}`)
}

/**
 * 添加分类
 * @param data 分类数据
 * @returns 添加结果
 * @description 需要管理员权限
 */
export const createCategory = (data: Partial<Category>): Promise<ApiResponse<void>> => {
  return request.post('/api/category', data)
}

/**
 * 更新分类
 * @param id 分类 ID
 * @param data 分类更新数据
 * @returns 更新结果
 * @description 需要管理员权限
 */
export const updateCategory = (id: number, data: Partial<Category>): Promise<ApiResponse<void>> => {
  return request.put(`/api/category/${id}`, data)
}

/**
 * 删除分类
 * @param id 分类 ID
 * @returns 删除结果
 * @description 需要管理员权限
 */
export const deleteCategory = (id: number): Promise<ApiResponse<void>> => {
  return request.delete(`/api/category/${id}`)
}

/**
 * 切换分类状态
 * @param id 分类 ID
 * @returns 切换结果
 * @description 需要管理员权限
 */
export const toggleCategoryStatus = (id: number): Promise<ApiResponse<void>> => {
  return request.put(`/api/category/${id}/status`)
}
