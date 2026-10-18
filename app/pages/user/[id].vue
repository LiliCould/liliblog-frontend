<template>
  <AppLayout :show-hero="false">
    <div class="max-w-4xl mx-auto">
      <div class="rounded-xl bg-t-surface border border-t-border overflow-hidden mb-8">
        <div class="h-24 md:h-32 relative">
          <img :src="heroBg" alt="" class="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-t-surface" />
        </div>
        <div class="px-4 md:px-6 pb-6 -mt-10 md:-mt-12 relative z-10">
          <div class="flex items-end gap-3 md:gap-5 max-md:flex-col max-md:items-start">
            <div class="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-t-surface border-2 border-t-primary flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(var(--color-surface-rgb),0.95)] flex-shrink-0">
              <img :src="resolveAvatar(user?.avatar)" alt="" class="w-full h-full object-cover" @error="handleAvatarError" />
            </div>
            <div class="flex-1 min-w-0 pb-1">
              <div class="flex items-center gap-3 flex-wrap">
                <h1 class="text-xl md:text-2xl font-bold text-t-title">{{ user?.nickname || '用户' }}</h1>
                <span class="text-sm text-t-muted">@{{ user?.username }}</span>
              </div>
              <div v-if="user?.email" class="flex items-center gap-1.5 mt-1.5">
                <Mail class="w-3.5 h-3.5 text-t-muted" />
                <span class="text-sm text-t-muted">{{ user.email }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <FileText class="w-5 h-5 text-t-primary" />
          <h2 class="text-lg font-semibold text-t-title">已发布文章</h2>
        </div>
      </div>

      <div v-if="pending && articles.length === 0" class="flex flex-col gap-3">
        <div v-for="i in 3" :key="i" class="h-20 rounded-xl bg-t-surface animate-pulse" />
      </div>

      <div v-else-if="articles.length > 0" class="flex flex-col gap-3">
        <div
          v-for="article in articles"
          :key="article.id"
          class="flex items-center justify-between gap-4 p-4 rounded-xl bg-t-surface border border-t-border transition-[border-color,box-shadow] duration-200 hover:border-[rgba(var(--color-primary-rgb),0.3)] hover:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.06)]"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <NuxtLink
                :to="`/article/${encodeURIComponent(article.slug)}`"
                class="text-sm font-semibold text-t-body truncate no-underline transition-[color] duration-200 hover:text-t-primary"
              >
                {{ article.title }}
              </NuxtLink>
            </div>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5 text-xs text-t-muted">
              <span class="flex items-center gap-1">
                <FolderOpen class="w-3 h-3" />
                {{ article.category?.name || '未分类' }}
              </span>
              <template v-if="article.tags?.length">
                <span
                  v-for="tag in article.tags.slice(0, 3)"
                  :key="tag.id"
                  class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0"
                  :style="{ backgroundColor: tag.color ? `${tag.color}18` : 'rgba(var(--color-primary-rgb),0.08)', color: tag.color || 'var(--color-primary)' }"
                >
                  #{{ tag.name }}
                </span>
                <span v-if="article.tags.length > 3" class="text-[10px] text-t-muted shrink-0">+{{ article.tags.length - 3 }}</span>
              </template>
              <span class="flex items-center gap-1">
                <Clock class="w-3 h-3" />
                {{ formatRelativeTime(article.updateTime || article.createTime) }}
              </span>
              <span class="flex items-center gap-1">
                <Eye class="w-3 h-3" />
                {{ article.viewCount }}
              </span>
            </div>
          </div>
        </div>

        <Pagination
          v-if="total > 0"
          :current="current"
          :total="total"
          :page-size="pageSize"
          @update:current="handlePageChange"
          @update:page-size="handlePageSizeChange"
        />
      </div>

      <EmptyState v-else message="该用户暂无文章" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Clock, Eye, FileText, FolderOpen, Mail } from 'lucide-vue-next'
import type { Article, PageResult, User } from '~/types'
import { formatRelativeTime, handleAvatarError, resolveAvatar } from '~/utils/format'
import { absoluteUrl } from '~/utils/seo'
import heroBg from '../../../src/assets/heros/hero-1.png'

const route = useRoute()
const api = useApi()
const userId = computed(() => Number(route.params.id))

const { data: user } = await useAsyncData(
  () => `public-user:${userId.value}`,
  () => api.get<User>(`/api/user/${userId.value}`).catch(() => null),
  { watch: [userId], default: () => null },
)

if (!user.value) {
  throw createError({ statusCode: 404, statusMessage: '用户不存在', fatal: true })
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
  () => `public-user-articles:${userId.value}`,
  () => api.get<PageResult<Article>>('/api/article', {
    createBy: userId.value,
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
  title: () => `${user.value?.nickname || '用户'} | 立里博客`,
  description: () => `查看 ${user.value?.nickname || '该用户'} 在立里博客发布的文章。`,
  ogTitle: () => `${user.value?.nickname || '用户'} | 立里博客`,
})

useHead(() => ({
  link: [{ rel: 'canonical', href: absoluteUrl(`/user/${userId.value}`) }],
}))
</script>
