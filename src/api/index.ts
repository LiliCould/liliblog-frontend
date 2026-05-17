import axios from 'axios'
import type { ApiResponse, LoginResult } from '@/types'

// 创建 Axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

// 请求拦截器：添加 Token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：处理 Token 刷新
request.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    // 判断是否为 401 错误且未重试过
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // 调用刷新接口，Refresh Token 自动通过 Cookie 携带
        const res = await axios.post<ApiResponse<LoginResult>>(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const { accessToken } = res.data.data

        // 更新本地存储的 Access Token
        localStorage.setItem('accessToken', accessToken)

        // 使用新 Token 重试原请求
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return request(originalRequest)
      } catch {
        // 刷新失败，清除登录状态并跳转登录页
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default request

export * from './auth'
export * from './user'
export * from './article'
export * from './category'
export * from './tag'
export * from './comment'
export * from './file'
