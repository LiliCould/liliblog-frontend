import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

/**
 * 上传阶段。
 * - `uploading`：浏览器正在把请求体发给后端，此时 loaded/total 是真实进度
 * - `processing`：请求体已发完，后端正在校验并转存到七牛云，这段没有任何进度数据
 *
 * 阶段划分依据（已实测）：XHR 在请求体发完时会给出 loaded === total 的进度事件，
 * 且该事件确定早于响应到达，中间是「无进度反馈空窗」。
 */
export type UploadPhase = 'uploading' | 'processing'

export interface UploadProgressEvent {
    loaded: number
    total?: number
    percent: number
    phase: UploadPhase
}

/**
 * 上传接口的超时时间（毫秒），与 nginx 侧的 proxy_read_timeout(600s) 对齐。
 * 不能沿用 axios 实例默认的 15s：40MB 文件在 1Mbps 上行约需 320s，
 * 到点后 axios 会主动断开连接，后端读到一半的 multipart 请求体会解析失败
 * （表现为 MultipartException: Failed to parse multipart servlet request）
 */
const UPLOAD_TIMEOUT = 600000

export function uploadFile(file: File, type: string, onProgress?: (e: UploadProgressEvent) => void) {
    const formData = new FormData()
    formData.append('file', file)
    return request.post<ApiResponse<string>>('/file/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { type },
        timeout: UPLOAD_TIMEOUT,
        onUploadProgress: (progressEvent) => {
            if (!onProgress) return
            const total = progressEvent.total
            if (!total) return
            const loaded = progressEvent.loaded
            // loaded >= total 表示请求体已全部发出，之后只剩后端的转存空窗
            const phase: UploadPhase = loaded >= total ? 'processing' : 'uploading'
            const percent = Math.round((loaded / total) * 100)
            onProgress({ loaded, total, percent, phase })
        },
    })
}
