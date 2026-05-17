/**
 * 本地存储工具函数
 * 封装 localStorage 操作，提供类型安全的存取方法
 */

/**
 * 从 localStorage 获取值
 * @param key 存储键名
 * @returns 存储值，不存在则返回 null
 */
export const getItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : null
  } catch {
    return null
  }
}

/**
 * 向 localStorage 存储值
 * @param key 存储键名
 * @param value 存储值
 */
export const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('localStorage 存储失败:', error)
  }
}

/**
 * 从 localStorage 移除值
 * @param key 存储键名
 */
export const removeItem = (key: string): void => {
  localStorage.removeItem(key)
}

/**
 * 清空 localStorage
 */
export const clear = (): void => {
  localStorage.clear()
}
