import request from './index'
import type {
  ApiResponse,
  Comment,
  CommentListParams,
  CreateCommentData,
  PageResult,
} from '@/types'

/**
 * 获取一级评论列表
 * @param params 查询参数，id 为文章 ID
 * @returns 分页结果，包含一级评论列表
 */
export const getComments = (params: CommentListParams): Promise<ApiResponse<PageResult<Comment>>> => {
  return request.get('/api/comment', { params })
}

/**
 * 获取二级评论列表
 * @param params 查询参数，id 为根评论 ID
 * @returns 分页结果，包含二级评论列表
 */
export const getChildComments = (params: CommentListParams): Promise<ApiResponse<PageResult<Comment>>> => {
  return request.get('/api/comment/child', { params })
}

/**
 * 发布评论
 * @param data 评论数据，包含文章 ID、内容、父评论 ID 等
 * @returns 发布结果
 * @description 需要登录，一级评论 parentId 为 0 或空
 */
export const createComment = (data: CreateCommentData): Promise<ApiResponse<void>> => {
  return request.post('/api/comment', data)
}

/**
 * 删除评论
 * @param id 评论 ID
 * @returns 删除结果
 * @description 会删除该评论及其子评论（如果有）
 */
export const deleteComment = (id: number): Promise<ApiResponse<void>> => {
  return request.delete(`/api/comment/${id}`)
}
