<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getArticleById, likeArticle, unlikeArticle } from '@/api'
import type { ArticleDetail } from '@/types'
import { formatDate } from '@/utils/format'
import { Eye, Heart, Clock, Edit } from 'lucide-vue-next'
import CommentSection from '@/components/comment/CommentSection.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const article = ref<ArticleDetail | null>(null)
const loading = ref(false)
const error = ref(false)
const liked = ref(false)

const fetchArticle = async () => {
  loading.value = true
  error.value = false
  try {
    const res = await getArticleById(Number(route.params.id))
    article.value = res.data
    liked.value = res.data.liked || false
  } catch (err) {
    console.error('获取文章详情失败', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const handleLike = async () => {
  if (!article.value) return
  try {
    if (liked.value) {
      await unlikeArticle(article.value.id)
      article.value.likeCount--
    } else {
      await likeArticle(article.value.id)
      article.value.likeCount++
    }
    liked.value = !liked.value
  } catch (err) {
    console.error('点赞操作失败', err)
  }
}

onMounted(() => {
  fetchArticle()
})
</script>

<template>
  <div>
    <LoadingBlock v-if="loading" />
    <ErrorState v-else-if="error" title="加载失败" description="无法获取文章内容" />
    <article v-else-if="article" class="bg-bg-surface rounded-2xl overflow-hidden card-shadow">
      <!-- 封面图 -->
      <div v-if="article.coverImage" class="aspect-video overflow-hidden">
        <img
          :src="article.coverImage"
          :alt="article.title"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="p-6 md:p-10">
        <!-- 标题 -->
        <h1 class="text-2xl md:text-3xl font-black text-text-title mb-4 leading-tight">
          {{ article.title }}
        </h1>

        <!-- 元数据 -->
        <div class="flex flex-wrap items-center gap-4 text-sm text-text-meta mb-6 pb-6 border-b border-border">
          <span class="flex items-center gap-1">
            <Clock class="w-4 h-4" />
            {{ formatDate(article.createTime) }}
          </span>
          <span class="flex items-center gap-1">
            <Eye class="w-4 h-4" />
            {{ article.viewCount }} 阅读
          </span>
          <button
            class="flex items-center gap-1 transition-none"
            :class="liked ? 'text-accent-rose' : 'text-text-meta hover:text-accent-rose'"
            @click="handleLike"
          >
            <Heart class="w-4 h-4" :fill="liked ? 'currentColor' : 'none'" />
            {{ article.likeCount }} 点赞
          </button>
          <button
            v-if="authStore.isAdmin"
            class="flex items-center gap-1 text-text-meta hover:text-primary ml-auto"
            @click="router.push(`/write/${article.id}`)"
          >
            <Edit class="w-4 h-4" />
            编辑
          </button>
        </div>

        <!-- 文章内容 -->
        <div class="prose prose-slate dark:prose-invert max-w-none" v-html="article.contentHtml" />

        <!-- 分类和标签 -->
        <div class="flex items-center gap-2 mt-8 pt-6 border-t border-border flex-wrap">
          <span
            v-if="article.category"
            class="pill-badge bg-primary/10 text-primary"
          >
            {{ article.category.name }}
          </span>
          <span
            v-for="tag in article.tags"
            :key="tag.id"
            class="pill-badge bg-bg-canvas text-text-meta"
          >
            {{ tag.name }}
          </span>
        </div>
      </div>
    </article>

    <!-- 评论区 -->
    <CommentSection v-if="article" :article-id="article.id" />
  </div>
</template>
