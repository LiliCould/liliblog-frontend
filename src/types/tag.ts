/**
 * 标签信息
 */
export interface Tag {
  /** 标签 ID */
  id: number
  /** 标签名称 */
  name: string
  /** 标签颜色 */
  color: string
  /** 标签别名 */
  slug?: string
  /** 文章数量 */
  articleCount?: number
}

/**
 * 标签列表查询参数
 */
export interface TagListParams {
  /** 标签名称模糊查询 */
  name?: string
  /** 当前页码 */
  current?: number
  /** 每页数量 */
  size?: number
}
