<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getComments, deleteComment } from '@/api'
import type { Comment, PageResult } from '@/types'
import Pagination from '@/components/common/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingBlock from '@/components/common/LoadingBlock.vue'
import { Trash2 } from 'lucide-vue-next'

/**
 * 评论管理页面
 */
const comments = ref<Comment[]>([])
const pageResult = ref<PageResult<Comment> | null>(null)
const loading = ref(false)

const loadComments = async (page = 1) => {
  loading.value = true
  try {
    // 获取所有评论，使用一个特殊 ID 或参数
    // 这里简化处理，实际可能需要后端提供获取所有评论的接口
    const res = await getComments({ id: 0, current: page, size: 10 })
    if (res.code === 0) {
      comments.value = res.data.records
      pageResult.value = res.data
    }
  } catch (error) {
    console.error('加载评论列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  loadComments(page)
}

const handleDelete = async (id: number) => {
  if (!confirm('确定要删除这条评论吗？')) return

  try {
    const res = await deleteComment(id)
    if (res.code === 0) {
      loadComments()
    }
  } catch (error) {
    console.error('删除评论失败:', error)
  }
}

onMounted(() => {
  loadComments()
})
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-black">评论管理</h1>

    <LoadingBlock v-if="loading" />

    <div v-else-if="comments.length > 0">
      <div class="overflow-x-auto border-2 border-black dark:border-[var(--neutral-800)]">
        <table class="w-full text-sm">
          <thead class="border-b-2 border-black bg-[var(--neutral-100)] dark:border-[var(--neutral-800)] dark:bg-[var(--neutral-900)]">
            <tr>
              <th class="px-4 py-3 text-left font-bold">评论内容</th>
              <th class="px-4 py-3 text-left font-bold">评论者</th>
              <th class="px-4 py-3 text-left font-bold">文章ID</th>
              <th class="px-4 py-3 text-left font-bold">时间</th>
              <th class="px-4 py-3 text-left font-bold">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="comment in comments"
              :key="comment.id"
              class="border-b border-[var(--neutral-200)] dark:border-[var(--neutral-800)]"
            >
              <td class="px-4 py-3 max-w-xs truncate">{{ comment.content }}</td>
              <td class="px-4 py-3">{{ comment.creator?.nickname || '-' }}</td>
              <td class="px-4 py-3 font-mono">{{ comment.articleId }}</td>
              <td class="px-4 py-3 font-mono text-xs">{{ comment.createTime?.split('T')[0] }}</td>
              <td class="px-4 py-3">
                <button
                  class="p-1"
                  :style="{ color: 'var(--accent-magenta)' }"
                  @click="handleDelete(comment.id)"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
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

    <EmptyState v-else message="暂无评论" />
  </div>
</template>
