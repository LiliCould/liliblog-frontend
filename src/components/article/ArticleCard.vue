<script setup lang="ts">
import { computed } from 'vue'
import type { Article } from '@/types'
import { Eye, Heart, MessageCircle } from 'lucide-vue-next'

/**
 * 文章卡片组件
 * 用于在文章列表中展示文章摘要信息
 */
interface Props {
  /** 文章数据对象，包含标题、摘要、封面等信息 */
  article: Article
  /** 是否显示状态标识 */
  showStatus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showStatus: false,
})

// 文章状态文本映射
const statusText = computed(() => {
  const map: Record<number, string> = {
    0: '审核中',
    1: '已发布',
    2: '草稿',
  }
  return map[props.article.status] || '未知'
})

// 文章状态颜色映射
const statusColor = computed(() => {
  const map: Record<number, string> = {
    0: '#e11d48',
    1: '#a3e635',
    2: '#f59e0b',
  }
  return map[props.article.status] || '#666'
})
</script>

<template>
  <article
    class="group border-2 border-black bg-[var(--neutral-50)] dark:border-[var(--neutral-800)] dark:bg-[var(--surface)]"
  >
    <!-- 封面图 -->
    <router-link :to="`/article/${article.id}`">
      <img
        v-if="article.coverImage"
        :src="article.coverImage"
        :alt="article.title"
        class="h-48 w-full object-cover"
      />
    </router-link>

    <div class="p-4">
      <!-- 标题 -->
      <router-link :to="`/article/${article.id}`">
        <h3 class="text-lg font-bold leading-tight">
          {{ article.title }}
        </h3>
      </router-link>

      <!-- 摘要 -->
      <p
        class="mt-2 line-clamp-2 text-sm text-[var(--neutral-800)] dark:text-[var(--text-secondary)]"
      >
        {{ article.summary }}
      </p>

      <!-- 元信息 -->
      <div class="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono">
        <!-- 分类 -->
        <router-link
          v-if="article.category"
          :to="`/category/${article.category.slug}`"
          class="border px-2 py-0.5"
        >
          {{ article.category.name }}
        </router-link>

        <!-- 标签 -->
        <div class="flex gap-1">
          <span
            v-for="tag in article.tags.slice(0, 3)"
            :key="tag.id"
            class="border px-1.5 py-0.5"
            :style="{ borderColor: tag.color, color: tag.color }"
          >
            {{ tag.name }}
          </span>
        </div>

        <!-- 状态标识 -->
        <span
          v-if="showStatus"
          class="border px-2 py-0.5 font-bold"
          :style="{ borderColor: statusColor, color: statusColor }"
        >
          {{ statusText }}
        </span>
      </div>

      <!-- 底部信息 -->
      <div class="mt-3 flex items-center justify-between border-t border-[var(--neutral-200)] pt-3 text-xs font-mono dark:border-[var(--neutral-800)]">
        <div class="flex items-center gap-3">
          <span class="flex items-center gap-1">
            <Eye class="h-3 w-3" />
            {{ article.viewCount }}
          </span>
          <span class="flex items-center gap-1">
            <Heart class="h-3 w-3" />
            {{ article.likeCount }}
          </span>
          <span class="flex items-center gap-1">
            <MessageCircle class="h-3 w-3" />
            {{ article.commentCount }}
          </span>
        </div>
        <span class="text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
          {{ article.createTime?.split('T')[0] }}
        </span>
      </div>
    </div>
  </article>
</template>
