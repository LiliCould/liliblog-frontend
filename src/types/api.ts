/**
 * 统一 API 响应格式
 */
export interface ApiResponse<T> {
  /** 状态码，0 表示成功 */
  code: number
  /** 响应信息/错误信息 */
  msg: string
  /** 数据 */
  data: T
  /** 响应时间 */
  time: string
}

/**
 * 分页结果格式
 */
export interface PageResult<T> {
  /** 当前页码 */
  current: number
  /** 每页数量 */
  size: number
  /** 总页数 */
  totalPage: number
  /** 总记录数 */
  total: number
  /** 是否有上一页 */
  hasPrevious: boolean
  /** 是否有下一页 */
  hasNext: boolean
  /** 数据列表 */
  records: T[]
}

/**
 * 分页查询参数
 */
export interface PaginationParams {
  /** 当前页码，默认 1 */
  current?: number
  /** 每页数量，默认 10 */
  size?: number
}
