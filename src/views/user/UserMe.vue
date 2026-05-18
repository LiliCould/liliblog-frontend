<template>
  <AppLayout>
    <div class="min-h-screen">
      <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-6 mb-8">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-[rgba(0,240,255,0.1)] border-2 border-[#00f0ff] flex items-center justify-center overflow-hidden">
            <img :src="resolveAvatar(userStore.avatar)" alt="" class="w-full h-full object-cover" @error="handleAvatarError" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">{{ userStore.nickname }}</h1>
            <p class="text-sm text-[#6b7280]">@{{ userStore.username }}</p>
          </div>
        </div>
      </div>

      <div class="flex gap-2 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer"
          :class="activeTab === tab.value
            ? 'bg-[rgba(0,240,255,0.15)] border border-[#00f0ff] text-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.15)]'
            : 'border border-[rgba(0,240,255,0.15)] text-[#6b7280] hover:text-[#00f0ff] hover:border-[#00f0ff]'"
          @click="switchTab(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="loading" class="flex flex-col gap-6">
        <div v-for="i in 3" :key="i" class="h-40 rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] animate-pulse"></div>
      </div>

      <ArticleList
        v-else-if="articles.length > 0"
        :articles="articles"
        :total="total"
        :current="current"
        :page-size="pageSize"
        @page-change="handlePageChange"
      />

      <EmptyState v-else message="暂无文章" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { resolveAvatar, handleAvatarError } from '@/utils/format'
import { getArticles } from '@/api/article'
import type { Article } from '@/types/article'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import AppLayout from '@/components/layout/AppLayout.vue'
import ArticleList from '@/components/article/ArticleList.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const userStore = useUserStore()

const articles = ref<Article[]>([])
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const activeTab = ref<number | undefined>(undefined)

const tabs = [
  { label: '全部', value: undefined as number | undefined },
  { label: '审核中', value: 0 },
  { label: '已发布', value: 1 },
  { label: '草稿', value: 2 },
]

async function fetchArticles() {
  loading.value = true
  try {
    const params: Record<string, any> = {
      createBy: userStore.userId,
      current: current.value,
      size: pageSize.value,
    }
    if (activeTab.value !== undefined) {
      params.status = activeTab.value
    }
    const res = await getArticles(params) as unknown as ApiResponse<PageResult<Article>>
    articles.value = res.data?.records || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

function switchTab(status: number | undefined) {
  activeTab.value = status
  current.value = 1
  fetchArticles()
}

function handlePageChange(page: number) {
  current.value = page
  fetchArticles()
}

watch(() => userStore.isLoggedIn, (val) => {
  if (val) fetchArticles()
})

onMounted(() => {
  if (userStore.isLoggedIn) fetchArticles()
})
</script>
