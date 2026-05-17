<script setup lang="ts">
import type { Article } from '@/types'
import ArticleCard from './ArticleCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'

interface Props {
  articles: Article[]
  loading: boolean
  currentPage: number
  totalPages: number
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'pageChange', page: number): void
}>()
</script>

<template>
  <div>
    <LoadingBlock v-if="loading" />

    <EmptyState
      v-else-if="articles.length === 0"
      title="暂无文章"
      description="这里还没有发布任何文章"
    />

    <div v-else class="space-y-6">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />

      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @change="emit('pageChange', $event)"
      />
    </div>
  </div>
</template>
