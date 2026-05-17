import request from './index'
import type {
  ApiResponse,
  Article,
  ArticleDetail,
  ArticleListParams,
  PageResult,
  SaveArticleData,
} from '@/types'

/**
 * 获取文章列表
 * @param params 查询参数，包含分页、筛选条件
 * @returns 分页结果，包含文章列表及分页信息
 * @description 支持按标题、作者、分类、状态等条件筛选
 */
export const getArticleList = (params?: ArticleListParams): Promise<ApiResponse<PageResult<Article>>> => {
  return request.get('/api/article', { params })
}

/**
 * 获取当前用户的文章列表
 * @param params 查询参数
 * @returns 分页结果
 */
export const getMyArticles = (params?: ArticleListParams): Promise<ApiResponse<PageResult<Article>>> => {
  return request.get('/api/article/my', { params })
}

/**
 * 获取指定用户的文章列表
 * @param userId 用户 ID
 * @param params 查询参数
 * @returns 分页结果
 */
export const getArticlesByUser = (userId: number, params?: ArticleListParams): Promise<ApiResponse<PageResult<Article>>> => {
  return request.get(`/api/article/user/${userId}`, { params })
}

/**
 * 获取文章详情
 * @param id 文章 ID
 * @returns 文章详情对象
 * @description 使用 contentHtml 渲染，content 仅在编辑时使用
 */
export const getArticleById = (id: number): Promise<ApiResponse<ArticleDetail>> => {
  return request.get(`/api/article/${id}`)
}

/**
 * 保存(创建)文章
 * @param data 文章数据
 * @returns 保存结果
 * @description content 的 markdown 内容上传后会自动转换为 html
 */
export const createArticle = (data: SaveArticleData): Promise<ApiResponse<void>> => {
  return request.post('/api/article', data)
}

/**
 * 更新文章
 * @param id 文章 ID
 * @param data 文章更新数据
 * @returns 更新结果
 */
export const updateArticle = (id: number, data: Partial<SaveArticleData>): Promise<ApiResponse<void>> => {
  return request.put(`/api/article/${id}`, data)
}

/**
 * 删除文章
 * @param id 文章 ID
 * @returns 删除结果
 */
export const deleteArticle = (id: number): Promise<ApiResponse<void>> => {
  return request.delete(`/api/article/${id}`)
}

/**
 * 查询文章点赞状态
 * @param id 文章 ID
 * @returns 是否已点赞
 * @description 如果点赞或取消点赞出现异常，也可调用此接口更新状态
 */
export const getLikeStatus = (id: number): Promise<ApiResponse<boolean>> => {
  return request.get(`/api/article/${id}/like`)
}

/**
 * 点赞文章
 * @param id 文章 ID
 * @returns 点赞结果
 * @description 需要登录
 */
export const likeArticle = (id: number): Promise<ApiResponse<void>> => {
  return request.put(`/api/article/${id}/like`)
}

/**
 * 取消点赞文章
 * @param id 文章 ID
 * @returns 取消点赞结果
 * @description 需要登录
 */
export const unlikeArticle = (id: number): Promise<ApiResponse<void>> => {
  return request.put(`/api/article/${id}/unlike`)
}
