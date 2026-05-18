<template>
  <AppLayout :show-hero="false">
    <div v-if="loading" class="flex flex-col gap-4">
      <div class="h-10 w-3/5 rounded bg-[#111118] animate-pulse"></div>
      <div class="h-6 w-2/5 rounded bg-[#111118] animate-pulse"></div>
      <div class="h-80 rounded-xl bg-[#111118] animate-pulse"></div>
    </div>

    <div v-else-if="article">
      <article
        class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
        <header class="mb-8">
          <h1 class="text-2xl md:text-3xl font-bold text-white leading-snug mb-4"
            style="text-shadow:0 0 20px rgba(0,240,255,0.15)">
            {{ article.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-4 text-sm text-[#6b7280]">
            <span class="flex items-center gap-1.5">
              <Clock class="w-4 h-4 text-[#00f0ff]" />
              {{ formatDateTime(article.updateTime || article.createTime) }}
            </span>
            <span class="flex items-center gap-1.5">
              <Eye class="w-4 h-4 text-[#00f0ff]" />
              {{ article.viewCount }}
            </span>
            <span class="flex items-center gap-1.5">
              <FolderOpen class="w-4 h-4 text-[#00f0ff]" />
              {{ article.category?.name || '未分类' }}
            </span>
          </div>

          <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mt-3">
            <span v-for="tag in article.tags" :key="tag.id"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 hover:-translate-y-px"
              :style="{
                color: tag.color || '#00f0ff',
                backgroundColor: (tag.color || '#00f0ff') + '15',
                borderColor: (tag.color || '#00f0ff') + '40',
                boxShadow: `0 0 6px ${(tag.color || '#00f0ff')}20`
              }">
              <span class="w-1.5 h-1.5 rounded-full opacity-70"
                :style="{ backgroundColor: tag.color || '#00f0ff', boxShadow: `0 0 4px ${tag.color || '#00f0ff'}` }"></span>
              {{ tag.name }}
            </span>
          </div>
        </header>

        <div v-if="article.coverImage" class="mb-8 rounded-lg overflow-hidden border border-[rgba(0,240,255,0.1)]">
          <img :src="article.coverImage" :alt="article.title" class="w-full max-h-[400px] object-cover" />
        </div>

        <MarkdownViewer :content-html="article.contentHtml || ''" />

        <div class="flex items-center gap-4 mt-10 pt-6 border-t border-[rgba(0,240,255,0.15)]">
          <button class="flex items-center gap-1.5 text-sm transition-all duration-300" :class="isLiked
            ? 'text-[#ff2d78] hover:text-[#ff2d78]/80'
            : 'text-[#6b7280] hover:text-[#ff2d78]'" @click="toggleLike">
            <Heart class="w-4 h-4 transition-transform duration-200"
              :class="{ 'fill-current scale-110': isLiked, 'scale-100': !isLiked }" />
            {{ article.likeCount }}
          </button>
        </div>

        <div class="mt-10">
          <h3
            class="text-lg font-semibold text-white mb-4 pb-2 border-b-2 border-[#00f0ff] inline-block shadow-[0_2px_8px_rgba(0,240,255,0.2)]">
            评论区
          </h3>
          <CommentSection :article-id="article.id" />
        </div>
      </article>
    </div>

    <template v-if="article" #rightSidebar>
      <ArticleToc :html-content="article.contentHtml || ''" />
    </template>

    <EmptyState v-if="!loading && !article" message="文章不存在" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Heart, Eye, Clock, FolderOpen } from 'lucide-vue-next'
import { useArticleStore } from '@/stores/article'
import { getArticleLikeStatus, likeArticle, unlikeArticle } from '@/api/article'
import { formatDateTime } from '@/utils/format'
import AppLayout from '@/components/layout/AppLayout.vue'
import MarkdownViewer from '@/components/article/MarkdownViewer.vue'
import ArticleToc from '@/components/article/ArticleToc.vue'
import CommentSection from '@/components/comment/CommentSection.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { ArticleDetail } from '@/types/article'

const route = useRoute()
const articleStore = useArticleStore()
const article = ref<ArticleDetail | null>(null)
const loading = ref(true)
const isLiked = ref(false)

async function loadArticle() {
  loading.value = true
  try {
    const id = Number(route.params.id)
    article.value = (await articleStore.fetchArticleDetail(id)) || null
    if (article.value) {
      try {
        const res = await getArticleLikeStatus(id) as any
        isLiked.value = res.data === true
      } catch {
        isLiked.value = false
      }
    }
  } catch {
    article.value = null
  } finally {
    loading.value = false
  }
}

async function toggleLike() {
  if (!article.value) return
  const id = article.value.id
  try {
    if (isLiked.value) {
      await unlikeArticle(id)
      isLiked.value = false
      if (article.value) article.value.likeCount--
    } else {
      await likeArticle(id)
      isLiked.value = true
      if (article.value) article.value.likeCount++
    }
  } catch {
    // handled by interceptor
  }
}

onMounted(loadArticle)
watch(() => route.params.id, loadArticle)
</script>
