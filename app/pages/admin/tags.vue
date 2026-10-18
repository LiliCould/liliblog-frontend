<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-t-title">标签管理</h2>
      <div class="flex items-center gap-2">
        <button v-if="selectedIds.length > 0" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-t-on-danger bg-t-danger hover:opacity-90 transition-all cursor-pointer" @click="handleBatchDelete">
          <Trash2 class="w-4 h-4" />
          批量删除 ({{ selectedIds.length }})
        </button>
        <button class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-t-on-primary bg-t-primary-fill hover:opacity-90 transition-all cursor-pointer" @click="openAddDialog">
          <Plus class="w-3.5 h-3.5" />
          添加标签
        </button>
      </div>
    </div>

    <div class="bg-t-surface border border-t-border p-4">
      <button class="md:hidden flex items-center gap-2 text-sm text-t-muted mb-2 cursor-pointer" @click="showFilter = !showFilter">
        <Filter class="w-4 h-4" />
        筛选
        <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showFilter }" />
      </button>
      <div class="flex flex-wrap items-end gap-3" :class="{ 'max-md:hidden': !showFilter }">
        <div class="flex-1 min-w-[180px] max-md:min-w-0 max-md:w-full">
          <label class="block text-xs text-t-muted mb-1">标签名称</label>
          <input v-model="filters.name" type="text" class="w-full px-3 py-1.5 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary" placeholder="搜索标签名称" />
        </div>
        <div class="flex items-center gap-2">
          <button class="px-4 py-1.5 text-sm font-semibold text-t-on-primary bg-t-primary-fill hover:opacity-90 transition-all cursor-pointer" @click="applyFilters">查询</button>
          <button class="px-4 py-1.5 text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer" @click="resetFilters">重置</button>
        </div>
      </div>
      <div v-if="hasActiveFilters" class="flex items-center gap-2 mt-3 pt-3 border-t border-t-border">
        <span class="text-xs text-t-muted">当前筛选：</span>
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
          名称: {{ filters.name }}
          <button class="hover:opacity-70 cursor-pointer" @click="filters.name = undefined">×</button>
        </span>
      </div>
    </div>

    <div class="bg-t-surface border border-t-border hidden md:block">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-t-border">
              <th class="text-left px-5 py-3.5 text-t-muted font-medium w-10">
                <input v-model="allSelected" type="checkbox" class="rounded border-t-border text-t-primary cursor-pointer" />
              </th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">ID</th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">标签名称</th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">颜色</th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">创建时间</th>
              <th class="text-right px-5 py-3.5 text-t-muted font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tag in tags" :key="tag.id" class="border-b border-[rgba(var(--color-primary-rgb),0.08)] transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.03)]">
              <td class="px-5 py-3.5">
                <input v-model="selectedIds" type="checkbox" :value="tag.id" class="rounded border-t-border text-t-primary cursor-pointer" />
              </td>
              <td class="px-5 py-3.5 text-t-muted text-xs font-mono">{{ tag.id }}</td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <TagIcon class="w-4 h-4 text-t-muted" />
                  <span class="text-t-body">{{ tag.name }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded-full border border-t-border flex-shrink-0" :style="{ backgroundColor: tag.color }" />
                  <span class="text-t-body text-xs font-mono">{{ tag.color }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5 text-t-muted">{{ formatDate(tag.createTime) }}</td>
              <td class="px-5 py-3.5">
                <div class="flex items-center justify-end gap-1">
                  <button class="p-1.5 text-t-muted transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)] cursor-pointer" title="编辑" @click="openEditDialog(tag)">
                    <Edit3 class="w-4 h-4" />
                  </button>
                  <button class="p-1.5 text-t-muted transition-all duration-200 hover:text-t-danger hover:bg-t-danger-soft cursor-pointer" title="删除" @click="handleDelete(tag)">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="tags.length === 0 && !loading" class="text-center py-12 text-t-muted text-sm">暂无标签</div>
    </div>

    <div class="md:hidden space-y-3">
      <div v-for="tag in tags" :key="tag.id" class="bg-t-surface border border-t-border p-4 space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full border border-t-border flex-shrink-0" :style="{ backgroundColor: tag.color }" />
            <span class="text-t-body font-medium">{{ tag.name }}</span>
          </div>
          <span class="text-xs text-t-muted font-mono">{{ tag.color }}</span>
        </div>
        <div class="text-xs text-t-muted">{{ formatDate(tag.createTime) }}</div>
        <div class="flex items-center justify-end gap-1 pt-1 border-t border-t-border">
          <button class="w-9 h-9 flex items-center justify-center text-t-muted transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)] cursor-pointer" title="编辑" @click="openEditDialog(tag)">
            <Edit3 class="w-4 h-4" />
          </button>
          <button class="w-9 h-9 flex items-center justify-center text-t-muted transition-all duration-200 hover:text-t-danger hover:bg-t-danger-soft cursor-pointer" title="删除" @click="handleDelete(tag)">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
      <div v-if="tags.length === 0 && !loading" class="text-center py-12 text-t-muted text-sm">暂无标签</div>
    </div>

    <div v-if="total > 0" class="flex items-center justify-between px-5 py-3 bg-t-surface border border-t-border border-t-0 -mt-px">
      <div class="flex items-center gap-2">
        <span class="text-xs text-t-muted">每页</span>
        <CustomSelect v-model="pageSize" :options="pageSizeOptions" button-class="px-2 py-1 rounded text-xs" />
      </div>
      <div class="flex items-center gap-1">
        <button class="flex items-center justify-center w-8 h-8 rounded border border-t-border text-t-muted transition-all duration-200 hover:text-t-primary hover:border-t-primary disabled:opacity-30 disabled:cursor-not-allowed" :disabled="current <= 1" @click="loadTags(current - 1)">
          <ChevronLeft class="w-4 h-4" />
        </button>
        <template v-for="page in displayPages" :key="page">
          <span v-if="page === '...'" class="w-8 h-8 flex items-center justify-center text-t-muted text-xs">...</span>
          <button v-else class="w-8 h-8 rounded text-xs font-medium transition-all duration-200" :class="page === current ? 'bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary' : 'border border-transparent text-t-muted hover:text-t-primary hover:border-t-primary'" @click="loadTags(page as number)">
            {{ page }}
          </button>
        </template>
        <button class="flex items-center justify-center w-8 h-8 rounded border border-t-border text-t-muted transition-all duration-200 hover:text-t-primary hover:border-t-primary disabled:opacity-30 disabled:cursor-not-allowed" :disabled="current >= totalPages" @click="loadTags(current + 1)">
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
      <span class="text-xs text-t-muted">共 {{ total }} 条</span>
    </div>

    <AppDialog v-model:open="showDialog" :title="isEdit ? '编辑标签' : '添加标签'">
      <div class="space-y-4">
        <div>
          <label class="block text-xs text-t-muted mb-1">标签名称 <span class="text-t-danger">*</span></label>
          <input v-model="form.name" type="text" class="w-full px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary" placeholder="请输入标签名称" />
        </div>
        <div>
          <label class="block text-xs text-t-muted mb-1">颜色 <span class="text-t-danger">*</span></label>
          <div class="flex items-center gap-3">
            <input v-model="form.color" type="color" class="w-10 h-10 border border-t-border cursor-pointer p-0.5 bg-t-bg" />
            <input v-model="form.color" type="text" class="flex-1 px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm font-mono outline-none transition-colors duration-200 focus:border-t-primary" placeholder="#000000" />
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-3 mt-6">
        <button class="px-4 py-2 text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer" @click="showDialog = false">取消</button>
        <button class="px-4 py-2 text-sm font-semibold text-t-on-primary bg-t-primary-fill hover:opacity-90 transition-all cursor-pointer" @click="handleSubmit">{{ isEdit ? '保存' : '添加' }}</button>
      </div>
    </AppDialog>

    <AppConfirmDialog
      v-model:open="showDeleteConfirm"
      title="确认删除"
      :description="deleteIsBatch ? `确定要删除选中的 ${selectedIds.length} 个标签吗？此操作不可撤销。` : '确定要删除该标签吗？此操作不可撤销。'"
      confirm-text="确认删除"
      danger
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { ChevronDown, ChevronLeft, ChevronRight, Edit3, Filter, Plus, Tag as TagIcon, Trash2 } from 'lucide-vue-next'
import {
  batchDeleteAdminTags,
  createAdminTag,
  deleteAdminTag,
  getAdminTags,
  updateAdminTag,
} from '~/api/admin/tag'
import type { AdminTag, AdminTagCreateDTO, AdminTagQuery, AdminTagUpdateDTO } from '~/types/admin'
import { formatDate } from '~/utils/format'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: '标签管理 | 立里博客', robots: 'noindex' })

const toast = useToast()

const tags = ref<AdminTag[]>([])
const loading = ref(false)
const current = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedIds = ref<number[]>([])
const showFilter = ref(false)

const pageSizeOptions = [5, 10, 15, 20, 50].map(size => ({ label: `${size} 条`, value: size }))
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

const filters = reactive<{ name?: string }>({})
const hasActiveFilters = computed(() => Boolean(filters.name))
const allSelected = computed({
  get: () => tags.value.length > 0 && selectedIds.value.length === tags.value.length,
  set: (value: boolean) => {
    selectedIds.value = value ? tags.value.map(tag => tag.id) : []
  },
})

function buildQueryParams(page: number): AdminTagQuery {
  const params: AdminTagQuery = { current: page, size: pageSize.value }
  if (filters.name) params.name = filters.name
  return params
}

function applyFilters(): void {
  loadTags(1)
}

function resetFilters(): void {
  filters.name = undefined
  loadTags(1)
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null
function debouncedApplyFilters(): void {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => loadTags(1), 500)
}

watch(() => filters.name, debouncedApplyFilters)
watch(pageSize, () => {
  current.value = 1
  loadTags(1)
})
onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})

async function loadTags(page = 1): Promise<void> {
  loading.value = true
  try {
    const response = await getAdminTags(buildQueryParams(page))
    tags.value = response.data?.records || []
    total.value = response.data?.total || 0
    current.value = response.data?.current || page
    selectedIds.value = []
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}

const showDialog = ref(false)
const isEdit = ref(false)
const editId = ref<number | null>(null)
const form = reactive({ name: '', color: '#000000' })

function openAddDialog(): void {
  isEdit.value = false
  editId.value = null
  form.name = ''
  form.color = '#000000'
  showDialog.value = true
}

function openEditDialog(tag: AdminTag): void {
  isEdit.value = true
  editId.value = tag.id
  form.name = tag.name
  form.color = tag.color
  showDialog.value = true
}

async function handleSubmit(): Promise<void> {
  if (!form.name.trim()) {
    toast.error('请输入标签名称')
    return
  }
  if (!form.color.trim()) {
    toast.error('请选择颜色')
    return
  }
  try {
    if (isEdit.value && editId.value !== null) {
      const data: AdminTagUpdateDTO = { name: form.name, color: form.color }
      await updateAdminTag(editId.value, data)
      toast.success('标签已更新')
    } else {
      const data: AdminTagCreateDTO = { name: form.name, color: form.color }
      await createAdminTag(data)
      toast.success('标签已添加')
    }
    showDialog.value = false
    loadTags(current.value)
  } catch {
    // handled by interceptor
  }
}

const showDeleteConfirm = ref(false)
const deleteTarget = ref<AdminTag | null>(null)
const deleteIsBatch = ref(false)

function handleDelete(tag: AdminTag): void {
  deleteTarget.value = tag
  deleteIsBatch.value = false
  showDeleteConfirm.value = true
}

function handleBatchDelete(): void {
  deleteIsBatch.value = true
  showDeleteConfirm.value = true
}

async function confirmDelete(): Promise<void> {
  try {
    if (deleteIsBatch.value) {
      await batchDeleteAdminTags(selectedIds.value)
      toast.success(`已删除 ${selectedIds.value.length} 个标签`)
    } else if (deleteTarget.value) {
      await deleteAdminTag(deleteTarget.value.id)
      toast.success('标签已删除')
    }
    showDeleteConfirm.value = false
    deleteTarget.value = null
    deleteIsBatch.value = false
    loadTags(current.value)
  } catch {
    // handled by interceptor
  }
}

onMounted(() => loadTags(1))
</script>
