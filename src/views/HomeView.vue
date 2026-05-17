<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleList } from '@/api'
import type { Article } from '@/types'
import ArticleList from '@/components/article/ArticleList.vue'
import GlitchText from '@/components/ui/GlitchText.vue'
import TypewriterText from '@/components/ui/TypewriterText.vue'

const route = useRoute()

const articles = ref<Article[]>([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(0)

const fetchArticles = async () => {
  loading.value = true
  try {
    const search = route.query.search as string | undefined
    const res = await getArticleList({
      current: currentPage.value,
      size: 10,
      title: search,
    })
    articles.value = res.data.records
    totalPages.value = res.data.totalPage
  } catch (error) {
    console.error('获取文章列表失败', error)
  } finally {
    loading.value = false
  }
}

watch(() => route.query.search, () => {
  currentPage.value = 1
  fetchArticles()
})

onMounted(() => {
  fetchArticles()
})
</script>

<template>
  <div>
    <!-- Hero 区域 -->
    <section class="relative mb-10 rounded-2xl overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent-rose/60" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>
      <div class="relative px-6 py-16 md:py-24 text-center">
        <h1 class="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
          <GlitchText text="立里博客" />
        </h1>
        <p class="text-base md:text-lg text-white/80 font-mono">
          <TypewriterText text="探索技术、记录生活、分享思考" :speed="80" />
        </p>
      </div>
    </section>

    <!-- 搜索提示 -->
    <div v-if="route.query.search" class="mb-6">
      <p class="text-sm text-text-meta">
        搜索关键词：
        <span class="text-text-title font-medium">{{ route.query.search }}</span>
      </p>
    </div>

    <!-- 文章列表 -->
    <ArticleList
      :articles="articles"
      :loading="loading"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="currentPage = $event; fetchArticles()"
    />
  </div>
</template>
