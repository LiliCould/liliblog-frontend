import request from '~/utils/request'
import type { ApiResponse } from '~/types'

export type UploadPhase = 'uploading' | 'processing'

export interface UploadProgressEvent {
  loaded: number
  total?: number
  percent: number
  phase: UploadPhase
}

const UPLOAD_TIMEOUT = 600000

export function uploadFile(
  file: File,
  type: string,
  onProgress?: (event: UploadProgressEvent) => void,
): Promise<ApiResponse<string>> {
  const formData = new FormData()
  formData.append('file', file)

  return request.post('/file/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: { type },
    timeout: UPLOAD_TIMEOUT,
    onUploadProgress: (progressEvent) => {
      if (!onProgress) return
      const total = progressEvent.total
      if (!total) return
      const loaded = progressEvent.loaded
      const phase: UploadPhase = loaded >= total ? 'processing' : 'uploading'
      onProgress({
        loaded,
        total,
        percent: Math.round((loaded / total) * 100),
        phase,
      })
    },
  }) as unknown as Promise<ApiResponse<string>>
}
