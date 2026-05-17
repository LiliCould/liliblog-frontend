<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getMyArticles, getArticlesByUser, getUserById } from '@/api'
import type { Article, UserInfo } from '@/types'
import ArticleList from '@/components/article/ArticleList.vue'

const route = useRoute()
const authStore = useAuthStore()

const isMyHome = computed(() => route.path === '/user/me')
const userId = computed(() => isMyHome.value ? authStore.userInfo?.id : Number(route.params.id))

const articles = ref<Article[]>([])
const userInfo = ref<UserInfo | null>(null)
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(0)
const statusFilter = ref<number | null>(null)

const statusOptions = [
  { label: '全部', value: null },
  { label: '已发布', value: 1 },
  { label: '审核中', value: 0 },
  { label: '草稿', value: 2 },
]

const fetchData = async () => {
  if (!userId.value) return
  loading.value = true
  try {
    if (isMyHome.value) {
      const res = await getMyArticles({
        current: currentPage.value,
        size: 10,
        status: statusFilter.value ?? undefined,
      })
      articles.value = res.data.records
      totalPages.value = res.data.totalPage
    } else {
      const [articlesRes, userRes] = await Promise.all([
        getArticlesByUser(userId.value, { current: currentPage.value, size: 10 }),
        getUserById(userId.value),
      ])
      articles.value = articlesRes.data.records
      totalPages.value = articlesRes.data.totalPage
      userInfo.value = userRes.data
    }
  } catch (error) {
    console.error('获取数据失败', error)
  } finally {
    loading.value = false
  }
}

const setStatusFilter = (status: number | null) => {
  statusFilter.value = status
  currentPage.value = 1
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div>
    <!-- 用户信息横幅 -->
    <div class="relative mb-8 rounded-2xl overflow-hidden bg-bg-surface card-shadow">
      <div class="h-32 bg-gradient-to-r from-primary to-primary/60" />
      <div class="px-6 pb-6 -mt-12">
        <img
          :src="(isMyHome ? authStore.userInfo?.avatar : userInfo?.avatar) || '/favicon.svg'"
          :alt="(isMyHome ? authStore.userInfo?.nickname : userInfo?.nickname) || '用户'"
          class="w-24 h-24 rounded-full object-cover border-4 border-bg-canvas"
        />
        <div class="mt-3">
          <h1 class="text-xl font-bold text-text-title">
            {{ (isMyHome ? authStore.userInfo?.nickname : userInfo?.nickname) || '用户' }}
          </h1>
          <p class="text-sm text-text-meta mt-1">
            {{ (isMyHome ? authStore.userInfo?.email : userInfo?.email) || '' }}
          </p>
        </div>
      </div>
    </div>

    <!-- 状态筛选（仅我的文章） -->
    <div v-if="isMyHome" class="flex items-center gap-2 mb-6">
      <button
        v-for="option in statusOptions"
        :key="String(option.value)"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-none',
          statusFilter === option.value
            ? 'status-filter-active text-text-title'
            : 'text-text-meta hover:text-text-body',
        ]"
        @click="setStatusFilter(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- 文章列表 -->
    <ArticleList
      :articles="articles"
      :loading="loading"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="currentPage = $event; fetchData()"
    />
  </div>
</template>
