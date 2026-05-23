<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-t-title">评论管理</h2>
      <div class="flex items-center gap-2">
        <button v-if="selectedIds.length > 0"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#f43f5e] hover:opacity-90 transition-all cursor-pointer"
          @click="handleBatchDelete">
          <Trash2 class="w-4 h-4" />
          批量删除 ({{ selectedIds.length }})
        </button>
      </div>
    </div>

    <div class="rounded-xl bg-t-surface border border-t-border p-4">
      <div class="flex flex-wrap items-end gap-3">
        <div class="flex-1 min-w-[180px]">
          <label class="block text-xs text-t-muted mb-1">评论内容</label>
          <input v-model="filters.content" type="text"
            class="w-full px-3 py-1.5 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
            placeholder="搜索评论内容" />
        </div>
        <div class="min-w-[120px]">
          <label class="block text-xs text-t-muted mb-1">文章ID</label>
          <input v-model.number="filters.articleId" type="number"
            class="w-full px-3 py-1.5 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
            placeholder="文章ID" />
        </div>
        <div class="min-w-[120px]">
          <label class="block text-xs text-t-muted mb-1">状态</label>
          <select v-model="filters.status"
            class="w-full px-3 py-1.5 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary">
            <option :value="undefined">全部状态</option>
            <option :value="0">审核中</option>
            <option :value="1">已发布</option>
          </select>
        </div>
        <div class="min-w-[150px]">
          <label class="block text-xs text-t-muted mb-1">发布时间起</label>
          <input v-model="filters.startTime" type="date"
            class="w-full px-3 py-1.5 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary" />
        </div>
        <div class="min-w-[150px]">
          <label class="block text-xs text-t-muted mb-1">发布时间止</label>
          <input v-model="filters.endTime" type="date"
            class="w-full px-3 py-1.5 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary" />
        </div>
        <div class="flex items-center gap-2">
          <button
            class="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-t-primary hover:opacity-90 transition-all cursor-pointer"
            @click="applyFilters">
            查询
          </button>
          <button
            class="px-4 py-1.5 rounded-lg text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer"
            @click="resetFilters">
            重置
          </button>
        </div>
      </div>
      <div v-if="hasActiveFilters" class="flex items-center gap-2 mt-3 pt-3 border-t border-t-border">
        <span class="text-xs text-t-muted">当前筛选：</span>
        <span v-if="filters.content"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
          内容: {{ filters.content }}
          <button class="hover:opacity-70 cursor-pointer" @click="filters.content = undefined">×</button>
        </span>
        <span v-if="filters.articleId !== undefined"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
          文章ID: {{ filters.articleId }}
          <button class="hover:opacity-70 cursor-pointer" @click="filters.articleId = undefined">×</button>
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

    <div class="rounded-xl bg-t-surface border border-t-border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-t-border">
              <th class="text-left px-5 py-3.5 text-t-muted font-medium w-10">
                <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll"
                  class="rounded border-t-border text-t-primary cursor-pointer" />
              </th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">评论内容</th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">评论者</th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">文章ID</th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">状态</th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">发布时间</th>
              <th class="text-right px-5 py-3.5 text-t-muted font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comment in comments" :key="comment.id"
              class="border-b border-[rgba(var(--color-primary-rgb),0.08)] transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.03)]">
              <td class="px-5 py-3.5">
                <input type="checkbox" :value="comment.id" v-model="selectedIds"
                  class="rounded border-t-border text-t-primary cursor-pointer" />
              </td>
              <td class="px-5 py-3.5">
                <div class="max-w-[300px]">
                  <p class="text-t-body line-clamp-2">{{ comment.content }}</p>
                  <div class="flex items-center gap-3 mt-1">
                    <span v-if="comment.ipAddress" class="text-xs text-t-muted">IP: {{ comment.ipAddress }}</span>
                    <span v-if="comment.level === 1" class="text-xs text-t-muted">回复评论</span>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-t-elevated border border-t-border flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img :src="resolveAvatar(comment.creator?.avatar)" alt="" class="w-full h-full object-cover"
                      @error="handleAvatarError" />
                  </div>
                  <div>
                    <p class="text-t-body text-sm">{{ comment.creator?.nickname || '匿名' }}</p>
                    <p class="text-xs text-t-muted">@{{ comment.creator?.username || '-' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5 text-t-muted">{{ comment.articleId }}</td>
              <td class="px-5 py-3.5">
                <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium"
                  :class="statusClass(comment.status)">
                  {{ statusText(comment.status) }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-t-muted">{{ formatDate(comment.createTime) }}</td>
              <td class="px-5 py-3.5">
                <div class="flex items-center justify-end gap-1">
                  <button v-if="comment.status === 0"
                    class="p-1.5 rounded-lg text-t-muted transition-all duration-200 hover:text-[#4ade80] hover:bg-[rgba(74,222,128,0.1)] cursor-pointer"
                    title="审核通过" @click="handleApprove(comment)">
                    <CheckCircle class="w-4 h-4" />
                  </button>
                  <button v-if="comment.status === 0"
                    class="p-1.5 rounded-lg text-t-muted transition-all duration-200 hover:text-[#f43f5e] hover:bg-[rgba(244,63,94,0.1)] cursor-pointer"
                    title="审核不通过" @click="handleReject(comment)">
                    <XCircle class="w-4 h-4" />
                  </button>
                  <button
                    class="p-1.5 rounded-lg text-t-muted transition-all duration-200 hover:text-[#f43f5e] hover:bg-[rgba(244,63,94,0.1)] cursor-pointer"
                    title="删除" @click="handleDelete(comment)">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="comments.length === 0 && !loading" class="text-center py-12 text-t-muted text-sm">
        暂无评论
      </div>

      <div v-if="total > 0" class="flex items-center justify-between px-5 py-3 border-t border-t-border">
        <div class="flex items-center gap-2">
          <span class="text-xs text-t-muted">每页</span>
          <select :value="pageSize"
            class="px-2 py-1 rounded bg-t-bg border border-t-border text-t-body text-xs outline-none transition-colors duration-200 focus:border-t-primary cursor-pointer"
            @change="onPageSizeChange">
            <option v-for="s in [5, 10, 15, 20, 50]" :key="s" :value="s">{{ s }} 条</option>
          </select>
        </div>
        <div class="flex items-center gap-1">
          <button
            class="flex items-center justify-center w-8 h-8 rounded border border-t-border text-t-muted transition-all duration-200 hover:text-t-primary hover:border-t-primary disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="current <= 1" @click="loadComments(current - 1)">
            <ChevronLeft class="w-4 h-4" />
          </button>
          <template v-for="p in displayPages" :key="p">
            <span v-if="p === '...'" class="w-8 h-8 flex items-center justify-center text-t-muted text-xs">...</span>
            <button v-else class="w-8 h-8 rounded text-xs font-medium transition-all duration-200" :class="p === current
              ? 'bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary'
              : 'border border-transparent text-t-muted hover:text-t-primary hover:border-t-primary'"
              @click="loadComments(p as number)">
              {{ p }}
            </button>
          </template>
          <button
            class="flex items-center justify-center w-8 h-8 rounded border border-t-border text-t-muted transition-all duration-200 hover:text-t-primary hover:border-t-primary disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="current >= totalPages" @click="loadComments(current + 1)">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        <span class="text-xs text-t-muted">共 {{ total }} 条</span>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-[1200] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-sm mx-4 rounded-xl p-6 border border-[rgba(var(--color-primary-rgb),0.2)]"
          style="background:rgba(var(--color-surface-rgb),0.98)">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[rgba(244,63,94,0.1)] flex items-center justify-center">
                <AlertTriangle class="w-5 h-5 text-[#f43f5e]" />
              </div>
              <h3 class="text-base font-semibold text-t-title m-0">确认删除</h3>
            </div>
            <button
              class="w-7 h-7 rounded-lg flex items-center justify-center text-t-muted hover:text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all cursor-pointer"
              @click="showDeleteConfirm = false">
              <X class="w-4 h-4" />
            </button>
          </div>
          <p class="text-sm text-t-body leading-relaxed mb-6">
            {{ deleteIsBatch ? `确定要删除选中的 ${selectedIds.length} 条评论吗？` : `确定要删除该评论吗？` }}此操作不可撤销。
          </p>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 rounded-lg text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer"
              @click="showDeleteConfirm = false">
              取消
            </button>
            <button
              class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#f43f5e] hover:opacity-90 transition-all cursor-pointer"
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
import { Trash2, CheckCircle, XCircle, X, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { getAdminComments, deleteAdminComment, batchDeleteAdminComments, reviewAdminComment } from '@/api/admin/comment'
import { formatDate, resolveAvatar, handleAvatarError } from '@/utils/format'
import type { AdminComment, AdminCommentQuery } from '@/types/admin'

const toast = useToast()

const comments = ref<AdminComment[]>([])
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
  content?: string
  articleId?: number
  status?: number
  startTime?: string
  endTime?: string
}>({})

const hasActiveFilters = computed(() => {
  return !!filters.content || filters.articleId !== undefined || filters.status !== undefined || !!filters.startTime || !!filters.endTime
})

const isAllSelected = computed(() => comments.value.length > 0 && selectedIds.value.length === comments.value.length)

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = comments.value.map(c => c.id)
  }
}

function statusText(status: number) {
  const map: Record<number, string> = { 0: '审核中', 1: '已发布' }
  return map[status] || '未知'
}

function statusClass(status: number) {
  if (status === 1) return 'bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary border border-[rgba(var(--color-primary-rgb),0.3)]'
  if (status === 0) return 'bg-[rgba(255,170,0,0.1)] text-[#ffaa00] border border-[rgba(255,170,0,0.3)]'
  return 'bg-[rgba(107,114,128,0.1)] text-t-muted border border-[rgba(107,114,128,0.3)]'
}

function buildQueryParams(page: number): AdminCommentQuery {
  const params: AdminCommentQuery = { current: page, size: pageSize.value }
  if (filters.content) params.content = filters.content
  if (filters.articleId !== undefined) params.articleId = filters.articleId
  if (filters.status !== undefined) params.status = filters.status
  if (filters.startTime) params.startTime = filters.startTime + ' 00:00:00'
  if (filters.endTime) params.endTime = filters.endTime + ' 23:59:59'
  return params
}

function applyFilters() {
  loadComments(1)
}

function resetFilters() {
  filters.content = undefined
  filters.articleId = undefined
  filters.status = undefined
  filters.startTime = undefined
  filters.endTime = undefined
  loadComments(1)
}

function onPageSizeChange(e: Event) {
  const val = Number((e.target as HTMLSelectElement).value)
  pageSize.value = val
  current.value = 1
  loadComments(1)
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function debouncedApplyFilters() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => loadComments(1), 1000)
}

watch(
  () => [filters.content, filters.articleId, filters.status, filters.startTime, filters.endTime],
  () => debouncedApplyFilters(),
)

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})

async function loadComments(page = 1) {
  loading.value = true
  try {
    const res = await getAdminComments(buildQueryParams(page)) as any
    comments.value = res.data?.records || []
    total.value = res.data?.total || 0
    current.value = res.data?.current || page
    selectedIds.value = []
  } finally {
    loading.value = false
  }
}

async function handleApprove(comment: AdminComment) {
  try {
    await reviewAdminComment(comment.id, 1)
    toast.success('审核通过')
    loadComments(current.value)
  } catch { }
}

async function handleReject(comment: AdminComment) {
  try {
    await reviewAdminComment(comment.id, 2)
    toast.success('审核不通过')
    loadComments(current.value)
  } catch { }
}

const showDeleteConfirm = ref(false)
const deleteTarget = ref<AdminComment | null>(null)
const deleteIsBatch = ref(false)

function handleDelete(comment: AdminComment) {
  deleteTarget.value = comment
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
      await batchDeleteAdminComments(selectedIds.value)
      toast.success(`已删除 ${selectedIds.value.length} 条评论`)
    } else if (deleteTarget.value) {
      await deleteAdminComment(deleteTarget.value.id)
      toast.success('评论已删除')
    }
    showDeleteConfirm.value = false
    deleteTarget.value = null
    deleteIsBatch.value = false
    loadComments(current.value)
  } catch { }
}

onMounted(() => {
  loadComments(1)
})
</script>
