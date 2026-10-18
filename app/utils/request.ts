import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiResponse } from '~/types'
import { clearAuth, getToken, isTokenExpired, setToken, setTokenExpires } from '~/utils/storage'
import { useToast } from '~/composables/useToast'
import { useUiStore } from '~/stores/ui'

const LOG_PREFIX = '[认证]'

const service: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 15000,
  withCredentials: true,
})

let isRefreshing = false
let hasNotifiedExpired = false
let pendingRequests: Array<{ resolve: (token: string) => void; config: InternalAxiosRequestConfig }> = []

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

const AUTH_EXPIRED_CODES = new Set([2005, 40101])

function showToast(type: 'error' | 'success', message: string): void {
  const toast = useToast()
  if (type === 'error') toast.error(message)
  else toast.success(message)
}

function handleRefreshTokenExpired(): void {
  clearAuth()
  pendingRequests = []

  if (import.meta.client) {
    window.dispatchEvent(new Event('liliblog:auth-expired'))
  }

  if (hasNotifiedExpired) return

  hasNotifiedExpired = true
  showToast('error', '登录已过期，请重新登录')
  try {
    useUiStore().openAuthModal('login')
  } catch {
    // Pinia 尚未激活时忽略，由页面守卫处理
  }
  setTimeout(() => {
    hasNotifiedExpired = false
  }, 5000)
}

async function doRefresh(): Promise<string | null> {
  try {
    const { data } = await axios.post<ApiResponse<{ accessToken: string; expiresIn: number }>>(
      '/auth/refresh',
      {},
      { withCredentials: true },
    )
    if (data.code === 0) {
      setToken(data.data.accessToken)
      setTokenExpires(data.data.expiresIn)
      return data.data.accessToken
    }
    return null
  } catch {
    return null
  }
}

service.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (!token) return config

    if (isTokenExpired()) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push({
            resolve: (newToken: string) => {
              if (newToken) config.headers.Authorization = `Bearer ${newToken}`
              resolve(config)
            },
            config,
          })
        })
      }

      isRefreshing = true
      const newToken = await doRefresh()
      isRefreshing = false

      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`
        pendingRequests.forEach(({ resolve }) => resolve(newToken))
        pendingRequests = []
      } else {
        delete config.headers.Authorization
        pendingRequests.forEach(({ resolve }) => resolve(''))
        pendingRequests = []
        handleRefreshTokenExpired()
      }
      return config
    }

    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => Promise.reject(error),
)

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const res = response.data
    if (res.code === 0) return res as unknown as AxiosResponse

    if (AUTH_EXPIRED_CODES.has(res.code)) {
      handleRefreshTokenExpired()
      return Promise.reject(new Error(res.msg || '登录已过期，请重新登录'))
    }

    const message = BUSINESS_CODE_MAP[res.code] || res.msg || '操作失败'
    if (!SILENT_HTTP_CODES.has(res.code)) showToast('error', message)
    return Promise.reject(new Error(message))
  },
  async (error) => {
    const originalConfig = error.config
    if (error.response?.status === 401 && !originalConfig._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push({
            resolve: (token: string) => {
              if (token) originalConfig.headers.Authorization = `Bearer ${token}`
              else delete originalConfig.headers.Authorization
              originalConfig._retry = true
              resolve(service(originalConfig))
            },
            config: originalConfig,
          })
        })
      }

      isRefreshing = true
      originalConfig._retry = true
      const newToken = await doRefresh()
      isRefreshing = false

      if (newToken) {
        originalConfig.headers.Authorization = `Bearer ${newToken}`
        pendingRequests.forEach(({ resolve }) => resolve(newToken))
        pendingRequests = []
        return service(originalConfig)
      }

      pendingRequests.forEach(({ resolve }) => resolve(''))
      pendingRequests = []
      handleRefreshTokenExpired()
      return Promise.reject(error)
    }

    if (error.message === 'Network Error') {
      showToast('error', '网络连接失败，请检查网络')
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      showToast('error', '请求超时，请稍后重试')
    } else if (error.response) {
      const status = error.response.status
      if (!SILENT_HTTP_CODES.has(status)) {
        const serverMsg = error.response.data?.msg || error.response.data?.message
        showToast('error', serverMsg || ERROR_CODE_MAP[status] || `请求失败(${status})`)
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
  const newToken = await doRefresh()
  isRefreshing = false

  if (newToken) {
    pendingRequests.forEach(({ resolve }) => resolve(newToken))
    pendingRequests = []
    return true
  }

  handleRefreshTokenExpired()
  return false
}

export default service
