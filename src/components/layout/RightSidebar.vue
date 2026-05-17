<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticleList, getTagList } from '@/api'
import type { Article, Tag } from '@/types'
import { Shuffle, Tag as TagIcon } from 'lucide-vue-next'

/**
 * 右侧边栏组件
 * 显示随机文章和标签云
 */
const randomArticles = ref<Article[]>([])
const tags = ref<Tag[]>([])

const loadData = async () => {
  try {
    // 加载随机文章（取最新5篇作为简化实现）
    const artRes = await getArticleList({ status: 1, size: 5 })
    if (artRes.code === 0) {
      randomArticles.value = artRes.data.records
    }

    // 加载标签云
    const tagRes = await getTagList({ size: 20 })
    if (tagRes.code === 0) {
      tags.value = tagRes.data.records
    }
  } catch (error) {
    console.error('加载右侧边栏数据失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <aside class="space-y-6">
    <!-- 随机文章 -->
    <div
      class="border-2 border-black p-4 dark:border-[var(--neutral-800)]"
    >
      <h3 class="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
        <Shuffle class="h-4 w-4" />
        随机文章
      </h3>
      <ul class="space-y-2">
        <li
          v-for="article in randomArticles"
          :key="article.id"
        >
          <router-link
            :to="`/article/${article.id}`"
            class="line-clamp-2 text-sm"
          >
            {{ article.title }}
          </router-link>
        </li>
      </ul>
    </div>

    <!-- 标签云 -->
    <div
      class="border-2 border-black p-4 dark:border-[var(--neutral-800)]"
    >
      <h3 class="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
        <TagIcon class="h-4 w-4" />
        标签云
      </h3>
      <div class="flex flex-wrap gap-2">
        <router-link
          v-for="tag in tags"
          :key="tag.id"
          :to="`/tag/${tag.name}`"
          class="border px-2 py-1 text-xs font-mono"
          :style="{
            borderColor: tag.color,
            color: tag.color,
          }"
        >
          {{ tag.name }}
        </router-link>
      </div>
    </div>
  </aside>
</template>
