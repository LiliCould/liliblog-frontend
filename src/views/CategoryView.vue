<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCategoryList, getArticleList } from '@/api'
import type { Category, Article, PageResult } from '@/types'
import ArticleCard from '@/components/article/ArticleCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingBlock from '@/components/common/LoadingBlock.vue'
import { FolderOpen } from 'lucide-vue-next'

/**
 * 分类页面
 * 展示分类下的文章列表
 */
const route = useRoute()

const category = ref<Category | null>(null)
const articles = ref<Article[]>([])
const pageResult = ref<PageResult<Article> | null>(null)
const loading = ref(false)

const loadData = async (page = 1) => {
  loading.value = true
  try {
    const slug = route.params.slug as string

    // 加载分类信息
    if (slug && slug !== 'all') {
      const catRes = await getCategoryList({ name: slug })
      if (catRes.code === 0 && catRes.data.records.length > 0) {
        category.value = catRes.data.records[0]
      }
    }

    // 加载文章列表
    const params: Record<string, string | number | undefined> = { status: 1, current: page, size: 10 }
    if (category.value) {
      params.categoryId = category.value.id
    }

    const artRes = await getArticleList(params)
    if (artRes.code === 0) {
      articles.value = artRes.data.records
      pageResult.value = artRes.data
    }
  } catch (error) {
    console.error('加载分类数据失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  loadData(page)
}

watch(() => route.params.slug, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <div>
    <!-- 分类标题 -->
    <div class="mb-6 border-b-2 border-black pb-4 dark:border-[var(--neutral-800)]">
      <h1 class="flex items-center gap-2 text-2xl font-black">
        <FolderOpen class="h-6 w-6" />
        {{ category?.name || '所有分类' }}
      </h1>
      <p v-if="category?.description"
        class="mt-1 font-mono text-sm text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
        {{ category.description }}
      </p>
    </div>

    <LoadingBlock v-if="loading" />

    <div v-else-if="articles.length > 0" class="space-y-6">
      <ArticleCard v-for="article in articles" :key="article.id" :article="article" />

      <div v-if="pageResult && pageResult.totalPage > 1" class="pt-4">
        <Pagination :current="pageResult.current" :total-page="pageResult.totalPage"
          :has-previous="pageResult.hasPrevious" :has-next="pageResult.hasNext" @change="handlePageChange" />
      </div>
    </div>

    <EmptyState v-else message="该分类下暂无文章" />
  </div>
</template>
