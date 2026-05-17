<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategoryList, createCategory, updateCategory, deleteCategory } from '@/api'
import type { Category, PageResult } from '@/types'
import Pagination from '@/components/ui/Pagination.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'

/**
 * 分类管理页面
 */
const categories = ref<Category[]>([])
const pageResult = ref<PageResult<Category> | null>(null)
const loading = ref(false)
const showModal = ref(false)
const isEdit = ref(false)
const showDeleteDialog = ref(false)
const deleteTarget = ref<number | null>(null)

const form = ref<Partial<Category>>({
  name: '',
  slug: '',
  description: '',
  sortOrder: 0,
})

const loadCategories = async (page = 1) => {
  loading.value = true
  try {
    const res = await getCategoryList({ current: page, size: 10 })
    if (res.code === 0) {
      categories.value = res.data.records
      pageResult.value = res.data
    }
  } catch (error) {
    console.error('加载分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  loadCategories(page)
}

const openCreateModal = () => {
  isEdit.value = false
  form.value = { name: '', slug: '', description: '', sortOrder: 0 }
  showModal.value = true
}

const openEditModal = (category: Category) => {
  isEdit.value = true
  form.value = { ...category }
  showModal.value = true
}

const handleSave = async () => {
  if (!form.value.name || !form.value.slug) return

  try {
    let res
    if (isEdit.value && form.value.id) {
      res = await updateCategory(form.value.id, form.value)
    } else {
      res = await createCategory(form.value)
    }

    if (res.code === 0) {
      showModal.value = false
      loadCategories()
    }
  } catch (error) {
    console.error('保存分类失败:', error)
  }
}

const confirmDelete = (id: number) => {
  deleteTarget.value = id
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!deleteTarget.value) return
  try {
    const res = await deleteCategory(deleteTarget.value)
    if (res.code === 0) {
      loadCategories()
    }
  } catch (error) {
    console.error('删除分类失败:', error)
  } finally {
    showDeleteDialog.value = false
    deleteTarget.value = null
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-text-title">分类管理</h1>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-none"
        @click="openCreateModal"
      >
        <Plus class="h-4 w-4" />
        添加分类
      </button>
    </div>

    <LoadingBlock v-if="loading" />

    <div v-else-if="categories.length > 0">
      <div class="bg-bg-surface rounded-2xl overflow-hidden card-shadow">
        <table class="w-full text-sm">
          <thead class="border-b border-border bg-bg-canvas">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-text-title">名称</th>
              <th class="px-4 py-3 text-left font-semibold text-text-title">别名</th>
              <th class="px-4 py-3 text-left font-semibold text-text-title">描述</th>
              <th class="px-4 py-3 text-left font-semibold text-text-title">排序</th>
              <th class="px-4 py-3 text-left font-semibold text-text-title">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="category in categories"
              :key="category.id"
              class="border-b border-border last:border-b-0"
            >
              <td class="px-4 py-3 font-medium text-text-title">{{ category.name }}</td>
              <td class="px-4 py-3 text-text-body font-mono text-xs">{{ category.slug }}</td>
              <td class="px-4 py-3 text-text-body">{{ category.description || '-' }}</td>
              <td class="px-4 py-3 text-text-meta font-mono">{{ category.sortOrder }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    class="p-1.5 rounded-lg text-text-meta hover:text-primary hover:bg-primary/10 transition-none"
                    @click="openEditModal(category)"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    class="p-1.5 rounded-lg text-text-meta hover:text-accent-rose hover:bg-accent-rose/10 transition-none"
                    @click="confirmDelete(category.id)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination
        v-if="pageResult && pageResult.totalPage > 1"
        :current-page="pageResult.current"
        :total-pages="pageResult.totalPage"
        @change="handlePageChange"
      />
    </div>

    <EmptyState v-else title="暂无分类" description="还没有创建任何分类" />

    <!-- 编辑/创建弹窗 -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showModal = false" />
      <div class="relative bg-bg-surface border border-border rounded-2xl p-6 w-full max-w-md">
        <h2 class="text-lg font-bold text-text-title mb-4">
          {{ isEdit ? '编辑分类' : '添加分类' }}
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-title mb-1.5">名称</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-title mb-1.5">别名</label>
            <input
              v-model="form.slug"
              type="text"
              class="w-full px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-title mb-1.5">描述</label>
            <textarea
              v-model="form.description"
              rows="2"
              class="w-full px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-title mb-1.5">排序</label>
            <input
              v-model="form.sortOrder"
              type="number"
              class="w-full px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            class="px-4 py-2 rounded-lg text-sm text-text-body hover:bg-bg-canvas transition-none"
            @click="showModal = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-none"
            @click="handleSave"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      v-model:open="showDeleteDialog"
      title="删除分类"
      description="确定要删除这个分类吗？此操作不可撤销。"
      confirm-text="删除"
      danger
      @confirm="handleDelete"
    />
  </div>
</template>
