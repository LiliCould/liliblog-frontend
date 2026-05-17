<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticleList } from '@/api'
import type { Article, PageResult } from '@/types'
import ArticleCard from '@/components/article/ArticleCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingBlock from '@/components/common/LoadingBlock.vue'

/**
 * 首页视图
 * 展示文章列表分页
 */
const articles = ref<Article[]>([])
const pageResult = ref<PageResult<Article> | null>(null)
const loading = ref(false)
const currentPage = ref(1)

const loadArticles = async (page = 1) => {
  loading.value = true
  try {
    const res = await getArticleList({
      status: 1,
      current: page,
      size: 10,
    })
    if (res.code === 0) {
      articles.value = res.data.records
      pageResult.value = res.data
      currentPage.value = page
    }
  } catch (error) {
    console.error('加载文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  loadArticles(page)
}

onMounted(() => {
  loadArticles()
})
</script>

<template>
  <div>
    <!-- 加载状态 -->
    <LoadingBlock v-if="loading" />

    <!-- 文章列表 -->
    <div
      v-else-if="articles.length > 0"
      class="space-y-6"
    >
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />

      <!-- 分页器 -->
      <div
        v-if="pageResult && pageResult.totalPage > 1"
        class="pt-4"
      >
        <Pagination
          :current="pageResult.current"
          :total-page="pageResult.totalPage"
          :has-previous="pageResult.hasPrevious"
          :has-next="pageResult.hasNext"
          @change="handlePageChange"
        />
      </div>
    </div>

    <!-- 空状态 -->
    <EmptyState
      v-else
      message="暂无文章"
    />
  </div>
</template>
