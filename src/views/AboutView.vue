<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticleById } from '@/api'
import type { ArticleDetail } from '@/types'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const article = ref<ArticleDetail | null>(null)
const loading = ref(false)
const error = ref(false)

const fetchAbout = async () => {
  loading.value = true
  error.value = false
  try {
    const res = await getArticleById(1)
    article.value = res.data
  } catch (err) {
    console.error('获取关于页面失败', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAbout()
})
</script>

<template>
  <div>
    <LoadingBlock v-if="loading" />
    <ErrorState v-else-if="error" title="加载失败" description="无法获取关于页面内容" />
    <article v-else-if="article" class="bg-bg-surface rounded-2xl overflow-hidden card-shadow">
      <div class="p-6 md:p-10">
        <h1 class="text-2xl md:text-3xl font-black text-text-title mb-6 leading-tight">
          {{ article.title }}
        </h1>
        <div class="prose prose-slate dark:prose-invert max-w-none" v-html="article.contentHtml" />
      </div>
    </article>
  </div>
</template>
