import type { ApiResponse } from '~/types'

type QueryParams = Record<string, string | number | boolean | undefined | null>

interface RequestOptions {
  params?: QueryParams
  body?: unknown
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
}

/**
 * 公开页面统一走这里：
 * - SSR 时直连后端
 * - 浏览器端在开发环境走同源 Nitro 代理，生产环境直连 api.lilicould.cn
 * - 不携带 Authorization，公开数据与登录态解耦
 */
export function useApi() {
  const config = useRuntimeConfig()
  const baseURL = import.meta.server
    ? config.apiBase
    : (config.public.apiBase || '')

  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const response = await $fetch<ApiResponse<T>>(path, {
      baseURL,
      method: options.method || 'GET',
      params: options.params,
      body: options.body,
      headers: options.headers,
    })

    if (response.code !== 0) {
      throw new Error(response.msg || '请求失败')
    }

    return response.data
  }

  return {
    get<T>(path: string, params?: QueryParams) {
      return request<T>(path, { params })
    },
    post<T>(path: string, body?: unknown) {
      return request<T>(path, { method: 'POST', body })
    },
    put<T>(path: string, body?: unknown) {
      return request<T>(path, { method: 'PUT', body })
    },
    del<T>(path: string) {
      return request<T>(path, { method: 'DELETE' })
    },
  }
}
