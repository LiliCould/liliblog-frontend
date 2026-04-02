import request from '@/utils/request'
import type { ApiResponse } from '@/types/api.d'

export function uploadFile(file: File, type?: string) {
    const formData = new FormData()
    formData.append('file', file)
    return request.post<ApiResponse<string>>('/api/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: type ? { type } : undefined,
    })
}
