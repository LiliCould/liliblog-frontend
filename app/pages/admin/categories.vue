<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-t-title">分类管理</h2>
      <div class="flex items-center gap-2">
        <button v-if="selectedIds.length > 0" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-t-on-danger bg-t-danger hover:opacity-90 transition-all cursor-pointer" @click="handleBatchDelete">
          <Trash2 class="w-4 h-4" />
          批量删除 ({{ selectedIds.length }})
        </button>
        <button class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-t-on-primary bg-t-primary-fill hover:opacity-90 transition-all cursor-pointer" @click="openAddDialog">
          <Plus class="w-3.5 h-3.5" />
          添加分类
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
          <label class="block text-xs text-t-muted mb-1">分类名称</label>
          <input v-model="filters.name" type="text" class="w-full px-3 py-1.5 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary" placeholder="搜索分类名称" />
        </div>
        <div class="flex-1 min-w-[180px] max-md:min-w-0 max-md:w-full">
          <label class="block text-xs text-t-muted mb-1">Slug</label>
          <input v-model="filters.slug" type="text" class="w-full px-3 py-1.5 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary" placeholder="搜索 Slug" />
        </div>
        <div class="flex items-center gap-2">
          <button class="px-4 py-1.5 text-sm font-semibold text-t-on-primary bg-t-primary-fill hover:opacity-90 transition-all cursor-pointer" @click="applyFilters">查询</button>
          <button class="px-4 py-1.5 text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer" @click="resetFilters">重置</button>
        </div>
      </div>
      <div v-if="hasActiveFilters" class="flex items-center gap-2 mt-3 pt-3 border-t border-t-border">
        <span class="text-xs text-t-muted">当前筛选：</span>
        <span v-if="filters.name" class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
          名称: {{ filters.name }}
          <button class="hover:opacity-70 cursor-pointer" @click="filters.name = undefined">×</button>
        </span>
        <span v-if="filters.slug" class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
          Slug: {{ filters.slug }}
          <button class="hover:opacity-70 cursor-pointer" @click="filters.slug = undefined">×</button>
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
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">分类名称</th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">Slug</th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">描述</th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">排序</th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">创建时间</th>
              <th class="text-right px-5 py-3.5 text-t-muted font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id" class="border-b border-[rgba(var(--color-primary-rgb),0.08)] transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.03)]">
              <td class="px-5 py-3.5">
                <input v-model="selectedIds" type="checkbox" :value="category.id" class="rounded border-t-border text-t-primary cursor-pointer" />
              </td>
              <td class="px-5 py-3.5 text-t-muted text-xs font-mono">{{ category.id }}</td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <FolderOpen class="w-4 h-4 text-t-muted flex-shrink-0" />
                  <span class="text-t-body">{{ category.name }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5 text-t-muted">{{ category.slug }}</td>
              <td class="px-5 py-3.5"><p class="text-t-body line-clamp-2 max-w-[200px]">{{ category.description || '-' }}</p></td>
              <td class="px-5 py-3.5 text-t-muted">{{ category.sortOrder }}</td>
              <td class="px-5 py-3.5 text-t-muted">{{ formatDate(category.createTime) }}</td>
              <td class="px-5 py-3.5">
                <div class="flex items-center justify-end gap-1">
                  <button class="p-1.5 text-t-muted transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.1)] cursor-pointer" title="编辑" @click="openEditDialog(category)">
                    <Edit3 class="w-4 h-4" />
                  </button>
                  <button class="p-1.5 text-t-muted transition-all duration-200 hover:text-t-danger hover:bg-t-danger-soft cursor-pointer" title="删除" @click="handleDelete(category)">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="categories.length === 0 && !loading" class="text-center py-12 text-t-muted text-sm">暂无分类</div>
    </div>

    <div class="md:hidden space-y-3">
      <div v-for="category in categories" :key="category.id" class="bg-t-surface border border-t-border p-4 space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <FolderOpen class="w-4 h-4 text-t-muted flex-shrink-0" />
            <span class="text-t-body font-medium">{{ category.name }}</span>
          </div>
          <span class="text-xs text-t-muted font-mono">{{ category.slug }}</span>
        </div>
        <div class="flex items-center gap-2 text-xs text-t-muted">
          <span>排序: {{ category.sortOrder }}</span>
          <span>·</span>
          <span>{{ formatDate(category.createTime) }}</span>
        </div>
        <div class="flex items-center justify-end gap-1 pt-1 border-t border-t-border">
          <button class="w-9 h-9 flex items-center justify-center text-t-muted transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.1)] cursor-pointer" title="编辑" @click="openEditDialog(category)">
            <Edit3 class="w-4 h-4" />
          </button>
          <button class="w-9 h-9 flex items-center justify-center text-t-muted transition-all duration-200 hover:text-t-danger hover:bg-t-danger-soft cursor-pointer" title="删除" @click="handleDelete(category)">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
      <div v-if="categories.length === 0 && !loading" class="text-center py-12 text-t-muted text-sm">暂无分类</div>
    </div>

    <div v-if="total > 0" class="flex items-center justify-between px-5 py-3 bg-t-surface border border-t-border border-t-0 -mt-px">
      <div class="flex items-center gap-2">
        <span class="text-xs text-t-muted">每页</span>
        <CustomSelect v-model="pageSize" :options="pageSizeOptions" button-class="px-2 py-1 rounded text-xs" />
      </div>
      <div class="flex items-center gap-1">
        <button class="flex items-center justify-center w-8 h-8 rounded border border-t-border text-t-muted transition-all duration-200 hover:text-t-primary hover:border-t-primary disabled:opacity-30 disabled:cursor-not-allowed" :disabled="current <= 1" @click="loadCategories(current - 1)">
          <ChevronLeft class="w-4 h-4" />
        </button>
        <template v-for="page in displayPages" :key="page">
          <span v-if="page === '...'" class="w-8 h-8 flex items-center justify-center text-t-muted text-xs">...</span>
          <button v-else class="w-8 h-8 rounded text-xs font-medium transition-all duration-200" :class="page === current ? 'bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary' : 'border border-transparent text-t-muted hover:text-t-primary hover:border-t-primary'" @click="loadCategories(page as number)">
            {{ page }}
          </button>
        </template>
        <button class="flex items-center justify-center w-8 h-8 rounded border border-t-border text-t-muted transition-all duration-200 hover:text-t-primary hover:border-t-primary disabled:opacity-30 disabled:cursor-not-allowed" :disabled="current >= totalPages" @click="loadCategories(current + 1)">
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
      <span class="text-xs text-t-muted">共 {{ total }} 条</span>
    </div>

    <AppDialog v-model:open="showDialog" :title="isEdit ? '编辑分类' : '添加分类'">
      <div class="space-y-4">
        <div>
          <label class="block text-xs text-t-muted mb-1">分类名称 <span class="text-t-danger">*</span></label>
          <input v-model="form.name" type="text" class="w-full px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary" placeholder="请输入分类名称" />
        </div>
        <div>
          <label class="block text-xs text-t-muted mb-1">Slug <span class="text-t-danger">*</span></label>
          <input v-model="form.slug" type="text" class="w-full px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary" placeholder="请输入 Slug" />
        </div>
        <div>
          <label class="block text-xs text-t-muted mb-1">描述</label>
          <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary resize-none" placeholder="请输入描述" />
        </div>
        <div>
          <label class="block text-xs text-t-muted mb-1">排序</label>
          <input v-model.number="form.sortOrder" type="number" class="w-full px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary" placeholder="0" />
        </div>
      </div>
      <div class="flex justify-end gap-3 mt-6">
        <button class="px-4 py-2 text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer" @click="closeDialog">取消</button>
        <button class="px-4 py-2 text-sm font-semibold text-t-on-primary bg-t-primary-fill hover:opacity-90 transition-all cursor-pointer" @click="handleSubmit">{{ isEdit ? '保存' : '添加' }}</button>
      </div>
    </AppDialog>

    <AppConfirmDialog
      v-model:open="showDeleteConfirm"
      title="确认删除"
      :description="deleteIsBatch ? `确定要删除选中的 ${selectedIds.length} 个分类吗？此操作不可撤销。` : '确定要删除该分类吗？此操作不可撤销。'"
      confirm-text="确认删除"
      danger
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { ChevronDown, ChevronLeft, ChevronRight, Edit3, Filter, FolderOpen, Plus, Trash2 } from 'lucide-vue-next'
import {
  batchDeleteAdminCategories,
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  getAdminCategoryById,
  updateAdminCategory,
} from '~/api/admin/category'
import type {
  AdminCategory,
  AdminCategoryCreateDTO,
  AdminCategoryQuery,
  AdminCategoryUpdateDTO,
} from '~/types/admin'
import { formatDate } from '~/utils/format'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: '分类管理 | 立里博客', robots: 'noindex' })

const toast = useToast()

const categories = ref<AdminCategory[]>([])
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

const filters = reactive<{ name?: string; slug?: string }>({})
const hasActiveFilters = computed(() => Boolean(filters.name || filters.slug))
const allSelected = computed({
  get: () => categories.value.length > 0 && selectedIds.value.length === categories.value.length,
  set: (value: boolean) => {
    selectedIds.value = value ? categories.value.map(category => category.id) : []
  },
})

function buildQueryParams(page: number): AdminCategoryQuery {
  const params: AdminCategoryQuery = { current: page, size: pageSize.value }
  if (filters.name) params.name = filters.name
  if (filters.slug) params.slug = filters.slug
  return params
}

function applyFilters(): void {
  loadCategories(1)
}

function resetFilters(): void {
  filters.name = undefined
  filters.slug = undefined
  loadCategories(1)
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null
function debouncedApplyFilters(): void {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => loadCategories(1), 500)
}

watch(() => [filters.name, filters.slug], debouncedApplyFilters)
watch(pageSize, () => {
  current.value = 1
  loadCategories(1)
})
onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})

async function loadCategories(page = 1): Promise<void> {
  loading.value = true
  try {
    const response = await getAdminCategories(buildQueryParams(page))
    categories.value = response.data?.records || []
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
const form = reactive({ name: '', slug: '', description: '', sortOrder: 0 })

function resetForm(): void {
  form.name = ''
  form.slug = ''
  form.description = ''
  form.sortOrder = 0
}

function openAddDialog(): void {
  isEdit.value = false
  editId.value = null
  resetForm()
  showDialog.value = true
}

async function openEditDialog(category: AdminCategory): Promise<void> {
  isEdit.value = true
  editId.value = category.id
  try {
    const response = await getAdminCategoryById(category.id)
    const detail = response.data
    form.name = detail.name || ''
    form.slug = detail.slug || ''
    form.description = detail.description || ''
    form.sortOrder = detail.sortOrder ?? 0
    showDialog.value = true
  } catch {
    // handled by interceptor
  }
}

function closeDialog(): void {
  showDialog.value = false
  resetForm()
}

async function handleSubmit(): Promise<void> {
  if (!form.name.trim()) {
    toast.warning('请输入分类名称')
    return
  }
  if (!form.slug.trim()) {
    toast.warning('请输入 Slug')
    return
  }
  try {
    if (isEdit.value && editId.value !== null) {
      const data: AdminCategoryUpdateDTO = {
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        sortOrder: form.sortOrder,
      }
      await updateAdminCategory(editId.value, data)
      toast.success('分类已更新')
    } else {
      const data: AdminCategoryCreateDTO = {
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        sortOrder: form.sortOrder,
      }
      await createAdminCategory(data)
      toast.success('分类已添加')
    }
    closeDialog()
    loadCategories(current.value)
  } catch {
    // handled by interceptor
  }
}

const showDeleteConfirm = ref(false)
const deleteTarget = ref<AdminCategory | null>(null)
const deleteIsBatch = ref(false)

function handleDelete(category: AdminCategory): void {
  deleteTarget.value = category
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
      await batchDeleteAdminCategories(selectedIds.value)
      toast.success(`已删除 ${selectedIds.value.length} 个分类`)
    } else if (deleteTarget.value) {
      await deleteAdminCategory(deleteTarget.value.id)
      toast.success('分类已删除')
    }
    showDeleteConfirm.value = false
    deleteTarget.value = null
    deleteIsBatch.value = false
    loadCategories(current.value)
  } catch {
    // handled by interceptor
  }
}

onMounted(() => loadCategories(1))
</script>
