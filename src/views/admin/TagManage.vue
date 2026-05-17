<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTagList, createTag, updateTag, deleteTag } from '@/api'
import type { Tag, PageResult } from '@/types'
import Pagination from '@/components/common/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingBlock from '@/components/common/LoadingBlock.vue'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'

/**
 * 标签管理页面
 */
const tags = ref<Tag[]>([])
const pageResult = ref<PageResult<Tag> | null>(null)
const loading = ref(false)
const showModal = ref(false)
const isEdit = ref(false)

const form = ref<Partial<Tag>>({
  name: '',
  color: '#4338ca',
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
  form.value = { name: '', color: '#4338ca' }
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

const handleDelete = async (id: number) => {
  if (!confirm('确定要删除这个标签吗？')) return

  try {
    const res = await deleteTag(id)
    if (res.code === 0) {
      loadTags()
    }
  } catch (error) {
    console.error('删除标签失败:', error)
  }
}

onMounted(() => {
  loadTags()
})
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-black">标签管理</h1>
      <button
        class="flex items-center gap-2 border-2 border-black px-3 py-1 text-sm font-bold dark:border-white"
        @click="openCreateModal"
      >
        <Plus class="h-4 w-4" />
        添加标签
      </button>
    </div>

    <LoadingBlock v-if="loading" />

    <div v-else-if="tags.length > 0">
      <div class="overflow-x-auto border-2 border-black dark:border-[var(--neutral-800)]">
        <table class="w-full text-sm">
          <thead class="border-b-2 border-black bg-[var(--neutral-100)] dark:border-[var(--neutral-800)] dark:bg-[var(--neutral-900)]">
            <tr>
              <th class="px-4 py-3 text-left font-bold">名称</th>
              <th class="px-4 py-3 text-left font-bold">颜色</th>
              <th class="px-4 py-3 text-left font-bold">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tag in tags"
              :key="tag.id"
              class="border-b border-[var(--neutral-200)] dark:border-[var(--neutral-800)]"
            >
              <td class="px-4 py-3">
                <span
                  class="border px-2 py-0.5 text-xs font-bold"
                  :style="{ borderColor: tag.color, color: tag.color }"
                >
                  {{ tag.name }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div
                    class="h-4 w-4 border border-black dark:border-white"
                    :style="{ backgroundColor: tag.color }"
                  />
                  <span class="font-mono text-xs">{{ tag.color }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    class="p-1"
                    @click="openEditModal(tag)"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    class="p-1"
                    :style="{ color: 'var(--accent-magenta)' }"
                    @click="handleDelete(tag.id)"
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

    <EmptyState v-else message="暂无标签" />

    <!-- 编辑/创建弹窗 -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="w-full max-w-md border-2 border-black bg-white p-6 dark:border-[var(--neutral-800)] dark:bg-[var(--surface)]">
        <h2 class="text-xl font-black">
          {{ isEdit ? '编辑标签' : '添加标签' }}
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
            <label class="mb-1 block text-sm font-bold">颜色</label>
            <div class="flex items-center gap-2">
              <input
                v-model="form.color"
                type="color"
                class="h-10 w-10 border-2 border-black dark:border-[var(--neutral-800)]"
              />
              <input
                v-model="form.color"
                type="text"
                class="flex-1 border-2 border-black bg-transparent px-3 py-2 text-sm font-mono outline-none dark:border-[var(--neutral-800)]"
              />
            </div>
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
