<template>
  <AppLayout :show-hero="true">
    <template #hero>
      <section class="relative flex flex-col items-center justify-center min-h-[70vh] px-4 overflow-hidden bg-[#0a0a0f]">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.06)_0%,transparent_70%)] pointer-events-none"></div>
        <div class="absolute inset-0 pointer-events-none" style="background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,240,255,0.015) 2px,rgba(0,240,255,0.015) 4px)"></div>

        <div class="relative z-10 flex flex-col items-center gap-6 text-center">
          <h1 class="text-5xl md:text-7xl font-bold text-white tracking-wider" style="text-shadow:0 0 20px rgba(0,240,255,0.4),0 0 40px rgba(0,240,255,0.15)">
            立里博客
          </h1>
          <p class="text-lg md:text-xl text-[#6b7280] tracking-wide">
            <span class="text-[#00f0ff]">&lt;</span>
            技术与生活的分享空间
            <span class="text-[#00f0ff]">/&gt;</span>
          </p>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_10px_rgba(0,240,255,0.5)]"></div>

          <SearchBar placeholder="搜索文章..." @search="handleSearch" />
        </div>

        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#6b7280]">
          <ChevronDown class="w-6 h-6" />
        </div>
      </section>
    </template>

    <div v-if="articleStore.loading && articleStore.publicList.length === 0" class="flex flex-col gap-4">
      <div v-for="i in 3" :key="i" class="h-40 rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] animate-pulse"></div>
    </div>

    <ArticleList
      v-else-if="articleStore.publicList.length > 0"
      :articles="articleStore.publicList"
      :total="articleStore.total"
      :current="currentPage"
      :page-size="pageSize"
      @page-change="handlePageChange"
    />

    <EmptyState v-else message="暂无文章" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import { useArticleStore } from '@/stores/article'
import AppLayout from '@/components/layout/AppLayout.vue'
import ArticleList from '@/components/article/ArticleList.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const articleStore = useArticleStore()
const currentPage = ref(1)
const pageSize = 10

onMounted(() => {
  articleStore.fetchPublicArticles({ status: 1, current: currentPage.value, size: pageSize })
})

function handlePageChange(page: number) {
  currentPage.value = page
  articleStore.fetchPublicArticles({ status: 1, current: page, size: pageSize })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleSearch(keyword: string) {
  router.push({ path: '/search', query: { q: keyword } })
}
</script>
