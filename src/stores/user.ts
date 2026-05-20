import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginByPwd, loginByEmail, logout as logoutApi } from '@/api/auth'
import { getToken, setToken, setTokenExpires, clearAuth, getUserInfo, setUserInfo } from '@/utils/storage'
import type { LoginByPwdDTO, LoginByEmailDTO, LoginVO, UserInfo } from '@/types/auth'
import type { ApiResponse } from '@/types/api'
import router from '@/router'

const LOG_PREFIX = '[认证]'

export const useUserStore = defineStore('user', () => {
    const token = ref<string | null>(null)
    const userInfo = ref<UserInfo | null>(null)

    const isLoggedIn = computed(() => !!token.value)
    const username = computed(() => userInfo.value?.username || '')
    const avatar = computed(() => userInfo.value?.avatar || '')
    const nickname = computed(() => userInfo.value?.nickname || '')
    const isAdmin = computed(() => userInfo.value?.role === 0)
    const userId = computed(() => userInfo.value?.id || 0)

    function init() {
        const savedToken = getToken()
        const savedUserInfo = getUserInfo<UserInfo>()
        if (savedToken) {
            token.value = savedToken
        }
        if (savedUserInfo) {
            userInfo.value = savedUserInfo
        }
    }

    function handleLoginSuccess(data: LoginVO) {
        console.log(`${LOG_PREFIX} 登录成功，存储访问令牌及过期时间`)
        token.value = data.accessToken
        userInfo.value = data.userInfo
        setToken(data.accessToken)
        setTokenExpires(data.expiresIn)
        setUserInfo(data.userInfo)
    }

    async function loginByPassword(data: LoginByPwdDTO) {
        const res = await loginByPwd({ ...data, loginType: 'pwd' }) as unknown as ApiResponse<LoginVO>
        handleLoginSuccess(res.data)
        return res.data
    }

    async function loginByMail(data: LoginByEmailDTO) {
        const res = await loginByEmail({ ...data, loginType: 'email' }) as unknown as ApiResponse<LoginVO>
        handleLoginSuccess(res.data)
        return res.data
    }

    async function logout() {
        console.log(`${LOG_PREFIX} 用户主动登出`)
        try {
            await logoutApi()
            console.log(`${LOG_PREFIX} 服务端登出成功`)
        } catch {
            console.warn(`${LOG_PREFIX} 服务端登出请求失败，仍清除本地状态`)
        } finally {
            token.value = null
            userInfo.value = null
            clearAuth()
            router.push('/')
        }
    }

    function onTokenRefreshed(newToken: string, newUserInfo: UserInfo, expiresIn: number) {
        token.value = newToken
        userInfo.value = newUserInfo
        setToken(newToken)
        setTokenExpires(expiresIn)
        setUserInfo(newUserInfo)
    }

    function updateAvatar(avatarUrl: string) {
        if (userInfo.value) {
            userInfo.value.avatar = avatarUrl
            setUserInfo(userInfo.value)
        }
    }

    function updateNickname(newNickname: string) {
        if (userInfo.value) {
            userInfo.value.nickname = newNickname
            setUserInfo(userInfo.value)
        }
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
        loginByPassword,
        loginByMail,
        logout,
        onTokenRefreshed,
        updateAvatar,
        updateNickname,
    }
})
