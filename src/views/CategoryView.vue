<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCategoryBySlug, getArticleList } from '@/api'
import type { Article, Category } from '@/types'
import ArticleList from '@/components/article/ArticleList.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const route = useRoute()

const category = ref<Category | null>(null)
const articles = ref<Article[]>([])
const loading = ref(false)
const error = ref(false)
const currentPage = ref(1)
const totalPages = ref(0)

const fetchData = async () => {
  loading.value = true
  error.value = false
  try {
    const slug = route.params.slug as string
    const [categoryRes, articlesRes] = await Promise.all([
      getCategoryBySlug(slug),
      getArticleList({ current: currentPage.value, size: 10, categorySlug: slug }),
    ])
    category.value = categoryRes.data
    articles.value = articlesRes.data.records
    totalPages.value = articlesRes.data.totalPage
  } catch (err) {
    console.error('获取分类数据失败', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div>
    <LoadingBlock v-if="loading" />
    <ErrorState v-else-if="error" title="加载失败" description="无法获取分类内容" />
    <div v-else>
      <!-- 分类标题 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-text-title mb-2">
          {{ category?.name || '分类' }}
        </h1>
        <p class="text-sm text-text-meta">
          共 {{ category?.articleCount || 0 }} 篇文章
        </p>
      </div>

      <ArticleList
        :articles="articles"
        :loading="false"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="currentPage = $event; fetchData()"
      />
    </div>
  </div>
</template>
