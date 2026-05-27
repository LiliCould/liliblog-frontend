import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { getToken, setToken, setTokenExpires, clearAuth } from '@/utils/storage'
import type { ApiResponse } from '@/types/api'
import { useToast } from '@/composables/useToast'

const LOG_PREFIX = '[认证]'

const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
    withCredentials: true,
})

let isRefreshing = false
let hasNotifiedExpired = false
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

function handleRefreshTokenExpired() {
    console.warn(`${LOG_PREFIX} 刷新令牌已过期，清除登录状态`)
    clearAuth()
    if (!hasNotifiedExpired) {
        hasNotifiedExpired = true
        showToast('error', '登录已过期，请重新登录')
        import('@/composables/useAuthModal').then(({ useAuthModal }) => {
            const { open } = useAuthModal()
            open('login')
        })
        setTimeout(() => { hasNotifiedExpired = false }, 5000)
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
                console.log(`${LOG_PREFIX} 访问令牌过期，尝试使用刷新令牌获取新令牌`)
                try {
                    const { data } = await axios.post<ApiResponse<{ accessToken: string; expiresIn: number }>>(
                        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                        {},
                        { withCredentials: true },
                    )
                    if (data.code === 0) {
                        console.log(`${LOG_PREFIX} 令牌刷新成功`)
                        setToken(data.data.accessToken)
                        setTokenExpires(data.data.expiresIn)
                        pendingRequests.forEach((cb) => cb(data.data.accessToken))
                        pendingRequests = []
                        originalConfig.headers.Authorization = `Bearer ${data.data.accessToken}`
                        return service(originalConfig)
                    } else {
                        console.warn(`${LOG_PREFIX} 令牌刷新失败，业务码: ${data.code}`)
                        handleRefreshTokenExpired()
                        return Promise.reject(error)
                    }
                } catch (refreshError: any) {
                    console.warn(`${LOG_PREFIX} 刷新令牌请求失败`)
                    if (refreshError?.response?.status === 401) {
                        console.warn(`${LOG_PREFIX} 刷新令牌已过期`)
                    }
                    handleRefreshTokenExpired()
                    return Promise.reject(error)
                } finally {
                    isRefreshing = false
                }
            } else {
                console.log(`${LOG_PREFIX} 令牌刷新中，请求进入等待队列`)
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

export async function proactiveRefresh(): Promise<boolean> {
    if (isRefreshing) return false
    isRefreshing = true
    console.log(`${LOG_PREFIX} 主动刷新令牌`)
    try {
        const { data } = await axios.post<ApiResponse<{ accessToken: string; expiresIn: number }>>(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            {},
            { withCredentials: true },
        )
        if (data.code === 0) {
            console.log(`${LOG_PREFIX} 主动刷新成功`)
            setToken(data.data.accessToken)
            setTokenExpires(data.data.expiresIn)
            pendingRequests.forEach((cb) => cb(data.data.accessToken))
            pendingRequests = []
            return true
        } else {
            console.warn(`${LOG_PREFIX} 主动刷新失败，业务码: ${data.code}`)
            handleRefreshTokenExpired()
            return false
        }
    } catch (refreshError: any) {
        console.warn(`${LOG_PREFIX} 主动刷新请求失败`)
        if (refreshError?.response?.status === 401) {
            handleRefreshTokenExpired()
        }
        return false
    } finally {
        isRefreshing = false
    }
}

export default service
