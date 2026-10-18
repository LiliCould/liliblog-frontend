import { ref } from 'vue'
import { getToken, getTokenExpires, isTokenExpired, isTokenExpiringSoon } from '~/utils/storage'
import { proactiveRefresh } from '~/utils/request'

const CHECK_INTERVAL = 60 * 1000
const REFRESH_THRESHOLD = 5 * 60 * 1000

let checkTimer: ReturnType<typeof setInterval> | null = null

export function useTokenRefresh() {
  const userStore = useUserStore()
  const lastRefreshTime = ref(0)

  async function checkAndRefresh(): Promise<void> {
    if (!import.meta.client) return
    if (!userStore.isLoggedIn || !getToken()) return

    if (isTokenExpired()) {
      const now = Date.now()
      if (now - lastRefreshTime.value < 30 * 1000) return
      lastRefreshTime.value = now
      await proactiveRefresh()
      return
    }

    if (isTokenExpiringSoon(REFRESH_THRESHOLD)) {
      const now = Date.now()
      if (now - lastRefreshTime.value < 30 * 1000) return
      lastRefreshTime.value = now
      await proactiveRefresh()
      if (import.meta.dev) {
        console.log(`[认证] 令牌续期完成，下次过期时间: ${new Date(getTokenExpires()).toLocaleString()}`)
      }
    }
  }

  function startAutoCheck(): void {
    if (!import.meta.client || checkTimer) return
    checkTimer = setInterval(checkAndRefresh, CHECK_INTERVAL)
  }

  function stopAutoCheck(): void {
    if (!import.meta.client || !checkTimer) return
    clearInterval(checkTimer)
    checkTimer = null
  }

  return {
    startAutoCheck,
    stopAutoCheck,
    checkAndRefresh,
  }
}
