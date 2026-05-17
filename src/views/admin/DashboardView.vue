<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticleList, getCategoryList, getTagList } from '@/api'
import { FileText, FolderOpen, Tag, Eye } from 'lucide-vue-next'

/**
 * 后台仪表盘
 * 展示数据统计概览
 */
const stats = ref({
  articleCount: 0,
  categoryCount: 0,
  tagCount: 0,
  totalViews: 0,
})

const loadStats = async () => {
  try {
    const [artRes, catRes, tagRes] = await Promise.all([
      getArticleList({ size: 1 }),
      getCategoryList({ size: 1 }),
      getTagList({ size: 1 }),
    ])

    if (artRes.code === 0) {
      stats.value.articleCount = artRes.data.total
    }
    if (catRes.code === 0) {
      stats.value.categoryCount = catRes.data.total
    }
    if (tagRes.code === 0) {
      stats.value.tagCount = tagRes.data.total
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-black">
      仪表盘
    </h1>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        class="border-2 border-black p-4 dark:border-[var(--neutral-800)]"
      >
        <div class="flex items-center gap-3">
          <FileText class="h-8 w-8" :style="{ color: 'var(--accent-toxic)' }" />
          <div>
            <div class="text-2xl font-black">{{ stats.articleCount }}</div>
            <div class="font-mono text-xs text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
              文章总数
            </div>
          </div>
        </div>
      </div>

      <div
        class="border-2 border-black p-4 dark:border-[var(--neutral-800)]"
      >
        <div class="flex items-center gap-3">
          <FolderOpen class="h-8 w-8" :style="{ color: 'var(--accent-toxic)' }" />
          <div>
            <div class="text-2xl font-black">{{ stats.categoryCount }}</div>
            <div class="font-mono text-xs text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
              分类总数
            </div>
          </div>
        </div>
      </div>

      <div
        class="border-2 border-black p-4 dark:border-[var(--neutral-800)]"
      >
        <div class="flex items-center gap-3">
          <Tag class="h-8 w-8" :style="{ color: 'var(--accent-toxic)' }" />
          <div>
            <div class="text-2xl font-black">{{ stats.tagCount }}</div>
            <div class="font-mono text-xs text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
              标签总数
            </div>
          </div>
        </div>
      </div>

      <div
        class="border-2 border-black p-4 dark:border-[var(--neutral-800)]"
      >
        <div class="flex items-center gap-3">
          <Eye class="h-8 w-8" :style="{ color: 'var(--accent-toxic)' }" />
          <div>
            <div class="text-2xl font-black">{{ stats.totalViews }}</div>
            <div class="font-mono text-xs text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
              总阅读量
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
