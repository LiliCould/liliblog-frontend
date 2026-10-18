import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { Article, PageResult, User } from '~/types'
import request from '~/utils/request'

const emptyPage: PageResult<Article> = {
  records: [],
  total: 0,
  size: 0,
  current: 1,
  totalPage: 0,
  hasPrevious: false,
  hasNext: false,
}

export function useUserProfileData(userId: Ref<number>, self: boolean) {
  const api = useApi()
  const userStore = useUserStore()

  const currentPage = ref(1)
  const pageSize = ref(10)
  const activeTab = ref('all')

  function buildSelfUser(): User | null {
    if (!userStore.isLoggedIn) return null
    return {
      id: userStore.userId,
      username: userStore.username,
      nickname: userStore.nickname,
      avatar: userStore.avatar,
      email: userStore.email,
      role: userStore.isAdmin ? 0 : 1,
      status: 1,
      lastLoginTime: '',
    }
  }

  const { data: publicUser } = useAsyncData(
    () => `user-profile:${userId.value}:${self}`,
    async () => {
      if (self) return buildSelfUser()
      const user = await api.get<User>(`/api/user/${userId.value}`).catch(() => null)
      if (!user) throw createError({ statusCode: 404, statusMessage: '用户不存在', fatal: true })
      return user
    },
    {
      watch: [userId],
      default: () => null,
    },
  )

  const user = computed<User | null>(() => self ? buildSelfUser() : (publicUser.value || null))

  const { data: articlePage, pending, refresh } = useAsyncData(
    () => `user-articles:${userId.value}:${self}`,
    async () => {
      if (import.meta.server && self) return emptyPage

      const params: Record<string, string | number> = {
        createBy: userId.value,
        current: currentPage.value,
        size: pageSize.value,
      }

      if (self && activeTab.value !== 'all') {
        params.status = Number(activeTab.value)
      } else if (!self) {
        params.status = 1
      }

      if (self) {
        const response = await request.get('/api/article', { params }) as unknown as { data: PageResult<Article> }
        return response.data
      }

      return api.get<PageResult<Article>>('/api/article', params)
    },
    {
      watch: [userId, activeTab, currentPage, pageSize],
      default: () => emptyPage,
    },
  )

  return {
    user,
    articles: computed(() => articlePage.value?.records || []),
    total: computed(() => articlePage.value?.total || 0),
    pending,
    refresh,
    currentPage,
    pageSize,
    activeTab,
  }
}
