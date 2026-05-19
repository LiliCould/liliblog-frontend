<template>
  <AppLayout :show-hero="true">
    <template #hero>
      <HeroCarousel />
    </template>

    <div v-if="articleStore.loading && articleStore.publicList.length === 0" class="flex flex-col gap-4">
      <div v-for="i in 3" :key="i" class="h-40 rounded-xl bg-t-surface border border-t-border animate-pulse"></div>
    </div>

    <ArticleList v-else-if="articleStore.publicList.length > 0" :articles="articleStore.publicList"
      :total="articleStore.total" :current="currentPage" :page-size="pageSize" @page-change="handlePageChange" />

    <EmptyState v-else message="暂无文章" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useArticleStore } from '@/stores/article'
import AppLayout from '@/components/layout/AppLayout.vue'
import HeroCarousel from '@/components/common/HeroCarousel.vue'
import ArticleList from '@/components/article/ArticleList.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const articleStore = useArticleStore()
const currentPage = ref(1)
const pageSize = 10

onMounted(() => {
  articleStore.fetchPublicArticles({ status: 1, current: currentPage.value, size: pageSize })
})

function handlePageChange(page: number) {
  currentPage.value = page
  articleStore.fetchPublicArticles({ status: 1, current: page, size: pageSize })
}
</script>
