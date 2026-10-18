import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { loginByEmail, loginByPwd, logout as logoutApi } from '~/api/auth'
import {
  clearAuth,
  getToken,
  getUserInfo,
  setToken,
  setTokenExpires,
  setUserInfo,
} from '~/utils/storage'
import type { LoginByEmailDTO, LoginByPwdDTO, LoginVO, User } from '~/types'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(null)
  const userInfo = ref<User | null>(null)

  const isLoggedIn = computed(() => Boolean(token.value))
  const username = computed(() => userInfo.value?.username || '')
  const avatar = computed(() => userInfo.value?.avatar || '')
  const nickname = computed(() => userInfo.value?.nickname || '')
  const email = computed(() => userInfo.value?.email || '')
  const isAdmin = computed(() => userInfo.value?.role === 0)
  const userId = computed(() => userInfo.value?.id || 0)

  function init(): void {
    if (!import.meta.client) return

    const savedToken = getToken()
    const savedUserInfo = getUserInfo<User>()
    token.value = savedToken
    userInfo.value = savedUserInfo
  }

  function handleLoginSuccess(data: LoginVO): LoginVO {
    token.value = data.accessToken
    userInfo.value = data.userInfo
    setToken(data.accessToken)
    setTokenExpires(data.expiresIn)
    setUserInfo(data.userInfo)
    return data
  }

  async function loginByPassword(data: LoginByPwdDTO): Promise<LoginVO> {
    const response = await loginByPwd({ ...data, loginType: 'pwd' })
    return handleLoginSuccess(response.data)
  }

  async function loginByMail(data: LoginByEmailDTO): Promise<LoginVO> {
    const response = await loginByEmail({ ...data, loginType: 'email' })
    return handleLoginSuccess(response.data)
  }

  async function logout(): Promise<void> {
    try {
      await logoutApi()
    } catch {
      // 服务端登出失败也清理本地状态
    } finally {
      token.value = null
      userInfo.value = null
      clearAuth()
      await navigateTo('/')
    }
  }

  function onTokenRefreshed(newToken: string, newUserInfo: User, expiresIn: number): void {
    token.value = newToken
    userInfo.value = newUserInfo
    setToken(newToken)
    setTokenExpires(expiresIn)
    setUserInfo(newUserInfo)
  }

  function updateAvatar(avatarUrl: string): void {
    if (!userInfo.value) return
    userInfo.value.avatar = avatarUrl
    setUserInfo(userInfo.value)
  }

  function updateNickname(newNickname: string): void {
    if (!userInfo.value) return
    userInfo.value.nickname = newNickname
    setUserInfo(userInfo.value)
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    username,
    avatar,
    nickname,
    email,
    isAdmin,
    userId,
    init,
    loginByPassword,
    loginByMail,
    logout,
    onTokenRefreshed,
    updateAvatar,
    updateNickname,
  }
})
