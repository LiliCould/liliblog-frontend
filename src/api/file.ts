import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

export function uploadFile(file: File, type: string) {
    const formData = new FormData()
    formData.append('file', file)
    return request.post<ApiResponse<string>>('/file/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { type },
    })
}
