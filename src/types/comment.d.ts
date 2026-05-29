export interface Comment {
    id: number
    content: string
    likeCount: number
    childCount: number
    articleId: number
    parentId: number
    rootId: number
    ipAddress: string
    ipAddressLocation: string
    createTime: string
    creator: CreatorBrief
    level: number
}

export interface CreatorBrief {
    id: number
    username: string
    nickname: string
    avatar: string
}

export interface CommentCreateDTO {
    articleId: number
    content: string
    parentId: number
    rootId: number
}
