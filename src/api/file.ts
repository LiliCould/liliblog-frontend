import request from './index'
import type { ApiResponse } from '@/types'

/**
 * 上传文件
 * @param file 文件对象
 * @param type 上传类型：cover-封面, avatar-头像, image-图片, file-文件
 * @returns 上传结果，包含文件 URL
 */
export const uploadFile = (file: File, type: 'cover' | 'avatar' | 'image' | 'file'): Promise<ApiResponse<string>> => {
  const formData = new FormData()
  formData.append('file', file)

  return request.post(`/file/upload?type=${type}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
