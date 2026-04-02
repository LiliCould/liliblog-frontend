import type { Tag } from './tag.d'

export interface Article {
    id: number
    title: string
    slug: string
    summary: string
    content: string
    contentHtml: string
    coverImage: string
    status: string
    viewCount: number
    likeCount: number
    commentCount: number
    isTop: number
    isRecommend: number
    authorId: number
    categoryId: number
    createTime: string
    updateTime: string
    publishTime: string
    authorNickname: string
    categoryName: string
    tags: Tag[]
}

export interface ArticleCreateDTO {
    title: string
    slug: string
    summary: string
    content: string
    contentHtml: string
    coverImage?: string
    status: string
    categoryId: number
    tagIds: number[]
}

export interface ArticleUpdateDTO {
    id: number
    title: string
    slug: string
    summary: string
    content: string
    contentHtml: string
    coverImage?: string
    status: string
    categoryId: number
    tagIds: number[]
}
