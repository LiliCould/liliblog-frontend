import axios from 'axios'
import request from '~/utils/request'
import { useToast } from '~/composables/useToast'
import type { ApiResponse } from '~/types'

export type UploadPhase = 'uploading' | 'processing'

export interface UploadProgressEvent {
  loaded: number
  total?: number
  percent: number
  phase: UploadPhase
}

export interface UploadTokenVO {
  fileId: number
  uploadUrl: string
  token: string
  key: string
  url: string
  expiresIn: number
  maxSize: number
  accept: string
}

export interface UploadedFileVO {
  id: number
  url: string
  fileKey: string
  mimeType?: string
  fileSize?: number
}

const UPLOAD_TIMEOUT = 600000

/**
 * 直传七牛的独立实例：
 * 1. 不能复用 request，否则会把博客 JWT 发给第三方；
 * 2. 不设置 baseURL，请求直接发往 uploadUrl。
 */
const qiniuClient = axios.create({ timeout: 0 })

/**
 * 上传文件。
 *
 * 默认走前端直传：/file/token -> 七牛 -> /file/complete。
 * 通过 NUXT_PUBLIC_UPLOAD_MODE=proxy 可回退到旧的 /file/upload 后端中转。
 * 两种模式的返回值保持一致，调用方无需感知。
 */
export function uploadFile(
  file: File,
  type: string,
  onProgress?: (event: UploadProgressEvent) => void,
): Promise<ApiResponse<string>> {
  const mode = useRuntimeConfig().public.uploadMode || 'direct'
  return mode === 'proxy'
    ? uploadViaProxy(file, type, onProgress)
    : uploadDirect(file, type, onProgress)
}

async function uploadDirect(
  file: File,
  type: string,
  onProgress?: (event: UploadProgressEvent) => void,
  retried = false,
): Promise<ApiResponse<string>> {
  const tokenResponse = await request.post('/file/token', {
    type,
    fileName: file.name,
    fileSize: file.size,
  }) as unknown as ApiResponse<UploadTokenVO>

  const info = tokenResponse.data
  if (!info) {
    throw new Error('申请上传凭证失败')
  }
  if (file.size > info.maxSize) {
    throw new Error(`文件超过大小限制(${formatSize(info.maxSize)})`)
  }

  const formData = new FormData()
  formData.append('token', info.token)
  formData.append('key', info.key)
  formData.append('file', file)

  let uploaded: { hash?: string }
  try {
    const { data } = await qiniuClient.post(info.uploadUrl, formData, {
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return
        const loaded = event.loaded
        onProgress({
          loaded,
          total: event.total,
          percent: Math.round((loaded / event.total) * 100),
          // 浏览器上行结束到服务端确认之间会有一段空窗，统一显示为“处理中”
          phase: loaded >= event.total ? 'processing' : 'uploading',
        })
      },
    })
    uploaded = data
  } catch (error) {
    // 上传本身失败才放弃；确认阶段失败时保留 PENDING 记录，由服务端清理任务兜底
    abandonDirectUpload(info.fileId)

    // 令牌过期或失效时换一个新 key 重试一次
    if (!retried && isTokenError(error)) {
      return uploadDirect(file, type, onProgress, true)
    }

    const message = mapQiniuError(error)
    useToast().error(message)
    throw new Error(message)
  }

  if (!uploaded?.hash) {
    const message = '上传结果异常，请重试'
    useToast().error(message)
    throw new Error(message)
  }

  // 业务错误由 request 拦截器统一提示
  const completeResponse = await request.post('/file/complete', {
    fileId: info.fileId,
    hash: uploaded.hash,
  }) as unknown as ApiResponse<UploadedFileVO>

  return { ...completeResponse, data: completeResponse.data.url }
}

async function uploadViaProxy(
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

function abandonDirectUpload(fileId: number): void {
  // 尽力标记失败，失败也不影响服务端清理任务
  request.post('/file/abandon', { fileId }).catch(() => {})
}

function isTokenError(error: unknown): boolean {
  const status = (error as any)?.response?.status
  const code = (error as any)?.response?.data?.code
  return status === 401 || code === 401
}

function mapQiniuError(error: unknown): string {
  const status = (error as any)?.response?.status
  const code = (error as any)?.response?.data?.code
  const raw = (error as any)?.response?.data?.error

  if (status === 401 || code === 401) return '上传凭证已失效，请重试'
  if (status === 413 || code === 413 || code === 573) return '文件超过大小限制'
  if (code === 614) return '文件已存在，请重试'
  if (code === 631) return '存储配置异常，请联系管理员'
  if ((error as any)?.message === 'Network Error') return '上传失败，请检查网络'
  return raw ? `上传失败：${raw}` : '上传失败，请稍后重试'
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${Math.round(bytes / 1024 / 1024 / 1024)}GB`
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / 1024 / 1024)}MB`
  return `${Math.max(1, Math.round(bytes / 1024))}KB`
}
