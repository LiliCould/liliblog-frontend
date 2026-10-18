<template>
  <AppLayout :show-hero="false">
    <div class="max-w-[900px] mx-auto">
      <div class="mb-6">
        <h1 class="text-xl font-bold text-t-title mb-2">搜索结果</h1>
        <p v-if="keyword" class="text-sm text-t-muted">
          关键词：<span class="text-t-primary font-medium">"{{ keyword }}"</span>
          <span v-if="total > 0" class="ml-2">共 {{ total }} 篇文章</span>
        </p>
      </div>

      <div class="md:hidden mb-6 flex gap-2">
        <input
          v-model="inputValue"
          type="text"
          placeholder="搜索文章..."
          class="flex-1 h-10 px-4 rounded-lg bg-[rgba(var(--color-surface-rgb),0.6)] border border-[rgba(var(--color-primary-rgb),0.12)] text-t-body placeholder-[#6b7280] text-sm outline-none focus:border-[rgba(var(--color-primary-rgb),0.4)]"
          @keyup.enter="doSearch"
        />
        <button class="h-10 px-4 rounded-lg text-sm font-medium text-white bg-t-primary transition-all duration-200 hover:-translate-y-px cursor-pointer" @click="doSearch">
          搜索
        </button>
      </div>

      <div v-if="pending" class="flex flex-col gap-4">
        <div v-for="i in 3" :key="i" class="h-28 rounded-xl bg-t-surface animate-pulse" />
      </div>

      <div v-else-if="articles.length > 0" class="flex flex-col gap-6">
        <ArticleCard v-for="article in articles" :key="article.id" :article="article" />

        <Pagination
          v-if="total > 0"
          :current="current"
          :total="total"
          :page-size="pageSize"
          @update:current="onPageChange"
          @update:page-size="onPageSizeChange"
        />
      </div>

      <div v-else-if="keyword" class="text-center py-16">
        <Search class="w-16 h-16 text-t-muted mx-auto mb-4 opacity-30" />
        <p class="text-t-muted text-lg mb-2">未找到相关文章</p>
        <p class="text-t-muted text-sm">试试其他关键词吧</p>
      </div>

      <div v-else class="text-center py-16">
        <Search class="w-16 h-16 text-t-muted mx-auto mb-4 opacity-30" />
        <p class="text-t-muted text-lg mb-2">输入关键词开始搜索</p>
        <p class="text-t-muted text-sm max-md:hidden">在顶部搜索框输入关键词后按回车</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Search } from 'lucide-vue-next'
import type { Article, PageResult } from '~/types'

const route = useRoute()
const router = useRouter()
const api = useApi()

const keyword = computed(() => String(route.query.q || '').trim())
const inputValue = ref(keyword.value)
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

const { data: resultPage, pending, refresh } = await useAsyncData(
  'search-articles',
  () => keyword.value
    ? api.get<PageResult<Article>>('/api/article/search', {
        keyword: keyword.value,
        current: current.value,
        size: pageSize.value,
      })
    : Promise.resolve(emptyPage),
  {
    watch: [keyword, current, pageSize],
    default: () => emptyPage,
  },
)

const articles = computed(() => resultPage.value?.records || [])
const total = computed(() => resultPage.value?.total || 0)

watch(keyword, (value) => {
  inputValue.value = value
  current.value = 1
})

function doSearch(): void {
  const value = inputValue.value.trim()
  current.value = 1
  const targetQuery = value ? { q: value } : {}
  if (String(route.query.q || '').trim() === value) {
    refresh()
    return
  }
  router.push({ path: '/search', query: targetQuery })
}

function onPageChange(page: number): void {
  current.value = page
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onPageSizeChange(size: number): void {
  pageSize.value = size
  current.value = 1
}

useSeoMeta({
  title: '搜索文章 | 立里博客',
  description: '搜索立里博客的文章。',
  robots: 'noindex',
})
</script>
