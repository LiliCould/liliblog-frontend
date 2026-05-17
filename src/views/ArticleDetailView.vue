<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleById, getLikeStatus, likeArticle, unlikeArticle } from '@/api'
import { useAuthStore } from '@/stores/auth'
import type { ArticleDetail } from '@/types'
import { Heart, Calendar, User } from 'lucide-vue-next'
import LoadingBlock from '@/components/common/LoadingBlock.vue'

/**
 * 文章详情页面
 * 展示文章内容、点赞、评论
 */
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const article = ref<ArticleDetail | null>(null)
const loading = ref(false)
const likeStatus = ref(false)
const likeLoading = ref(false)

const articleId = computed(() => {
  const id = route.params.id as string
  return parseInt(id) || 0
})

const loadArticle = async () => {
  if (!articleId.value) {
    router.push('/')
    return
  }

  loading.value = true
  try {
    const res = await getArticleById(articleId.value)
    if (res.code === 0) {
      article.value = res.data
    }
  } catch (error) {
    console.error('加载文章详情失败:', error)
  } finally {
    loading.value = false
  }
}

const loadLikeStatus = async () => {
  if (!authStore.isLoggedIn || !articleId.value) return
  try {
    const res = await getLikeStatus(articleId.value)
    if (res.code === 0) {
      likeStatus.value = res.data
    }
  } catch (error) {
    console.error('加载点赞状态失败:', error)
  }
}

const handleLike = async () => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  if (likeLoading.value || !articleId.value) return

  likeLoading.value = true
  try {
    if (likeStatus.value) {
      await unlikeArticle(articleId.value)
      likeStatus.value = false
      if (article.value) article.value.likeCount--
    } else {
      await likeArticle(articleId.value)
      likeStatus.value = true
      if (article.value) article.value.likeCount++
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
  } finally {
    likeLoading.value = false
  }
}

onMounted(() => {
  loadArticle()
  loadLikeStatus()
})
</script>

<template>
  <div>
    <LoadingBlock v-if="loading" />

    <article v-else-if="article">
      <!-- 文章标题 -->
      <h1 class="text-3xl font-black tracking-tight md:text-4xl">
        {{ article.title }}
      </h1>

      <!-- 元信息 -->
      <div
        class="mt-4 flex flex-wrap items-center gap-4 font-mono text-sm text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
        <span class="flex items-center gap-1">
          <Calendar class="h-4 w-4" />
          {{ article.createTime?.split('T')[0] }}
        </span>
        <span class="flex items-center gap-1">
          <User class="h-4 w-4" />
          {{ article.creator?.nickname }}
        </span>
        <router-link v-if="article.category" :to="`/category/${article.category.slug}`"
          class="border px-2 py-0.5 text-xs">
          {{ article.category.name }}
        </router-link>
        <div class="flex gap-1">
          <span v-for="tag in article.tags" :key="tag.id" class="border px-1.5 py-0.5 text-xs"
            :style="{ borderColor: tag.color, color: tag.color }">
            {{ tag.name }}
          </span>
        </div>
      </div>

      <!-- 封面图 -->
      <img v-if="article.coverImage" :src="article.coverImage" :alt="article.title"
        class="mt-6 w-full border-2 border-black dark:border-[var(--neutral-800)]" />

      <!-- 文章内容 -->
      <div class="prose prose-lg max-w-none pt-6 dark:prose-invert" v-html="article.contentHtml" />

      <!-- 点赞区 -->
      <div class="mt-8 flex items-center justify-center border-t-2 border-black pt-6 dark:border-[var(--neutral-800)]">
        <button class="flex items-center gap-2 border-2 border-black px-6 py-3 text-sm font-bold dark:border-white"
          :class="{
            'bg-[var(--accent-toxic)] text-black': likeStatus,
          }" :disabled="likeLoading" @click="handleLike">
          <Heart class="h-5 w-5" :fill="likeStatus ? 'currentColor' : 'none'" />
          {{ likeStatus ? '已点赞' : '点赞' }}
          <span class="font-mono">({{ article.likeCount }})</span>
        </button>
      </div>

      <!-- 评论区 -->
      <div class="mt-8 border-t-2 border-black pt-6 dark:border-[var(--neutral-800)]">
        <h2 class="text-xl font-bold">
          评论
          <span class="font-mono text-sm">({{ article.commentCount }})</span>
        </h2>
        <!-- 评论列表组件将在后续实现 -->
        <p class="mt-4 text-sm text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
          评论功能开发中...
        </p>
      </div>
    </article>

    <!-- 文章不存在 -->
    <div v-else class="py-16 text-center">
      <p class="text-lg font-bold">文章不存在或已被删除</p>
      <router-link to="/" class="mt-4 inline-block text-sm">
        [返回首页]
      </router-link>
    </div>
  </div>
</template>
