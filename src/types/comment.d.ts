export interface Comment {
    id: number
    content: string
    AuthorId: number
    articleId: number
    parentId: number
    status: string
    likeCount: number
    ipAddress: string
    userAgent: string
    createTime: string
    updateTime: string
    authorNickname: string
    articleTitle: string
}
