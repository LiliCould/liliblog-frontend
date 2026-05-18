import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { getToken, setToken, clearAuth } from '@/utils/storage'
import type { ApiResponse } from '@/types/api'
import router from '@/router/index'

const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
})

let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

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
        console.error(res.msg || '请求失败')
        return Promise.reject(new Error(res.msg || '请求失败'))
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
        console.error(error.response?.data?.msg || '请求失败')
        return Promise.reject(error)
    },
)

export default service
