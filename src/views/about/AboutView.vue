<template>
  <AppLayout :show-hero="false">
    <div class="mb-8 pb-4 border-b border-t-border relative">
      <h1 class="text-2xl font-bold text-t-title flex items-center gap-3">
        <span class="text-t-primary">✦</span>
        关于我
      </h1>
      <p class="text-sm text-t-muted mt-1">热爱技术，追求卓越</p>
      <div class="absolute bottom-0 left-0 w-28 h-0.5 bg-t-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.4)]">
      </div>
    </div>

    <div v-if="loading" class="flex flex-col gap-4">
      <div class="h-60 rounded-xl bg-t-surface animate-pulse"></div>
      <div class="h-40 rounded-xl bg-t-surface animate-pulse"></div>
    </div>

    <div v-else-if="articleData"
      class="rounded-xl bg-t-surface border border-t-border p-6 shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
      <MarkdownViewer :content-html="articleData.contentHtml || ''" />
    </div>

    <EmptyState v-else message="内容加载失败" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticleById } from '@/api/article'
import AppLayout from '@/components/layout/AppLayout.vue'
import MarkdownViewer from '@/components/article/MarkdownViewer.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { ArticleDetail } from '@/types/article'

const articleData = ref<ArticleDetail | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getArticleById(1) as any
    articleData.value = res.data || null
  } catch {
    articleData.value = null
  } finally {
    loading.value = false
  }
})
</script>
