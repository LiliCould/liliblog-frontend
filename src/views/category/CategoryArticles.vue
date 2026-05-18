<template>
  <AppLayout>
    <div class="min-h-screen">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.3)] flex items-center justify-center">
            <FolderOpen class="w-5 h-5 text-[#00f0ff]" />
          </div>
          <h1 class="text-2xl font-bold text-white">{{ category?.name || '分类文章' }}</h1>
        </div>
        <p v-if="category?.description" class="text-[#6b7280] text-sm ml-[52px]">{{ category.description }}</p>
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

      <EmptyState v-else message="该分类暂无文章" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { FolderOpen } from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'
import { getArticles } from '@/api/article'
import type { Article } from '@/types/article'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import AppLayout from '@/components/layout/AppLayout.vue'
import ArticleList from '@/components/article/ArticleList.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const route = useRoute()
const appStore = useAppStore()

const articles = ref<Article[]>([])
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const category = computed(() => {
  const slug = route.params.slug as string
  return appStore.categories.find(c => c.slug === slug)
})

async function fetchArticles() {
  if (!category.value) return
  loading.value = true
  try {
    const res = await getArticles({
      categoryId: category.value.id,
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

watch(() => route.params.slug, () => {
  current.value = 1
  fetchArticles()
})

onMounted(() => {
  if (appStore.categories.length === 0) {
    appStore.fetchCategories().then(() => fetchArticles())
  } else {
    fetchArticles()
  }
})
</script>
