import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  role?: number
}

const TOKEN_KEY = 'liliblog_token'
const USER_INFO_KEY = 'liliblog_user_info'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(null)
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => Boolean(token.value))
  const username = computed(() => userInfo.value?.username || '')
  const avatar = computed(() => userInfo.value?.avatar || '')
  const nickname = computed(() => userInfo.value?.nickname || '')
  const isAdmin = computed(() => userInfo.value?.role === 0)
  const userId = computed(() => userInfo.value?.id || 0)

  /**
   * 仅在客户端调用。SSR 阶段不读取 localStorage，避免公开页因登录态受阻。
   */
  function init(): void {
    if (!import.meta.client) return
    try {
      token.value = localStorage.getItem(TOKEN_KEY)
      const raw = localStorage.getItem(USER_INFO_KEY)
      userInfo.value = raw ? (JSON.parse(raw) as UserInfo) : null
    } catch {
      token.value = null
      userInfo.value = null
    }
  }

  async function logout(): Promise<void> {
    token.value = null
    userInfo.value = null
    if (import.meta.client) {
      try {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem('liliblog_token_expires')
        localStorage.removeItem(USER_INFO_KEY)
      } catch {
        // ignore
      }
    }
    await navigateTo('/')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    username,
    avatar,
    nickname,
    isAdmin,
    userId,
    init,
    logout,
  }
})
