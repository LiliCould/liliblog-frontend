<template>
  <AppLayout>
    <div class="min-h-screen">
      <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] overflow-hidden mb-8">
        <div class="h-32 bg-gradient-to-r from-[rgba(0,240,255,0.15)] via-[#1a1a24] to-[rgba(255,45,120,0.1)]"></div>
        <div class="px-6 pb-6 -mt-10">
          <div class="flex items-end gap-4">
            <div class="w-20 h-20 rounded-full bg-[#1a1a24] border-2 border-[#00f0ff] flex items-center justify-center overflow-hidden shadow-[0_0_12px_rgba(0,240,255,0.3)]">
              <img v-if="userInfo?.avatar" :src="userInfo.avatar" alt="" class="w-full h-full object-cover" />
              <User v-else class="w-10 h-10 text-[#00f0ff]" />
            </div>
            <div class="pb-1">
              <h1 class="text-xl font-bold text-white">{{ userInfo?.nickname || '用户' }}</h1>
              <p class="text-sm text-[#6b7280]">@{{ userInfo?.username }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6 flex items-center gap-2">
        <FileText class="w-5 h-5 text-[#00f0ff]" />
        <h2 class="text-lg font-semibold text-white">已发布文章</h2>
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

      <EmptyState v-else message="该用户暂无文章" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { User, FileText } from 'lucide-vue-next'
import { getUserById } from '@/api/user'
import { getArticles } from '@/api/article'
import type { User as UserType } from '@/types/user'
import type { Article } from '@/types/article'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import AppLayout from '@/components/layout/AppLayout.vue'
import ArticleList from '@/components/article/ArticleList.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const route = useRoute()

const userInfo = ref<UserType | null>(null)
const articles = ref<Article[]>([])
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const userId = Number(route.params.id)

async function fetchUser() {
  const res = await getUserById(userId) as unknown as ApiResponse<UserType>
  userInfo.value = res.data
}

async function fetchArticles() {
  loading.value = true
  try {
    const res = await getArticles({
      createBy: userId,
      status: 1,
      current: current.value,
      size: pageSize.value,
    }) as unknown as ApiResponse<PageResult<Article>>
    articles.value = res.data?.records || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  current.value = page
  fetchArticles()
}

onMounted(() => {
  fetchUser()
  fetchArticles()
})
</script>
