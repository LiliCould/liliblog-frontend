import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loginByPassword, loginByEmail, logout as logoutApi, getCurrentUser } from '@/api'
import type { UserInfo, LoginCredentials } from '@/types'

/**
 * 认证状态管理 Store
 * 管理用户登录状态、Token、用户信息
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const userInfo = ref<UserInfo | null>(null)

  // Getters
  const isLoggedIn = computed(() => !!accessToken.value)
  const isAdmin = computed(() => userInfo.value?.role === 0)

  // Actions

  /**
   * 用户名密码登录
   * @param credentials 登录凭证
   * @returns 登录是否成功
   */
  const login = async (credentials: LoginCredentials) => {
    const res = await loginByPassword(credentials)
    if (res.code === 0) {
      accessToken.value = res.data.accessToken
      userInfo.value = res.data.userInfo
      localStorage.setItem('accessToken', res.data.accessToken)
      return true
    }
    return false
  }

  /**
   * 邮箱验证码登录
   * @param data 邮箱和验证码
   * @returns 登录是否成功
   */
  const loginEmail = async (data: { email: string; code: string }) => {
    const res = await loginByEmail(data)
    if (res.code === 0) {
      accessToken.value = res.data.accessToken
      userInfo.value = res.data.userInfo
      localStorage.setItem('accessToken', res.data.accessToken)
      return true
    }
    return false
  }

  /**
   * 获取当前用户信息
   * @description 用于页面刷新后恢复用户状态
   */
  const fetchUserInfo = async () => {
    try {
      const res = await getCurrentUser()
      if (res.code === 0) {
        userInfo.value = res.data
      }
    } catch {
      // 获取失败，清除登录状态
      clearAuth()
    }
  }

  /**
   * 登出
   * @description 调用登出接口并清除本地登录状态
   */
  const logout = async () => {
    try {
      await logoutApi()
    } finally {
      clearAuth()
    }
  }

  /**
   * 清除认证状态
   * @description 仅清除本地状态，不调用接口
   */
  const clearAuth = () => {
    accessToken.value = null
    userInfo.value = null
    localStorage.removeItem('accessToken')
  }

  return {
    accessToken,
    userInfo,
    isLoggedIn,
    isAdmin,
    login,
    loginEmail,
    fetchUserInfo,
    logout,
    clearAuth,
  }
})
