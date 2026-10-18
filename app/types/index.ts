export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
  time: string
}

export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  totalPage: number
  hasPrevious: boolean
  hasNext: boolean
}

export interface Tag {
  id: number
  name: string
  color: string
  createTime: string
  updateTime?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  sortOrder: number
  status: number
  createTime: string
  updateTime?: string
}

export interface CreatorBrief {
  id: number
  username: string
  nickname: string
  avatar: string
  email?: string
  role?: number
  status?: number
  lastLoginTime?: string
}

export interface Article {
  id: number
  title: string
  slug: string
  summary: string
  status: number
  coverImage: string
  viewCount: number
  likeCount: number
  commentCount: number
  category: Category | null
  tags: Tag[]
  updateTime: string
  updater: CreatorBrief | null
  createTime: string
  creator: CreatorBrief | null
}

export interface ArticleDetail extends Article {
  content: string
  contentHtml: string
}

export interface User {
  id: number
  username: string
  nickname: string
  avatar: string
  email?: string
  role: number
  status: number
  lastLoginTime: string
}

export interface Comment {
  id: number
  content: string
  likeCount: number
  childCount: number
  articleId: number
  parentId: number
  rootId: number
  ipAddress?: string
  ipAddressLocation?: string
  createTime: string
  creator: CreatorBrief | null
  level: number
}

export interface CommentCreateDTO {
  articleId: number
  content: string
  parentId: number
  rootId: number
}

export interface LoginByPwdDTO {
  loginType: string
  username: string
  password: string
}

export interface LoginByEmailDTO {
  loginType: string
  email: string
  code: string | number
}

export interface RegisterDTO {
  username: string
  email: string
  password: string
  confirmPassword: string
  nickname: string
}

export interface PasswordChangeDTO {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface LoginVO {
  accessToken: string
  expiresIn: number
  userInfo: User
}
