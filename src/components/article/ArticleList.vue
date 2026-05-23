<template>
  <div class="flex flex-col gap-6">
    <ArticleCard v-for="article in articles" :key="article.id" :article="article" />

    <Pagination
      v-if="total > 0"
      :current="current"
      :total="total"
      :page-size="pageSize"
      @update:current="(page: number) => emit('page-change', page)"
      @update:page-size="(size: number) => emit('page-size-change', size)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Article } from '@/types/article.d'
import ArticleCard from '@/components/common/ArticleCard.vue'
import Pagination from '@/components/ui/Pagination.vue'

defineProps<{
  articles: Article[]
  total: number
  current: number
  pageSize: number
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'page-size-change', size: number): void
}>()
</script>
