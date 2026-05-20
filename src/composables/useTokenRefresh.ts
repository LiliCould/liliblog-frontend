import { ref, onMounted, onUnmounted } from 'vue'
import { getToken, isTokenExpiringSoon, getTokenExpires } from '@/utils/storage'
import { proactiveRefresh } from '@/utils/request'
import { useUserStore } from '@/stores/user'

const LOG_PREFIX = '[认证]'

const CHECK_INTERVAL = 60 * 1000
const REFRESH_THRESHOLD = 5 * 60 * 1000

let checkTimer: ReturnType<typeof setInterval> | null = null

export function useTokenRefresh() {
    const userStore = useUserStore()
    const lastRefreshTime = ref(0)

    async function checkAndRefresh() {
        if (!userStore.isLoggedIn) return
        if (!getToken()) return

        if (isTokenExpiringSoon(REFRESH_THRESHOLD)) {
            const now = Date.now()
            if (now - lastRefreshTime.value < 30 * 1000) {
                console.log(`${LOG_PREFIX} 距离上次刷新不足30秒，跳过本次主动刷新`)
                return
            }
            console.log(`${LOG_PREFIX} 访问令牌即将过期，主动刷新`)
            lastRefreshTime.value = now
            const success = await proactiveRefresh()
            if (success) {
                console.log(`${LOG_PREFIX} 主动刷新完成，下次过期时间: ${new Date(getTokenExpires()).toLocaleString()}`)
            }
        }
    }

    function startAutoCheck() {
        if (checkTimer) return
        console.log(`${LOG_PREFIX} 启动令牌自动检查，间隔 ${CHECK_INTERVAL / 1000} 秒`)
        checkTimer = setInterval(checkAndRefresh, CHECK_INTERVAL)
    }

    function stopAutoCheck() {
        if (checkTimer) {
            console.log(`${LOG_PREFIX} 停止令牌自动检查`)
            clearInterval(checkTimer)
            checkTimer = null
        }
    }

    onMounted(() => {
        if (userStore.isLoggedIn) {
            startAutoCheck()
            checkAndRefresh()
        }
    })

    onUnmounted(() => {
        stopAutoCheck()
    })

    return {
        startAutoCheck,
        stopAutoCheck,
        checkAndRefresh,
    }
}
