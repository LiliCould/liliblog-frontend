<template>
 <div class="space-y-6">
 <div class="flex items-center justify-between">
 <h2 class="text-lg font-semibold text-t-title">文章管理</h2>
 <div class="flex items-center gap-2">
 <button v-if="selectedIds.length > 0"
 class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#f43f5e] hover:opacity-90 transition-all cursor-pointer"
 @click="handleBatchDelete">
 <Trash2 class="w-4 h-4" />
 批量删除 ({{ selectedIds.length }})
 </button>
 </div>
 </div>

 <div class="bg-t-surface border border-t-border p-4">
 <div class="flex flex-wrap items-end gap-3">
 <div class="flex-1 min-w-[180px]">
 <label class="block text-xs text-t-muted mb-1">标题</label>
 <input v-model="filters.title" type="text"
 class="w-full px-3 py-1.5 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
 placeholder="搜索文章标题" />
 </div>
 <div class="min-w-[120px]">
 <label class="block text-xs text-t-muted mb-1">分类</label>
 <CustomSelect v-model="categoryIdModel" :options="categoryOptions" placeholder="全部分类" />
 </div>
 <div class="min-w-[120px]">
 <label class="block text-xs text-t-muted mb-1">状态</label>
 <CustomSelect v-model="statusModel" :options="articleStatusOptions" placeholder="全部状态" />
 </div>
 <div class="min-w-[150px]">
 <label class="block text-xs text-t-muted mb-1">创建时间起</label>
 <input v-model="filters.startTime" type="date"
 class="w-full px-3 py-1.5 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary" />
 </div>
 <div class="min-w-[150px]">
 <label class="block text-xs text-t-muted mb-1">创建时间止</label>
 <input v-model="filters.endTime" type="date"
 class="w-full px-3 py-1.5 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary" />
 </div>
 <div class="flex items-center gap-2">
 <button
 class="px-4 py-1.5 text-sm font-semibold text-white bg-t-primary hover:opacity-90 transition-all cursor-pointer"
 @click="applyFilters">
 查询
 </button>
 <button
 class="px-4 py-1.5 text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer"
 @click="resetFilters">
 重置
 </button>
 </div>
 </div>
 <div v-if="hasActiveFilters" class="flex items-center gap-2 mt-3 pt-3 border-t border-t-border">
 <span class="text-xs text-t-muted">当前筛选：</span>
 <span v-if="filters.title"
 class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
 标题: {{ filters.title }}
 <button class="hover:opacity-70 cursor-pointer" @click="filters.title = undefined">×</button>
 </span>
 <span v-if="filters.categoryId !== undefined"
 class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
 分类: {{ getCategoryName(filters.categoryId) }}
 <button class="hover:opacity-70 cursor-pointer" @click="filters.categoryId = undefined">×</button>
 </span>
 <span v-if="filters.status !== undefined"
 class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
 状态: {{ statusText(filters.status) }}
 <button class="hover:opacity-70 cursor-pointer" @click="filters.status = undefined">×</button>
 </span>
 <span v-if="filters.startTime"
 class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
 起: {{ filters.startTime }}
 <button class="hover:opacity-70 cursor-pointer" @click="filters.startTime = undefined">×</button>
 </span>
 <span v-if="filters.endTime"
 class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
 止: {{ filters.endTime }}
 <button class="hover:opacity-70 cursor-pointer" @click="filters.endTime = undefined">×</button>
 </span>
 </div>
 </div>

 <div class="bg-t-surface border border-t-border">
 <div class="overflow-x-auto">
 <table class="w-full text-sm">
 <thead>
 <tr class="border-b border-t-border">
 <th class="text-left px-5 py-3.5 text-t-muted font-medium w-10">
 <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll"
 class="rounded border-t-border text-t-primary cursor-pointer" />
 </th>
 <th class="text-left px-5 py-3.5 text-t-muted font-medium">ID</th>
 <th class="text-left px-5 py-3.5 text-t-muted font-medium">标题</th>
 <th class="text-left px-5 py-3.5 text-t-muted font-medium">作者</th>
 <th class="text-left px-5 py-3.5 text-t-muted font-medium">分类</th>
 <th class="text-left px-5 py-3.5 text-t-muted font-medium">状态</th>
 <th class="text-left px-5 py-3.5 text-t-muted font-medium">创建时间</th>
 <th class="text-right px-5 py-3.5 text-t-muted font-medium">操作</th>
 </tr>
 </thead>
 <tbody>
 <tr v-for="article in articles" :key="article.id"
 class="border-b border-[rgba(var(--color-primary-rgb),0.08)] transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.03)]">
 <td class="px-5 py-3.5">
 <input type="checkbox" :value="article.id" v-model="selectedIds"
 class="rounded border-t-border text-t-primary cursor-pointer" />
 </td>
 <td class="px-5 py-3.5 text-t-muted text-xs font-mono">{{ article.id }}</td>
 <td class="px-5 py-3.5">
 <span class="text-t-body font-medium line-clamp-1">{{ article.title }}</span>
 </td>
 <td class="px-5 py-3.5">
 <div>
 <p class="text-t-body text-sm">{{ article.creator?.nickname || '-' }}</p>
 <p class="text-xs text-t-muted">@{{ article.creator?.username || '-' }}</p>
 </div>
 </td>
 <td class="px-5 py-3.5 text-t-muted">{{ article.category?.name || '未分类' }}</td>
 <td class="px-5 py-3.5">
 <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium"
 :class="statusClass(article.status)">
 {{ statusText(article.status) }}
 </span>
 </td>
 <td class="px-5 py-3.5 text-t-muted">{{ formatDate(article.createTime) }}</td>
 <td class="px-5 py-3.5">
 <div class="flex items-center justify-end gap-1">
 <button v-if="article.status === 0"
 class="p-1.5 text-t-muted transition-all duration-200 hover:text-[#4ade80] hover:bg-[rgba(74,222,128,0.1)] cursor-pointer"
 title="审核通过" @click="handleApprove(article)">
 <CheckCircle class="w-4 h-4" />
 </button>
 <button v-if="article.status === 0"
 class="p-1.5 text-t-muted transition-all duration-200 hover:text-[#f43f5e] hover:bg-[rgba(244,63,94,0.1)] cursor-pointer"
 title="审核不通过" @click="openRejectDialog(article)">
 <XCircle class="w-4 h-4" />
 </button>
 <button
 class="p-1.5 text-t-muted transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.1)] cursor-pointer"
 title="预览" @click="openPreview(article)">
 <Eye class="w-4 h-4" />
 </button>
 <button
 class="p-1.5 text-t-muted transition-all duration-200 hover:text-[#f43f5e] hover:bg-[rgba(244,63,94,0.1)] cursor-pointer"
 title="删除" @click="handleDelete(article)">
 <Trash2 class="w-4 h-4" />
 </button>
 </div>
 </td>
 </tr>
 </tbody>
 </table>
 </div>

 <div v-if="articles.length === 0 && !loading" class="text-center py-12 text-t-muted text-sm">
 暂无文章
 </div>
 </div>

 <div v-if="total > 0" class="flex items-center justify-between px-5 py-3 bg-t-surface border border-t-border border-t-0 -mt-px">
 <div class="flex items-center gap-2">
 <span class="text-xs text-t-muted">每页</span>
 <CustomSelect v-model="pageSize" :options="pageSizeOptions" button-class="px-2 py-1 rounded text-xs" />
 </div>
 <div class="flex items-center gap-1">
 <button
 class="flex items-center justify-center w-8 h-8 rounded border border-t-border text-t-muted transition-all duration-200 hover:text-t-primary hover:border-t-primary disabled:opacity-30 disabled:cursor-not-allowed"
 :disabled="current <= 1" @click="loadArticles(current - 1)">
 <ChevronLeft class="w-4 h-4" />
 </button>
 <template v-for="p in displayPages" :key="p">
 <span v-if="p === '...'" class="w-8 h-8 flex items-center justify-center text-t-muted text-xs">...</span>
 <button v-else class="w-8 h-8 rounded text-xs font-medium transition-all duration-200" :class="p === current
 ? 'bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary'
 : 'border border-transparent text-t-muted hover:text-t-primary hover:border-t-primary'"
 @click="loadArticles(p as number)">
 {{ p }}
 </button>
 </template>
 <button
 class="flex items-center justify-center w-8 h-8 rounded border border-t-border text-t-muted transition-all duration-200 hover:text-t-primary hover:border-t-primary disabled:opacity-30 disabled:cursor-not-allowed"
 :disabled="current >= totalPages" @click="loadArticles(current + 1)">
 <ChevronRight class="w-4 h-4" />
 </button>
 </div>
 <span class="text-xs text-t-muted">共 {{ total }} 条</span>
 </div>

 <Teleport to="body">
 <div v-if="showPreview" class="fixed inset-0 z-[1200] flex items-center justify-center">
 <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showPreview = false"></div>
 <div
 class="relative w-full max-w-3xl mx-4 max-h-[85vh] bg-t-surface border border-t-border shadow-[0_0_24px_rgba(var(--color-primary-rgb),0.1)] flex flex-col">
 <div class="flex items-center justify-between px-6 py-4 border-b border-t-border flex-shrink-0">
 <h3 class="text-base font-semibold text-t-title">{{ previewArticle?.title }}</h3>
 <button
 class="w-7 h-7 flex items-center justify-center text-t-muted hover:text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all cursor-pointer"
 @click="showPreview = false">
 <X class="w-4 h-4" />
 </button>
 </div>
 <div class="flex items-center gap-4 px-6 py-3 border-b border-t-border text-xs text-t-muted flex-shrink-0">
 <span>作者: {{ previewArticle?.creator?.nickname || '-' }}</span>
 <span>分类: {{ previewArticle?.category?.name || '未分类' }}</span>
 <span>创建: {{ formatDate(previewArticle?.createTime || '') }}</span>
 <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium"
 :class="statusClass(previewArticle?.status ?? -1)">
 {{ statusText(previewArticle?.status ?? -1) }}
 </span>
 </div>
 <div class="flex-1 overflow-y-auto px-6 py-4">
 <div v-if="previewLoading" class="text-center py-12 text-t-muted text-sm">加载中...</div>
 <MarkdownViewer v-else :content-html="previewContentHtml" />
 </div>
 </div>
 </div>
 </Teleport>

 <Teleport to="body">
 <div v-if="showRejectDialog" class="fixed inset-0 z-[1300] flex items-center justify-center">
 <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
 <div
 class="relative w-full max-w-md mx-4 bg-t-surface border border-t-border p-6 shadow-[0_0_24px_rgba(var(--color-primary-rgb),0.1)]">
 <div class="flex items-center justify-between mb-5">
 <h3 class="text-base font-semibold text-t-title">审核不通过</h3>
 <button
 class="w-7 h-7 flex items-center justify-center text-t-muted hover:text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all cursor-pointer"
 @click="showRejectDialog = false">
 <X class="w-4 h-4" />
 </button>
 </div>
 <p class="text-sm text-t-body mb-3">文章「{{ rejectTarget?.title }}」审核不通过，请填写原因：</p>
 <textarea v-model="rejectReason"
 class="w-full px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary resize-none"
 rows="4" placeholder="请输入不通过原因..."></textarea>
 <div class="flex justify-end gap-3 mt-5">
 <button
 class="px-4 py-2 text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer"
 @click="showRejectDialog = false">
 取消
 </button>
 <button
 class="px-4 py-2 text-sm font-semibold text-white bg-[#f43f5e] hover:opacity-90 transition-all cursor-pointer"
 @click="handleReject">
 确认不通过
 </button>
 </div>
 </div>
 </div>
 </Teleport>

 <Teleport to="body">
 <div v-if="showDeleteConfirm" class="fixed inset-0 z-[1400] flex items-center justify-center">
 <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
 <div class="relative w-full max-w-sm mx-4 p-6 border border-[rgba(var(--color-primary-rgb),0.2)]"
 style="background:rgba(var(--color-surface-rgb),0.98)">
 <div class="flex items-center justify-between mb-4">
 <div class="flex items-center gap-3">
 <div class="w-10 h-10 rounded-full bg-[rgba(244,63,94,0.1)] flex items-center justify-center">
 <AlertTriangle class="w-5 h-5 text-[#f43f5e]" />
 </div>
 <h3 class="text-base font-semibold text-t-title m-0">确认删除</h3>
 </div>
 <button
 class="w-7 h-7 flex items-center justify-center text-t-muted hover:text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all cursor-pointer"
 @click="showDeleteConfirm = false">
 <X class="w-4 h-4" />
 </button>
 </div>
 <p class="text-sm text-t-body leading-relaxed mb-6">
 {{ deleteIsBatch ? `确定要删除选中的 ${selectedIds.length} 篇文章吗？` : `确定要删除文章「${deleteTarget?.title}」吗？` }}此操作不可撤销。
 </p>
 <div class="flex justify-end gap-3">
 <button
 class="px-4 py-2 text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer"
 @click="showDeleteConfirm = false">
 取消
 </button>
 <button
 class="px-4 py-2 text-sm font-semibold text-white bg-[#f43f5e] hover:opacity-90 transition-all cursor-pointer"
 @click="confirmDelete">
 确认删除
 </button>
 </div>
 </div>
 </div>
 </Teleport>
 </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, onUnmounted } from 'vue'
import { Eye, Trash2, CheckCircle, XCircle, X, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { useAppStore } from '@/stores/app'
import { getAdminArticles, getAdminArticleById, deleteAdminArticle, batchDeleteAdminArticles, reviewAdminArticle } from '@/api/admin/article'
import { formatDate } from '@/utils/format'
import MarkdownViewer from '@/components/article/MarkdownViewer.vue'
import CustomSelect from '@/components/ui/CustomSelect.vue'
import type { AdminArticle, AdminArticleQuery } from '@/types/admin'

const toast = useToast()
const appStore = useAppStore()

const articles = ref<AdminArticle[]>([])
const loading = ref(false)
const current = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedIds = ref<number[]>([])

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const displayPages = computed(() => {
 const pages: (number | string)[] = []
 const tp = totalPages.value
 const c = current.value
 if (tp <= 7) {
 for (let i = 1; i <= tp; i++) pages.push(i)
 } else {
 pages.push(1)
 if (c > 3) pages.push('...')
 const start = Math.max(2, c - 1)
 const end = Math.min(tp - 1, c + 1)
 for (let i = start; i <= end; i++) pages.push(i)
 if (c < tp - 2) pages.push('...')
 pages.push(tp)
 }
 return pages
})

const filters = reactive<{
 title?: string
 categoryId?: number
 status?: number
 startTime?: string
 endTime?: string
}>({})

const articleStatusOptions = [
 { label: '全部状态', value: '' },
 { label: '审核中', value: 0 },
 { label: '已发布', value: 1 },
 { label: '草稿', value: 2 },
]

const pageSizeOptions = [
 { label: '5 条', value: 5 },
 { label: '10 条', value: 10 },
 { label: '15 条', value: 15 },
 { label: '20 条', value: 20 },
 { label: '50 条', value: 50 },
]

const categoryOptions = computed(() => [
 { label: '全部分类', value: '' },
 ...appStore.categories.map(cat => ({ label: cat.name, value: cat.id })),
])

const categoryIdModel = computed({
 get: () => filters.categoryId ?? '',
 set: (val: string | number) => { filters.categoryId = val === '' ? undefined : val as number },
})

const statusModel = computed({
 get: () => filters.status ?? '',
 set: (val: string | number) => { filters.status = val === '' ? undefined : val as number },
})

const hasActiveFilters = computed(() => {
 return !!filters.title || filters.categoryId !== undefined || filters.status !== undefined || !!filters.startTime || !!filters.endTime
})

const isAllSelected = computed(() => articles.value.length > 0 && selectedIds.value.length === articles.value.length)

function toggleSelectAll() {
 if (isAllSelected.value) {
 selectedIds.value = []
 } else {
 selectedIds.value = articles.value.map(a => a.id)
 }
}

function statusText(status: number) {
 const map: Record<number, string> = { 0: '审核中', 1: '已发布', 2: '草稿' }
 return map[status] || '未知'
}

function statusClass(status: number) {
 if (status === 1) return 'bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary border border-[rgba(var(--color-primary-rgb),0.3)]'
 if (status === 0) return 'bg-[rgba(255,170,0,0.1)] text-[#ffaa00] border border-[rgba(255,170,0,0.3)]'
 return 'bg-[rgba(107,114,128,0.1)] text-t-muted border border-[rgba(107,114,128,0.3)]'
}

function getCategoryName(id?: number) {
 if (!id) return '-'
 return appStore.categories.find(c => c.id === id)?.name || '-'
}

function buildQueryParams(page: number): AdminArticleQuery {
 const params: AdminArticleQuery = { current: page, size: pageSize.value }
 if (filters.title) params.title = filters.title
 if (filters.categoryId !== undefined) params.categoryId = filters.categoryId
 if (filters.status !== undefined) params.status = filters.status
 if (filters.startTime) params.startTime = filters.startTime + ' 00:00:00'
 if (filters.endTime) params.endTime = filters.endTime + ' 23:59:59'
 return params
}

function applyFilters() {
 loadArticles(1)
}

function resetFilters() {
 filters.title = undefined
 filters.categoryId = undefined
 filters.status = undefined
 filters.startTime = undefined
 filters.endTime = undefined
 loadArticles(1)
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function debouncedApplyFilters() {
 if (debounceTimer) clearTimeout(debounceTimer)
 debounceTimer = setTimeout(() => loadArticles(1), 500)
}

watch(
 () => [filters.title, filters.categoryId, filters.status, filters.startTime, filters.endTime],
 () => debouncedApplyFilters(),
)

watch(pageSize, () => {
 current.value = 1
 loadArticles(1)
})

onUnmounted(() => {
 if (debounceTimer) clearTimeout(debounceTimer)
})

async function loadArticles(page = 1) {
 loading.value = true
 try {
 const res = await getAdminArticles(buildQueryParams(page)) as any
 articles.value = res.data?.records || []
 total.value = res.data?.total || 0
 current.value = res.data?.current || page
 selectedIds.value = []
 } finally {
 loading.value = false
 }
}

async function handleApprove(article: AdminArticle) {
 try {
 await reviewAdminArticle(article.id, 1)
 toast.success('审核通过')
 loadArticles(current.value)
 } catch { }
}

const showRejectDialog = ref(false)
const rejectTarget = ref<AdminArticle | null>(null)
const rejectReason = ref('')

function openRejectDialog(article: AdminArticle) {
 rejectTarget.value = article
 rejectReason.value = ''
 showRejectDialog.value = true
}

async function handleReject() {
 if (!rejectTarget.value) return
 try {
 await reviewAdminArticle(rejectTarget.value.id, 2, rejectReason.value || undefined)
 toast.success('审核不通过')
 showRejectDialog.value = false
 loadArticles(current.value)
 } catch { }
}

const showPreview = ref(false)
const previewArticle = ref<AdminArticle | null>(null)
const previewContentHtml = ref('')
const previewLoading = ref(false)

async function openPreview(article: AdminArticle) {
 previewArticle.value = article
 previewContentHtml.value = ''
 previewLoading.value = true
 showPreview.value = true
 try {
 const res = await getAdminArticleById(article.id) as any
 previewContentHtml.value = res.data?.contentHtml || ''
 } catch {
 previewContentHtml.value = '<p style="color:#999">加载失败</p>'
 } finally {
 previewLoading.value = false
 }
}

const showDeleteConfirm = ref(false)
const deleteTarget = ref<AdminArticle | null>(null)
const deleteIsBatch = ref(false)

function handleDelete(article: AdminArticle) {
 deleteTarget.value = article
 deleteIsBatch.value = false
 showDeleteConfirm.value = true
}

function handleBatchDelete() {
 deleteIsBatch.value = true
 showDeleteConfirm.value = true
}

async function confirmDelete() {
 try {
 if (deleteIsBatch.value) {
 await batchDeleteAdminArticles(selectedIds.value)
 toast.success(`已删除 ${selectedIds.value.length} 篇文章`)
 } else if (deleteTarget.value) {
 await deleteAdminArticle(deleteTarget.value.id)
 toast.success('文章已删除')
 }
 showDeleteConfirm.value = false
 deleteTarget.value = null
 deleteIsBatch.value = false
 loadArticles(current.value)
 } catch { }
}

onMounted(() => {
 if (appStore.categories.length === 0) {
 appStore.fetchCategories()
 }
 loadArticles(1)
})
</script>