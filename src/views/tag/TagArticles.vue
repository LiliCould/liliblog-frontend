<template>
  <AppLayout>
    <div class="min-h-screen">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.3)] flex items-center justify-center">
            <Tag class="w-5 h-5 text-[#00f0ff]" />
          </div>
          <h1 class="text-2xl font-bold text-white">{{ tagName }}</h1>
        </div>
      </div>

      <div v-if="loading" class="flex flex-col gap-6">
        <div v-for="i in 3" :key="i" class="h-40 rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] animate-pulse"></div>
      </div>

      <ArticleList
        v-else-if="filteredArticles.length > 0"
        :articles="paginatedArticles"
        :total="filteredArticles.length"
        :current="current"
        :page-size="pageSize"
        @page-change="handlePageChange"
      />

      <EmptyState v-else message="该标签暂无文章" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Tag } from 'lucide-vue-next'
import { getArticles } from '@/api/article'
import type { Article } from '@/types/article'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import AppLayout from '@/components/layout/AppLayout.vue'
import ArticleList from '@/components/article/ArticleList.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const route = useRoute()

const allArticles = ref<Article[]>([])
const current = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const tagName = computed(() => route.params.slug as string)

const filteredArticles = computed(() => {
  return allArticles.value.filter(a =>
    a.tags?.some(t => t.name === tagName.value)
  )
})

const paginatedArticles = computed(() => {
  const start = (current.value - 1) * pageSize.value
  return filteredArticles.value.slice(start, start + pageSize.value)
})

async function fetchArticles() {
  loading.value = true
  try {
    const res = await getArticles({ status: 1 }) as unknown as ApiResponse<PageResult<Article>>
    allArticles.value = res.data?.records || []
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  current.value = page
}

watch(() => route.params.slug, () => {
  current.value = 1
})

onMounted(fetchArticles)
</script>
