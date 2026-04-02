import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, logout as logoutApi, getProfile as getProfileApi, changePassword as changePasswordApi } from '@/api/auth'
import { getToken, setToken, clearAuth, getUserInfo, setUserInfo } from '@/utils/storage'
import type { LoginDTO, LoginVO, UserVO, PasswordChangeDTO } from '@/types/auth.d'
import type { ApiResponse } from '@/types/api.d'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
    const token = ref<string | null>(null)
    const userInfo = ref<LoginVO | null>(null)
    const profile = ref<UserVO | null>(null)

    const isLoggedIn = computed(() => !!token.value)
    const username = computed(() => userInfo.value?.username || '')
    const avatar = computed(() => userInfo.value?.avatar || '')
    const nickname = computed(() => userInfo.value?.nickname || '')

    function init() {
        const savedToken = getToken()
        const savedUserInfo = getUserInfo<LoginVO>()
        if (savedToken) {
            token.value = savedToken
        }
        if (savedUserInfo) {
            userInfo.value = savedUserInfo
        }
    }

    async function login(data: LoginDTO) {
        const res = await loginApi(data) as unknown as ApiResponse<LoginVO>
        token.value = res.data.token
        userInfo.value = res.data
        setToken(res.data.token)
        setUserInfo(res.data)
        return res.data
    }

    async function logout() {
        try {
            await logoutApi()
        } finally {
            token.value = null
            userInfo.value = null
            profile.value = null
            clearAuth()
            router.push('/')
        }
    }

    async function fetchProfile() {
        if (!username.value) return
        const res = await getProfileApi(username.value) as unknown as ApiResponse<UserVO>
        profile.value = res.data
        return res.data
    }

    async function changePassword(data: PasswordChangeDTO) {
        if (!username.value) return
        await changePasswordApi(username.value, data)
    }

    return {
        token,
        userInfo,
        profile,
        isLoggedIn,
        username,
        avatar,
        nickname,
        init,
        login,
        logout,
        fetchProfile,
        changePassword,
    }
})
