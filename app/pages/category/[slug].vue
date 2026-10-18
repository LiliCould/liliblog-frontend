<template>
  <AppLayout :show-hero="false">
    <div class="min-h-screen">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-[rgba(var(--color-primary-rgb),0.1)] border border-[rgba(var(--color-primary-rgb),0.3)] flex items-center justify-center">
            <FolderOpen class="w-5 h-5 text-t-primary" />
          </div>
          <h1 class="text-2xl font-bold text-t-title">{{ category?.name || '分类文章' }}</h1>
        </div>
        <p v-if="category?.description" class="text-t-muted text-sm ml-[52px]">{{ category.description }}</p>
      </div>

      <div v-if="pending && articles.length === 0" class="flex flex-col gap-6">
        <div v-for="i in 3" :key="i" class="h-40 rounded-xl bg-t-surface border border-t-border animate-pulse" />
      </div>

      <ArticleList
        v-else-if="articles.length > 0"
        :articles="articles"
        :total="total"
        :current="current"
        :page-size="pageSize"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />

      <EmptyState v-else message="该分类暂无文章" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FolderOpen } from 'lucide-vue-next'
import type { Article, PageResult } from '~/types'
import { absoluteUrl } from '~/utils/seo'

const route = useRoute()
const api = useApi()
const slug = computed(() => decodeURIComponent(String(route.params.slug || '')))

const { data: categoryData } = await useCategories()
const category = computed(() => (categoryData.value || []).find(item => item.slug === slug.value))

if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: '分类不存在', fatal: true })
}

const current = ref(1)
const pageSize = ref(10)

const emptyPage: PageResult<Article> = {
  records: [],
  total: 0,
  size: 0,
  current: 1,
  totalPage: 0,
  hasPrevious: false,
  hasNext: false,
}

const { data: articlePage, pending } = await useAsyncData(
  () => `category-articles:${slug.value}`,
  () => api.get<PageResult<Article>>('/api/article', {
    categoryId: category.value!.id,
    status: 1,
    current: current.value,
    size: pageSize.value,
  }),
  {
    watch: [current, pageSize],
    default: () => emptyPage,
  },
)

const articles = computed(() => articlePage.value?.records || [])
const total = computed(() => articlePage.value?.total || 0)

function handlePageChange(page: number): void {
  current.value = page
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handlePageSizeChange(size: number): void {
  pageSize.value = size
  current.value = 1
}

useSeoMeta({
  title: () => `${category.value?.name || '分类文章'} | 立里博客`,
  description: () => category.value?.description || `浏览${category.value?.name || ''}分类下的文章。`,
  ogTitle: () => `${category.value?.name || '分类文章'} | 立里博客`,
})

useHead(() => ({
  link: [{ rel: 'canonical', href: absoluteUrl(`/category/${encodeURIComponent(slug.value)}`) }],
}))
</script>
