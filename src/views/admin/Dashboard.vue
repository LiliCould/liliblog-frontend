<template>
    <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
                class="bg-t-surface border border-t-border p-5 transition-all duration-300 hover:border-t-primary hover:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.1)]">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm text-t-muted">文章数</span>
                    <div class="w-9 h-9 bg-[rgba(var(--color-primary-rgb),0.1)] flex items-center justify-center">
                        <FileText class="w-4.5 h-4.5 text-t-primary" />
                    </div>
                </div>
                <p class="text-2xl font-bold text-t-title">{{ stats.articleCount }}</p>
            </div>

            <div
                class="bg-t-surface border border-t-border p-5 transition-all duration-300 hover:border-t-primary hover:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.1)]">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm text-t-muted">分类数</span>
                    <div class="w-9 h-9 bg-[rgba(163,230,53,0.1)] flex items-center justify-center">
                        <FolderOpen class="w-4.5 h-4.5 text-[#a3e635]" />
                    </div>
                </div>
                <p class="text-2xl font-bold text-t-title">{{ stats.categoryCount }}</p>
            </div>

            <div
                class="bg-t-surface border border-t-border p-5 transition-all duration-300 hover:border-t-primary hover:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.1)]">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm text-t-muted">标签数</span>
                    <div class="w-9 h-9 bg-[rgba(var(--color-secondary-rgb),0.1)] flex items-center justify-center">
                        <Tag class="w-4.5 h-4.5 text-t-secondary" />
                    </div>
                </div>
                <p class="text-2xl font-bold text-t-title">{{ stats.tagCount }}</p>
            </div>

            <div
                class="bg-t-surface border border-t-border p-5 transition-all duration-300 hover:border-t-primary hover:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.1)]">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm text-t-muted">评论数</span>
                    <div class="w-9 h-9 bg-[rgba(185,103,255,0.1)] flex items-center justify-center">
                        <MessageSquare class="w-4.5 h-4.5 text-[#b967ff]" />
                    </div>
                </div>
                <p class="text-2xl font-bold text-t-title">{{ stats.commentCount }}</p>
            </div>
        </div>

        <div class="bg-t-surface border border-t-border p-6">
            <h2 class="text-lg font-semibold text-t-title mb-4">最近文章</h2>

            <div v-if="loadingArticles" class="space-y-3">
                <div v-for="i in 5" :key="i" class="h-12 bg-t-elevated animate-pulse"></div>
            </div>

            <div v-else-if="recentArticles.length > 0" class="space-y-2">
                <div v-for="article in recentArticles" :key="article.id"
                    class="flex items-center justify-between px-4 py-3 bg-t-bg border border-[rgba(var(--color-primary-rgb),0.08)] transition-all duration-300 hover:border-[rgba(var(--color-primary-rgb),0.3)]">
                    <div class="flex items-center gap-3 min-w-0 flex-1">
                        <span class="px-2 py-0.5 rounded text-[11px] font-medium max-md:text-[10px]" :class="article.status === 1
                            ? 'bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary border border-[rgba(var(--color-primary-rgb),0.3)]'
                            : article.status === 0
                                ? 'bg-[rgba(255,170,0,0.1)] text-[#ffaa00] border border-[rgba(255,170,0,0.3)]'
                                : 'bg-[rgba(107,114,128,0.1)] text-t-muted border border-[rgba(107,114,128,0.3)]'">
                            {{ statusText(article.status) }}
                        </span>
                        <span class="text-sm text-t-body truncate max-md:text-xs">{{ article.title }}</span>
                    </div>
                    <span class="text-xs text-t-muted ml-4 flex-shrink-0 max-md:text-[10px]">{{ formatRelativeTime(article.createTime)
                        }}</span>
                </div>
            </div>

            <div v-else class="text-center py-8 text-t-muted text-sm">暂无文章</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { FileText, FolderOpen, Tag, MessageSquare } from 'lucide-vue-next'
import { getAdminArticles } from '@/api/admin/article'
import { getAdminCategories } from '@/api/admin/category'
import { getAdminTags } from '@/api/admin/tag'
import { getAdminComments } from '@/api/admin/comment'
import type { AdminArticle } from '@/types/admin'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import { formatRelativeTime } from '@/utils/format'


const stats = reactive({
    articleCount: 0,
    categoryCount: 0,
    tagCount: 0,
    commentCount: 0,
})

const recentArticles = ref<AdminArticle[]>([])
const loadingArticles = ref(false)

function statusText(status: number) {
    const map: Record<number, string> = { 0: '审核中', 1: '已发布', 2: '草稿' }
    return map[status] || '未知'
}

async function fetchStats() {
    loadingArticles.value = true
    try {
        const [articleRes, categoryRes, tagRes, commentRes] = await Promise.all([
            getAdminArticles({ current: 1, size: 10 }) as unknown as ApiResponse<PageResult<AdminArticle>>,
            getAdminCategories({ current: 1, size: 1 }) as unknown as ApiResponse<PageResult<any>>,
            getAdminTags({ current: 1, size: 1 }) as unknown as ApiResponse<PageResult<any>>,
            getAdminComments({ current: 1, size: 1 }) as unknown as ApiResponse<PageResult<any>>,
        ])
        stats.articleCount = articleRes.data?.total || 0
        stats.categoryCount = categoryRes.data?.total || 0
        stats.tagCount = tagRes.data?.total || 0
        stats.commentCount = commentRes.data?.total || 0
        recentArticles.value = articleRes.data?.records || []
    } finally {
        loadingArticles.value = false
    }
}

onMounted(fetchStats)
</script>
