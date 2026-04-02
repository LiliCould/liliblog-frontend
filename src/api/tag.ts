import request from '@/utils/request'
import type { ApiResponse } from '@/types/api.d'
import type { Tag } from '@/types/tag.d'

export function getTagList() {
    return request.get<ApiResponse<Tag[]>>('/api/tag/list')
}
