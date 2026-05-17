import type { UserInfo } from './user'
import type { Category } from './category'
import type { Tag } from './tag'

/**
 * 文章状态常量
 * 0: 审核中 - 文章已提交但尚未通过审核
 * 1: 已发布 - 文章已通过审核并对外展示
 * 2: 草稿 - 文章仅作者可见，未提交审核
 */
export const ArticleStatus = {
  PENDING: 0,
  PUBLISHED: 1,
  DRAFT: 2,
} as const

export type ArticleStatusType = typeof ArticleStatus[keyof typeof ArticleStatus]

/**
 * 文章列表对象
 */
export interface Article {
  /** 文章 ID */
  id: number
  /** 文章标题 */
  title: string
  /** 文章别名(用于 URL) */
  slug: string
  /** 文章摘要 */
  summary: string
  /** 封面图片 URL */
  coverImage: string
  /** 文章状态，0-审核中 1-发布 2-草稿 */
  status: number
  /** 阅读数 */
  viewCount: number
  /** 点赞数 */
  likeCount: number
  /** 评论数 */
  commentCount: number
  /** 分类 */
  category: Category
  /** 标签列表 */
  tags: Tag[]
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 作者 */
  creator: UserInfo
  /** 更新人 */
  updater: UserInfo
}

/**
 * 文章详情对象
 */
export interface ArticleDetail extends Article {
  /** markdown 内容(不做展示，只是修改时候用到) */
  content: string
  /** HTML 内容(展示用) */
  contentHtml: string
}

/**
 * 文章列表查询参数
 */
export interface ArticleListParams {
  /** 文章标题模糊查询 */
  title?: string
  /** 文章作者 ID */
  createBy?: number
  /** 文章分类 ID */
  categoryId?: number
  /** 文章状态，0-审核中 1-发布 2-草稿 */
  status?: number
  /** 文章发布时间范围(开始) */
  startTime?: string
  /** 文章发布时间范围(结束) */
  endTime?: string
  /** 当前页码 */
  current?: number
  /** 每页数量 */
  size?: number
}

/**
 * 保存文章数据
 */
export interface SaveArticleData {
  /** 文章标题 */
  title: string
  /** 文章别名(用于 URL) */
  slug: string
  /** 文章摘要 */
  summary: string
  /** 封面图片 URL */
  coverImage?: string
  /** 文章状态，0-审核中 1-发布 2-草稿 */
  status: number
  /** markdown 内容 */
  content: string
  /** 分类 ID */
  categoryId: number
  /** 标签 ID 列表 */
  tags?: number[]
}
