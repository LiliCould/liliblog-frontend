export interface PageParams {
    current?: number
    size?: number
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
