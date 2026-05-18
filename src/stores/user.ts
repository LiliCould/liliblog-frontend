import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginByPwd, loginByEmail, logout as logoutApi } from '@/api/auth'
import { getToken, setToken, clearAuth, getUserInfo, setUserInfo } from '@/utils/storage'
import type { LoginByPwdDTO, LoginByEmailDTO, LoginVO, UserInfo } from '@/types/auth'
import type { ApiResponse } from '@/types/api'
import router from '@/router'

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

    async function loginByPassword(data: LoginByPwdDTO) {
        const res = await loginByPwd({ ...data, loginType: 'pwd' }) as unknown as ApiResponse<LoginVO>
        token.value = res.data.accessToken
        userInfo.value = res.data.userInfo
        setToken(res.data.accessToken)
        setUserInfo(res.data.userInfo)
        return res.data
    }

    async function loginByMail(data: LoginByEmailDTO) {
        const res = await loginByEmail({ ...data, loginType: 'email' }) as unknown as ApiResponse<LoginVO>
        token.value = res.data.accessToken
        userInfo.value = res.data.userInfo
        setToken(res.data.accessToken)
        setUserInfo(res.data.userInfo)
        return res.data
    }

    async function logout() {
        try {
            await logoutApi()
        } finally {
            token.value = null
            userInfo.value = null
            clearAuth()
            router.push('/')
        }
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
        updateAvatar,
        updateNickname,
    }
})
