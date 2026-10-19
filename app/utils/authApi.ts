import request from '~/utils/request'
import type { ApiResponse } from '~/types'

type QueryParams = Record<string, unknown>

async function unwrap<T>(promise: Promise<unknown>): Promise<T> {
  const response = await promise as ApiResponse<T>
  if (response.code !== 0) {
    throw new Error(response.msg || '请求失败')
  }
  return response.data
}

/**
 * 需要登录的接口统一走这里：
 * - 复用 request 实例的 Authorization 注入
 * - 复用它的令牌自动刷新与登录过期处理
 * - 返回值直接是 ApiResponse.data
 *
 * 公开数据请继续使用 useApi()。
 */
export function useAuthApi() {
  return {
    get<T>(path: string, params?: QueryParams) {
      return unwrap<T>(request.get(path, { params }))
    },
    post<T>(path: string, body?: unknown) {
      return unwrap<T>(request.post(path, body))
    },
    put<T>(path: string, body?: unknown) {
      return unwrap<T>(request.put(path, body))
    },
    del<T>(path: string) {
      return unwrap<T>(request.delete(path))
    },
  }
}
