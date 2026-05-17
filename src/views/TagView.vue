<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getTagList, getArticleList } from '@/api'
import type { Tag, Article, PageResult } from '@/types'
import ArticleCard from '@/components/article/ArticleCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingBlock from '@/components/common/LoadingBlock.vue'
import { Tag as TagIcon } from 'lucide-vue-next'

/**
 * 标签页面
 * 展示标签下的文章列表
 */
const route = useRoute()

const tag = ref<Tag | null>(null)
const articles = ref<Article[]>([])
const pageResult = ref<PageResult<Article> | null>(null)
const loading = ref(false)

const loadData = async (page = 1) => {
  loading.value = true
  try {
    const slug = route.params.slug as string

    // 加载标签信息
    if (slug && slug !== 'all') {
      const tagRes = await getTagList({ name: slug })
      if (tagRes.code === 0 && tagRes.data.records.length > 0) {
        tag.value = tagRes.data.records[0]
      }
    }

    // 加载文章列表
    // 注意：后端暂不支持按标签过滤文章，此处显示所有文章
    const params: Record<string, string | number | undefined> = { status: 1, current: page, size: 10 }

    const artRes = await getArticleList(params)
    if (artRes.code === 0) {
      articles.value = artRes.data.records
      pageResult.value = artRes.data
    }
  } catch (error) {
    console.error('加载标签数据失败:', error)
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
    <!-- 标签标题 -->
    <div class="mb-6 border-b-2 border-black pb-4 dark:border-[var(--neutral-800)]">
      <h1 class="flex items-center gap-2 text-2xl font-black">
        <TagIcon class="h-6 w-6" />
        <span
          v-if="tag"
          :style="{ color: tag.color }"
        >
          {{ tag.name }}
        </span>
        <span v-else>所有标签</span>
      </h1>
    </div>

    <LoadingBlock v-if="loading" />

    <div
      v-else-if="articles.length > 0"
      class="space-y-6"
    >
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />

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

    <EmptyState
      v-else
      message="该标签下暂无文章"
    />
  </div>
</template>
