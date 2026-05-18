<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-white">标签管理</h2>
        <button
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[rgba(0,240,255,0.1)] border border-[#00f0ff] text-[#00f0ff] text-sm font-medium transition-all duration-300 hover:bg-[rgba(0,240,255,0.2)] hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] cursor-pointer"
          @click="openModal()"
        >
          <Plus class="w-4 h-4" />
          新增标签
        </button>
      </div>

      <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-[rgba(0,240,255,0.15)]">
                <th class="text-left px-5 py-3.5 text-[#6b7280] font-medium">名称</th>
                <th class="text-left px-5 py-3.5 text-[#6b7280] font-medium">颜色</th>
                <th class="text-left px-5 py-3.5 text-[#6b7280] font-medium">创建时间</th>
                <th class="text-right px-5 py-3.5 text-[#6b7280] font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tag in tags"
                :key="tag.id"
                class="border-b border-[rgba(0,240,255,0.08)] transition-colors duration-200 hover:bg-[rgba(0,240,255,0.03)]"
              >
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2">
                    <span
                      class="w-3 h-3 rounded-full flex-shrink-0"
                      :style="{ backgroundColor: tag.color || '#00f0ff', boxShadow: `0 0 6px ${tag.color || '#00f0ff'}40` }"
                    ></span>
                    <span class="text-[#e0e0e8] font-medium">{{ tag.name }}</span>
                  </div>
                </td>
                <td class="px-5 py-3.5">
                  <span class="text-[#6b7280] font-mono text-xs">{{ tag.color || '-' }}</span>
                </td>
                <td class="px-5 py-3.5 text-[#6b7280]">{{ formatDate(tag.createTime) }}</td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      class="p-1.5 rounded-lg text-[#6b7280] transition-all duration-200 hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.1)] cursor-pointer"
                      title="编辑"
                      @click="openModal(tag)"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      class="p-1.5 rounded-lg text-[#6b7280] transition-all duration-200 hover:text-[#ff2d78] hover:bg-[rgba(255,45,120,0.1)] cursor-pointer"
                      title="删除"
                      @click="handleDelete(tag)"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="tags.length === 0 && !loading" class="text-center py-12 text-[#6b7280] text-sm">
          暂无标签
        </div>
      </div>

      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-200"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="modalVisible" class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.6)] flex items-center justify-center p-4" @click.self="closeModal">
            <div class="w-full max-w-md rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-6 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
              <h3 class="text-lg font-semibold text-white mb-5">{{ editingId ? '编辑标签' : '新增标签' }}</h3>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm text-[#e0e0e8] mb-1.5">名称</label>
                  <input v-model="form.name" type="text" class="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.15)]" />
                </div>
                <div>
                  <label class="block text-sm text-[#e0e0e8] mb-1.5">颜色</label>
                  <div class="flex items-center gap-3">
                    <input
                      v-model="form.color"
                      type="color"
                      class="w-10 h-10 rounded-lg border border-[rgba(0,240,255,0.15)] bg-[#0a0a0f] cursor-pointer"
                    />
                    <input
                      v-model="form.color"
                      type="text"
                      class="flex-1 px-4 py-2.5 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.15)] font-mono"
                    />
                    <Palette class="w-5 h-5 text-[#6b7280] flex-shrink-0" />
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-3 mt-6">
                <button
                  class="px-4 py-2 rounded-lg border border-[rgba(0,240,255,0.15)] text-[#6b7280] text-sm transition-all duration-200 hover:text-[#e0e0e8] hover:border-[rgba(0,240,255,0.3)] cursor-pointer"
                  @click="closeModal"
                >
                  取消
                </button>
                <button
                  class="px-4 py-2 rounded-lg bg-[rgba(0,240,255,0.1)] border border-[#00f0ff] text-[#00f0ff] text-sm font-medium transition-all duration-200 hover:bg-[rgba(0,240,255,0.2)] cursor-pointer"
                  @click="handleSubmit"
                >
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
import { Plus, Edit, Trash2, Palette } from 'lucide-vue-next'
import { getTags, createTag, updateTag, deleteTag } from '@/api/tag'
import type { Tag } from '@/types/tag'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import { formatDate } from '@/utils/format'
import { useToast } from '@/composables/useToast'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const tags = ref<Tag[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const editingId = ref<number | null>(null)
const toast = useToast()

const form = reactive({
  name: '',
  color: '#00f0ff',
})

async function fetchTags() {
  loading.value = true
  try {
    const res = await getTags({ size: 100 }) as unknown as ApiResponse<PageResult<Tag>>
    tags.value = res.data?.records || []
  } finally {
    loading.value = false
  }
}

function openModal(tag?: Tag) {
  if (tag) {
    editingId.value = tag.id
    form.name = tag.name
    form.color = tag.color || '#00f0ff'
  } else {
    editingId.value = null
    form.name = ''
    form.color = '#00f0ff'
  }
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

async function handleSubmit() {
  if (editingId.value) {
    await updateTag(editingId.value, { ...form })
    toast.success('标签已更新')
  } else {
    await createTag({ ...form })
    toast.success('标签已创建')
  }
  closeModal()
  fetchTags()
}

async function handleDelete(tag: Tag) {
  await deleteTag(tag.id)
  toast.success('标签已删除')
  fetchTags()
}

onMounted(fetchTags)
</script>
