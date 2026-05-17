/**
 * 验证工具函数
 * 提供表单验证相关的常用方法
 */

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否为有效邮箱
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * 验证用户名格式（字母、数字、下划线，3-20位）
 * @param username 用户名
 * @returns 是否为有效用户名
 */
export const isValidUsername = (username: string): boolean => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/
  return regex.test(username)
}

/**
 * 验证密码格式（至少6位）
 * @param password 密码
 * @returns 是否为有效密码
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

/**
 * 验证验证码格式（6位数字）
 * @param code 验证码
 * @returns 是否为有效验证码
 */
export const isValidCode = (code: string): boolean => {
  const regex = /^\d{6}$/
  return regex.test(code)
}
