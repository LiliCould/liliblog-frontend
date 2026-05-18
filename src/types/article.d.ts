import type { Tag } from './tag.d'

export interface CategoryBrief {
    id: number
    name: string
    slug: string
}

export interface CreatorBrief {
    id: number
    username: string
    nickname: string
    avatar: string
}

export interface Article {
    id: number
    title: string
    slug: string
    summary: string
    coverImage: string
    viewCount: number
    likeCount: number
    commentCount: number
    category: CategoryBrief
    tags: Tag[]
    updateTime: string
    updater: string
    createTime: string
    creator: CreatorBrief
    status: number
}

export interface ArticleDetail extends Article {
    content: string
    contentHtml: string
}

export interface ArticleCreateDTO {
    title: string
    slug?: string
    summary?: string
    content: string
    coverImage?: string
    status: number
    categoryId: number
    tags: number[]
}

export interface ArticleUpdateDTO extends ArticleCreateDTO { }
