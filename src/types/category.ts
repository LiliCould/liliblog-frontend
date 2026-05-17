/**
 * 分类展示对象
 */
export interface Category {
  /** 分类 ID */
  id: number
  /** 分类名称 */
  name: string
  /** 分类别名 */
  slug: string
  /** 分类描述 */
  description: string
  /** 排序字段，约定越小等级越高 */
  sortOrder: number
  /** 状态 */
  status?: number
  /** 文章数量 */
  articleCount?: number
}

/**
 * 分类列表查询参数
 */
export interface CategoryListParams {
  /** 分类名称模糊查询 */
  name?: string
  /** 分类别名精准查询 */
  slug?: string
  /** 分类描述模糊查询 */
  description?: string
  /** 当前页码 */
  current?: number
  /** 每页数量 */
  size?: number
}
