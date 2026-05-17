<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTagList, createTag, updateTag, deleteTag } from '@/api'
import type { Tag, PageResult } from '@/types'
import Pagination from '@/components/ui/Pagination.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'

/**
 * 标签管理页面
 */
const tags = ref<Tag[]>([])
const pageResult = ref<PageResult<Tag> | null>(null)
const loading = ref(false)
const showModal = ref(false)
const isEdit = ref(false)
const showDeleteDialog = ref(false)
const deleteTarget = ref<number | null>(null)

const form = ref<Partial<Tag>>({
  name: '',
  color: '#4f46e5',
})

const loadTags = async (page = 1) => {
  loading.value = true
  try {
    const res = await getTagList({ current: page, size: 10 })
    if (res.code === 0) {
      tags.value = res.data.records
      pageResult.value = res.data
    }
  } catch (error) {
    console.error('加载标签列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  loadTags(page)
}

const openCreateModal = () => {
  isEdit.value = false
  form.value = { name: '', color: '#4f46e5' }
  showModal.value = true
}

const openEditModal = (tag: Tag) => {
  isEdit.value = true
  form.value = { ...tag }
  showModal.value = true
}

const handleSave = async () => {
  if (!form.value.name || !form.value.color) return

  try {
    let res
    if (isEdit.value && form.value.id) {
      res = await updateTag(form.value.id, form.value)
    } else {
      res = await createTag(form.value)
    }

    if (res.code === 0) {
      showModal.value = false
      loadTags()
    }
  } catch (error) {
    console.error('保存标签失败:', error)
  }
}

const confirmDelete = (id: number) => {
  deleteTarget.value = id
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!deleteTarget.value) return
  try {
    const res = await deleteTag(deleteTarget.value)
    if (res.code === 0) {
      loadTags()
    }
  } catch (error) {
    console.error('删除标签失败:', error)
  } finally {
    showDeleteDialog.value = false
    deleteTarget.value = null
  }
}

onMounted(() => {
  loadTags()
})
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-text-title">标签管理</h1>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-none"
        @click="openCreateModal"
      >
        <Plus class="h-4 w-4" />
        添加标签
      </button>
    </div>

    <LoadingBlock v-if="loading" />

    <div v-else-if="tags.length > 0">
      <div class="bg-bg-surface rounded-2xl overflow-hidden card-shadow">
        <table class="w-full text-sm">
          <thead class="border-b border-border bg-bg-canvas">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-text-title">名称</th>
              <th class="px-4 py-3 text-left font-semibold text-text-title">颜色</th>
              <th class="px-4 py-3 text-left font-semibold text-text-title">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tag in tags"
              :key="tag.id"
              class="border-b border-border last:border-b-0"
            >
              <td class="px-4 py-3">
                <span
                  class="pill-badge text-xs"
                  :style="{ backgroundColor: tag.color + '20', color: tag.color, border: `1px solid ${tag.color}40` }"
                >
                  {{ tag.name }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div
                    class="w-5 h-5 rounded-full border border-border"
                    :style="{ backgroundColor: tag.color }"
                  />
                  <span class="font-mono text-xs text-text-meta">{{ tag.color }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    class="p-1.5 rounded-lg text-text-meta hover:text-primary hover:bg-primary/10 transition-none"
                    @click="openEditModal(tag)"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    class="p-1.5 rounded-lg text-text-meta hover:text-accent-rose hover:bg-accent-rose/10 transition-none"
                    @click="confirmDelete(tag.id)"
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

    <EmptyState v-else title="暂无标签" description="还没有创建任何标签" />

    <!-- 编辑/创建弹窗 -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showModal = false" />
      <div class="relative bg-bg-surface border border-border rounded-2xl p-6 w-full max-w-md">
        <h2 class="text-lg font-bold text-text-title mb-4">
          {{ isEdit ? '编辑标签' : '添加标签' }}
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
            <label class="block text-sm font-medium text-text-title mb-1.5">颜色</label>
            <div class="flex items-center gap-3">
              <input
                v-model="form.color"
                type="color"
                class="w-10 h-10 rounded-lg border border-border bg-transparent cursor-pointer"
              />
              <input
                v-model="form.color"
                type="text"
                class="flex-1 px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body font-mono focus:outline-none focus:border-primary"
              />
            </div>
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
      title="删除标签"
      description="确定要删除这个标签吗？此操作不可撤销。"
      confirm-text="删除"
      danger
      @confirm="handleDelete"
    />
  </div>
</template>
