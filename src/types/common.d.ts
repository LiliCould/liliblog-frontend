export interface PageParams {
    pageSize?: number
    pageNum?: number
}

export enum ArticleStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    HIDDEN = 'HIDDEN',
    DELETE = 'DELETE',
}
