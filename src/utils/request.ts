import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { getToken, setToken, clearAuth } from '@/utils/storage'
import type { ApiResponse } from '@/types/api'
import router from '@/router/index'

import { useToast } from '@/composables/useToast'

const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
})

let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

const ERROR_CODE_MAP: Record<number, string> = {
    400: '请求参数错误',
    403: '没有操作权限',
    404: '请求的资源不存在',
    405: '请求方法不允许',
    408: '请求超时',
    409: '数据冲突，请刷新后重试',
    422: '提交的数据验证失败',
    429: '请求过于频繁，请稍后再试',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务暂不可用',
    504: '网关超时',
}

const SILENT_HTTP_CODES = new Set([401])

const BUSINESS_CODE_MAP: Record<number, string> = {
    403: '没有操作权限',
    40301: '权限不足',
    40401: '资源不存在',
    40001: '参数错误',
    40101: '认证失败',
}

function showToast(type: 'error' | 'success', message: string) {
    const toast = useToast()
    if (type === 'error') {
        toast.error(message)
    } else {
        toast.success(message)
    }
}

service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

service.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => {
        const res = response.data
        if (res.code === 0) {
            return res as unknown as AxiosResponse
        }
        const businessMsg = BUSINESS_CODE_MAP[res.code] || res.msg || '操作失败'
        if (!SILENT_HTTP_CODES.has(res.code)) {
            showToast('error', businessMsg)
        }
        return Promise.reject(new Error(businessMsg))
    },
    async (error) => {
        const originalConfig = error.config
        if (error.response?.status === 401 && !originalConfig._retry) {
            if (!isRefreshing) {
                isRefreshing = true
                originalConfig._retry = true
                try {
                    const { data } = await axios.post<ApiResponse<{ accessToken: string }>>(
                        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                        {},
                        { headers: { Authorization: `Bearer ${getToken()}` } }
                    )
                    if (data.code === 0) {
                        setToken(data.data.accessToken)
                        pendingRequests.forEach((cb) => cb(data.data.accessToken))
                        pendingRequests = []
                        originalConfig.headers.Authorization = `Bearer ${data.data.accessToken}`
                        return service(originalConfig)
                    } else {
                        clearAuth()
                        router.push('/login')
                        return Promise.reject(error)
                    }
                } catch {
                    clearAuth()
                    router.push('/login')
                    return Promise.reject(error)
                } finally {
                    isRefreshing = false
                }
            } else {
                return new Promise((resolve) => {
                    pendingRequests.push((token: string) => {
                        originalConfig.headers.Authorization = `Bearer ${token}`
                        resolve(service(originalConfig))
                    })
                })
            }
        }

        if (error.message === 'Network Error') {
            showToast('error', '网络连接失败，请检查网络')
        } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            showToast('error', '请求超时，请稍后重试')
        } else if (error.response) {
            const status = error.response.status
            if (!SILENT_HTTP_CODES.has(status)) {
                const serverMsg = error.response.data?.msg || error.response.data?.message
                const msg = serverMsg || ERROR_CODE_MAP[status] || `请求失败(${status})`
                showToast('error', msg)
            }
        } else {
            showToast('error', '请求失败，请稍后重试')
        }

        return Promise.reject(error)
    },
)

export default service
