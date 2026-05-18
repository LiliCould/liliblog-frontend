<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-5 transition-all duration-300 hover:border-[#00f0ff] hover:shadow-[0_0_12px_rgba(0,240,255,0.1)]">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-[#6b7280]">文章数</span>
            <div class="w-9 h-9 rounded-lg bg-[rgba(0,240,255,0.1)] flex items-center justify-center">
              <FileText class="w-4.5 h-4.5 text-[#00f0ff]" />
            </div>
          </div>
          <p class="text-2xl font-bold text-white">{{ stats.articleCount }}</p>
        </div>

        <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-5 transition-all duration-300 hover:border-[#00f0ff] hover:shadow-[0_0_12px_rgba(0,240,255,0.1)]">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-[#6b7280]">分类数</span>
            <div class="w-9 h-9 rounded-lg bg-[rgba(163,230,53,0.1)] flex items-center justify-center">
              <FolderOpen class="w-4.5 h-4.5 text-[#a3e635]" />
            </div>
          </div>
          <p class="text-2xl font-bold text-white">{{ stats.categoryCount }}</p>
        </div>

        <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-5 transition-all duration-300 hover:border-[#00f0ff] hover:shadow-[0_0_12px_rgba(0,240,255,0.1)]">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-[#6b7280]">标签数</span>
            <div class="w-9 h-9 rounded-lg bg-[rgba(255,45,120,0.1)] flex items-center justify-center">
              <Tag class="w-4.5 h-4.5 text-[#ff2d78]" />
            </div>
          </div>
          <p class="text-2xl font-bold text-white">{{ stats.tagCount }}</p>
        </div>

        <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-5 transition-all duration-300 hover:border-[#00f0ff] hover:shadow-[0_0_12px_rgba(0,240,255,0.1)]">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-[#6b7280]">评论数</span>
            <div class="w-9 h-9 rounded-lg bg-[rgba(185,103,255,0.1)] flex items-center justify-center">
              <MessageSquare class="w-4.5 h-4.5 text-[#b967ff]" />
            </div>
          </div>
          <p class="text-2xl font-bold text-white">{{ stats.commentCount }}</p>
        </div>
      </div>

      <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-6">
        <h2 class="text-lg font-semibold text-white mb-4">最近文章</h2>

        <div v-if="loadingArticles" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-12 rounded-lg bg-[#1a1a24] animate-pulse"></div>
        </div>

        <div v-else-if="recentArticles.length > 0" class="space-y-2">
          <div
            v-for="article in recentArticles"
            :key="article.id"
            class="flex items-center justify-between px-4 py-3 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.08)] transition-all duration-300 hover:border-[rgba(0,240,255,0.3)]"
          >
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <span
                class="px-2 py-0.5 rounded text-[11px] font-medium"
                :class="article.status === 1
                  ? 'bg-[rgba(0,240,255,0.1)] text-[#00f0ff] border border-[rgba(0,240,255,0.3)]'
                  : article.status === 0
                    ? 'bg-[rgba(255,170,0,0.1)] text-[#ffaa00] border border-[rgba(255,170,0,0.3)]'
                    : 'bg-[rgba(107,114,128,0.1)] text-[#6b7280] border border-[rgba(107,114,128,0.3)]'"
              >
                {{ statusText(article.status) }}
              </span>
              <span class="text-sm text-[#e0e0e8] truncate">{{ article.title }}</span>
            </div>
            <span class="text-xs text-[#6b7280] ml-4 flex-shrink-0">{{ formatRelativeTime(article.createTime) }}</span>
          </div>
        </div>

        <div v-else class="text-center py-8 text-[#6b7280] text-sm">暂无文章</div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { FileText, FolderOpen, Tag, MessageSquare } from 'lucide-vue-next'
import { getArticles } from '@/api/article'
import { getCategories } from '@/api/category'
import { getTags } from '@/api/tag'
import type { Article } from '@/types/article'
import type { Category } from '@/types/category'
import type { Tag as TagType } from '@/types/tag'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import { formatRelativeTime } from '@/utils/format'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const stats = reactive({
  articleCount: 0,
  categoryCount: 0,
  tagCount: 0,
  commentCount: 0,
})

const recentArticles = ref<Article[]>([])
const loadingArticles = ref(false)

function statusText(status: number) {
  const map: Record<number, string> = { 0: '审核中', 1: '已发布', 2: '草稿' }
  return map[status] || '未知'
}

async function fetchStats() {
  loadingArticles.value = true
  try {
    const [articleRes, categoryRes, tagRes] = await Promise.all([
      getArticles({ current: 1, size: 10 }) as unknown as ApiResponse<PageResult<Article>>,
      getCategories({ size: 1 }) as unknown as ApiResponse<PageResult<Category>>,
      getTags({ size: 1 }) as unknown as ApiResponse<PageResult<TagType>>,
    ])
    stats.articleCount = articleRes.data?.total || 0
    stats.categoryCount = categoryRes.data?.total || 0
    stats.tagCount = tagRes.data?.total || 0
    recentArticles.value = articleRes.data?.records || []
  } finally {
    loadingArticles.value = false
  }
}

onMounted(fetchStats)
</script>
