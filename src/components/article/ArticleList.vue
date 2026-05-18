<template>
  <div class="flex flex-col gap-6">
    <ArticleCard v-for="article in articles" :key="article.id" :article="article" />

    <Pagination
      v-if="totalPages > 1"
      :current="current"
      :total="total"
      :page-size="pageSize"
      @update:current="(page: number) => emit('page-change', page)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Article } from '@/types/article.d'
import ArticleCard from '@/components/common/ArticleCard.vue'
import Pagination from '@/components/ui/Pagination.vue'

const props = defineProps<{
  articles: Article[]
  total: number
  current: number
  pageSize: number
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))
</script>
