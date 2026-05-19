<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-t-title">分类管理</h2>
        <button
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[rgba(var(--color-primary-rgb),0.1)] border border-t-primary text-t-primary text-sm font-medium transition-all duration-300 hover:bg-[rgba(var(--color-primary-rgb),0.2)] hover:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.2)] cursor-pointer"
          @click="openModal()">
          <Plus class="w-4 h-4" />
          新增分类
        </button>
      </div>

      <div class="rounded-xl bg-t-surface border border-t-border overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-t-border">
                <th class="text-left px-5 py-3.5 text-t-muted font-medium">名称</th>
                <th class="text-left px-5 py-3.5 text-t-muted font-medium">Slug</th>
                <th class="text-left px-5 py-3.5 text-t-muted font-medium">描述</th>
                <th class="text-left px-5 py-3.5 text-t-muted font-medium">排序</th>
                <th class="text-left px-5 py-3.5 text-t-muted font-medium">状态</th>
                <th class="text-right px-5 py-3.5 text-t-muted font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cat in categories" :key="cat.id"
                class="border-b border-[rgba(var(--color-primary-rgb),0.08)] transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.03)]">
                <td class="px-5 py-3.5 text-t-body font-medium">{{ cat.name }}</td>
                <td class="px-5 py-3.5 text-t-muted">{{ cat.slug }}</td>
                <td class="px-5 py-3.5 text-t-muted max-w-[200px] truncate">{{ cat.description || '-' }}</td>
                <td class="px-5 py-3.5 text-t-muted">{{ cat.sortOrder }}</td>
                <td class="px-5 py-3.5">
                  <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium" :class="cat.status === 1
                    ? 'bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary border border-[rgba(var(--color-primary-rgb),0.3)]'
                    : 'bg-[rgba(107,114,128,0.1)] text-t-muted border border-[rgba(107,114,128,0.3)]'">
                    {{ cat.status === 1 ? '启用' : '禁用' }}
                  </span>
                </td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      class="p-1.5 rounded-lg text-t-muted transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.1)] cursor-pointer"
                      title="切换状态" @click="toggleCategoryStatus(cat)">
                      <ToggleRight v-if="cat.status === 1" class="w-4 h-4 text-t-primary" />
                      <ToggleLeft v-else class="w-4 h-4" />
                    </button>
                    <button
                      class="p-1.5 rounded-lg text-t-muted transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.1)] cursor-pointer"
                      title="编辑" @click="openModal(cat)">
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      class="p-1.5 rounded-lg text-t-muted transition-all duration-200 hover:text-t-secondary hover:bg-[rgba(var(--color-secondary-rgb),0.1)] cursor-pointer"
                      title="删除" @click="handleDelete(cat)">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="categories.length === 0 && !loading" class="text-center py-12 text-t-muted text-sm">
          暂无分类
        </div>
      </div>

      <Teleport to="body">
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0"
          enter-to-class="opacity-100" leave-active-class="transition duration-150" leave-from-class="opacity-100"
          leave-to-class="opacity-0">
          <div v-if="modalVisible" class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.6)] flex items-center justify-center p-4"
            @click.self="closeModal">
            <div
              class="w-full max-w-md rounded-xl bg-t-surface border border-t-border p-6 shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.1)]">
              <h3 class="text-lg font-semibold text-t-title mb-5">{{ editingId ? '编辑分类' : '新增分类' }}</h3>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm text-t-body mb-1.5">名称</label>
                  <input v-model="form.name" type="text"
                    class="w-full px-4 py-2.5 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-all duration-300 focus:border-t-primary focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.15)]" />
                </div>
                <div>
                  <label class="block text-sm text-t-body mb-1.5">Slug</label>
                  <input v-model="form.slug" type="text"
                    class="w-full px-4 py-2.5 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-all duration-300 focus:border-t-primary focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.15)]" />
                </div>
                <div>
                  <label class="block text-sm text-t-body mb-1.5">描述</label>
                  <textarea v-model="form.description" rows="3"
                    class="w-full px-4 py-2.5 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-all duration-300 focus:border-t-primary focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.15)] resize-none"></textarea>
                </div>
                <div>
                  <label class="block text-sm text-t-body mb-1.5">排序</label>
                  <input v-model.number="form.sortOrder" type="number"
                    class="w-full px-4 py-2.5 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-all duration-300 focus:border-t-primary focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.15)]" />
                </div>
                <div>
                  <label class="block text-sm text-t-body mb-1.5">状态</label>
                  <select v-model="form.status"
                    class="w-full px-4 py-2.5 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-all duration-300 focus:border-t-primary cursor-pointer">
                    <option :value="1">启用</option>
                    <option :value="0">禁用</option>
                  </select>
                </div>
              </div>

              <div class="flex justify-end gap-3 mt-6">
                <button
                  class="px-4 py-2 rounded-lg border border-t-border text-t-muted text-sm transition-all duration-200 hover:text-t-body hover:border-[rgba(var(--color-primary-rgb),0.3)] cursor-pointer"
                  @click="closeModal">
                  取消
                </button>
                <button
                  class="px-4 py-2 rounded-lg bg-[rgba(var(--color-primary-rgb),0.1)] border border-t-primary text-t-primary text-sm font-medium transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.2)] cursor-pointer"
                  @click="handleSubmit">
                  {{ editingId ? '保存' : '创建' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-vue-next'
import { getCategories, createCategory, updateCategory, updateCategoryStatus, deleteCategory } from '@/api/category'
import type { Category } from '@/types/category'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import { useToast } from '@/composables/useToast'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const categories = ref<Category[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const editingId = ref<number | null>(null)
const toast = useToast()

const form = reactive({
  name: '',
  slug: '',
  description: '',
  sortOrder: 0,
  status: 1,
})

async function fetchCategories() {
  loading.value = true
  try {
    const res = await getCategories({ size: 100 }) as unknown as ApiResponse<PageResult<Category>>
    categories.value = res.data?.records || []
  } finally {
    loading.value = false
  }
}

function openModal(cat?: Category) {
  if (cat) {
    editingId.value = cat.id
    form.name = cat.name
    form.slug = cat.slug
    form.description = cat.description
    form.sortOrder = cat.sortOrder
    form.status = cat.status
  } else {
    editingId.value = null
    form.name = ''
    form.slug = ''
    form.description = ''
    form.sortOrder = 0
    form.status = 1
  }
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

async function handleSubmit() {
  if (editingId.value) {
    await updateCategory(editingId.value, { ...form })
    toast.success('分类已更新')
  } else {
    await createCategory({ ...form })
    toast.success('分类已创建')
  }
  closeModal()
  fetchCategories()
}

async function toggleCategoryStatus(cat: Category) {
  await updateCategoryStatus(cat.id)
  toast.success('分类状态已更新')
  fetchCategories()
}

async function handleDelete(cat: Category) {
  await deleteCategory(cat.id)
  toast.success('分类已删除')
  fetchCategories()
}

onMounted(fetchCategories)
</script>
