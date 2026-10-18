<template>
  <AppLayout :show-hero="true">
    <template #hero>
      <HeroCarousel />
    </template>

    <div v-if="pending && articles.length === 0" class="flex flex-col gap-4">
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

    <EmptyState v-else message="暂无文章" />
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Article, PageResult } from '~/types'
import { absoluteUrl } from '~/utils/seo'

const api = useApi()
const current = ref(1)
const pageSize = ref(5)

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
  'home-articles',
  () => api.get<PageResult<Article>>('/api/article', {
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
  title: '立里博客 | LiliBlog - 立里可的技术与生活分享空间',
  description: '立里博客（LiliBlog）是立里可（LiliCould）的个人博客，分享技术、生活和思考。',
  ogTitle: '立里博客 | LiliBlog',
  ogDescription: '立里可的技术与生活分享空间',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: absoluteUrl('/') }],
})
</script>
