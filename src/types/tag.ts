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
