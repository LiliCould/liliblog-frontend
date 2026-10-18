<template>
  <AppLayout :show-hero="false">
    <div class="mb-8 pb-4 border-b border-t-border relative">
      <h1 class="text-2xl font-bold text-t-title flex items-center gap-3">
        <span class="text-t-primary">✦</span>
        关于我
      </h1>
      <p class="text-sm text-t-muted mt-1">热爱技术，追求卓越</p>
      <div class="absolute bottom-0 left-0 w-16 md:w-28 h-0.5 bg-t-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.4)]" />
    </div>

    <LoadingState v-if="pending" variant="article" />

    <ErrorState
      v-else-if="error && !about"
      title="内容加载失败"
      @retry="refresh"
    />

    <div v-else-if="about" class="card-glass p-4 md:p-6">
      <MarkdownViewer :content-html="about.contentHtml || ''" />
    </div>

    <EmptyState v-else message="暂无内容" description="关于页面还没有发布内容" />
  </AppLayout>
</template>

<script setup lang="ts">
import type { ArticleDetail } from '~/types'
import { absoluteUrl } from '~/utils/seo'

const api = useApi()

const { data: about, pending, error, refresh } = await useAsyncData(
  'about-article',
  () => api.get<ArticleDetail>('/api/article/1'),
  { default: () => null },
)

useSeoMeta({
  title: '关于我 | 立里博客',
  description: '立里可（LiliCould），热爱技术，追求卓越。',
  ogTitle: '关于我 | 立里博客',
  ogDescription: '立里可（LiliCould），热爱技术，追求卓越。',
})

useHead({
  link: [{ rel: 'canonical', href: absoluteUrl('/about') }],
})
</script>
