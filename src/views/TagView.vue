<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getTagBySlug, getArticleList } from '@/api'
import type { Article, Tag } from '@/types'
import ArticleList from '@/components/article/ArticleList.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const route = useRoute()

const tag = ref<Tag | null>(null)
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
    const [tagRes, articlesRes] = await Promise.all([
      getTagBySlug(slug),
      getArticleList({ current: currentPage.value, size: 10, tagSlug: slug }),
    ])
    tag.value = tagRes.data
    articles.value = articlesRes.data.records
    totalPages.value = articlesRes.data.totalPage
  } catch (err) {
    console.error('获取标签数据失败', err)
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
    <ErrorState v-else-if="error" title="加载失败" description="无法获取标签内容" />
    <div v-else>
      <div class="mb-8">
        <span class="pill-badge bg-primary/10 text-primary text-base px-4 py-2">
          {{ tag?.name || '标签' }}
        </span>
        <p class="text-sm text-text-meta mt-3">
          共 {{ tag?.articleCount || 0 }} 篇文章
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
