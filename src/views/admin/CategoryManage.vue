<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategoryList, createCategory, updateCategory, deleteCategory } from '@/api'
import type { Category, PageResult } from '@/types'
import Pagination from '@/components/common/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingBlock from '@/components/common/LoadingBlock.vue'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'

/**
 * 分类管理页面
 */
const categories = ref<Category[]>([])
const pageResult = ref<PageResult<Category> | null>(null)
const loading = ref(false)
const showModal = ref(false)
const isEdit = ref(false)

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

const handleDelete = async (id: number) => {
  if (!confirm('确定要删除这个分类吗？')) return

  try {
    const res = await deleteCategory(id)
    if (res.code === 0) {
      loadCategories()
    }
  } catch (error) {
    console.error('删除分类失败:', error)
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-black">分类管理</h1>
      <button
        class="flex items-center gap-2 border-2 border-black px-3 py-1 text-sm font-bold dark:border-white"
        @click="openCreateModal"
      >
        <Plus class="h-4 w-4" />
        添加分类
      </button>
    </div>

    <LoadingBlock v-if="loading" />

    <div v-else-if="categories.length > 0">
      <div class="overflow-x-auto border-2 border-black dark:border-[var(--neutral-800)]">
        <table class="w-full text-sm">
          <thead class="border-b-2 border-black bg-[var(--neutral-100)] dark:border-[var(--neutral-800)] dark:bg-[var(--neutral-900)]">
            <tr>
              <th class="px-4 py-3 text-left font-bold">名称</th>
              <th class="px-4 py-3 text-left font-bold">别名</th>
              <th class="px-4 py-3 text-left font-bold">描述</th>
              <th class="px-4 py-3 text-left font-bold">排序</th>
              <th class="px-4 py-3 text-left font-bold">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="category in categories"
              :key="category.id"
              class="border-b border-[var(--neutral-200)] dark:border-[var(--neutral-800)]"
            >
              <td class="px-4 py-3 font-bold">{{ category.name }}</td>
              <td class="px-4 py-3 font-mono">{{ category.slug }}</td>
              <td class="px-4 py-3">{{ category.description || '-' }}</td>
              <td class="px-4 py-3 font-mono">{{ category.sortOrder }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    class="p-1"
                    @click="openEditModal(category)"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    class="p-1"
                    :style="{ color: 'var(--accent-magenta)' }"
                    @click="handleDelete(category.id)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="pageResult && pageResult.totalPage > 1"
        class="mt-4"
      >
        <Pagination
          :current="pageResult.current"
          :total-page="pageResult.totalPage"
          :has-previous="pageResult.hasPrevious"
          :has-next="pageResult.hasNext"
          @change="handlePageChange"
        />
      </div>
    </div>

    <EmptyState v-else message="暂无分类" />

    <!-- 编辑/创建弹窗 -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="w-full max-w-md border-2 border-black bg-white p-6 dark:border-[var(--neutral-800)] dark:bg-[var(--surface)]">
        <h2 class="text-xl font-black">
          {{ isEdit ? '编辑分类' : '添加分类' }}
        </h2>
        <div class="mt-4 space-y-4">
          <div>
            <label class="mb-1 block text-sm font-bold">名称</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none dark:border-[var(--neutral-800)]"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-bold">别名</label>
            <input
              v-model="form.slug"
              type="text"
              class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none dark:border-[var(--neutral-800)]"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-bold">描述</label>
            <textarea
              v-model="form.description"
              rows="2"
              class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none dark:border-[var(--neutral-800)]"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-bold">排序</label>
            <input
              v-model="form.sortOrder"
              type="number"
              class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none dark:border-[var(--neutral-800)]"
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button
            class="border-2 border-black px-4 py-2 text-sm font-bold dark:border-white"
            @click="showModal = false"
          >
            取消
          </button>
          <button
            class="border-2 border-black bg-[var(--accent-toxic)] px-4 py-2 text-sm font-bold text-black dark:border-white"
            @click="handleSave"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
