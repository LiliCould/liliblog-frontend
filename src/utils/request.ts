import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, clearAuth } from './storage'
import type { ApiResponse } from '@/types/api.d'
import router from '@/router/index'

const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
})

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
        if (res.code === 0 || res.code === 200) {
            return res as unknown as AxiosResponse
        }
        ElMessage.error(res.message || '请求失败')
        return Promise.reject(new Error(res.message || '请求失败'))
    },
    (error) => {
        if (error.response) {
            const status = error.response.status
            if (status === 401) {
                clearAuth()
                ElMessage.error('登录已过期，请重新登录')
                router.push('/login')
            } else if (status === 403) {
                ElMessage.error('没有权限')
            } else if (status === 500) {
                ElMessage.error('服务器错误')
            } else {
                ElMessage.error(error.response.data?.message || '请求失败')
            }
        } else {
            ElMessage.error('网络异常，请稍后重试')
        }
        return Promise.reject(error)
    },
)

export default service
