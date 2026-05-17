import type { UserInfo } from './user'

/**
 * 评论展示对象
 */
export interface Comment {
  /** 评论 ID */
  id: number
  /** 评论内容 */
  content: string
  /** 点赞数 */
  likeCount: number
  /** 子评论数 */
  childCount: number
  /** 文章 ID */
  articleId: number
  /** 父评论 ID */
  parentId: number
  /** 根评论 ID */
  rootId: number
  /** 用户 IP */
  ipAddress: string
  /** 创建时间 */
  createTime: string
  /** 发布者信息 */
  user: UserInfo
  /** 回复对象昵称 */
  replyToNickname?: string
  /** 评论层级,0-一级评论,1-二级评论 */
  level: number
}

/**
 * 评论列表查询参数
 */
export interface CommentListParams {
  /** 文章 ID（一级评论）或根评论 ID（二级评论） */
  id: number
  /** 当前页码 */
  current?: number
  /** 每页数量 */
  size?: number
}

/**
 * 创建评论数据
 */
export interface CreateCommentData {
  /** 文章 ID */
  articleId: number
  /** 评论内容 */
  content: string
  /** 父评论 ID,一级评论为空或 0 */
  parentId?: number
  /** 根评论 ID,一级评论为空 */
  rootId?: number
}
