<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getComments, deleteComment } from '@/api'
import type { Comment, PageResult } from '@/types'
import Pagination from '@/components/ui/Pagination.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { Trash2 } from 'lucide-vue-next'

/**
 * 评论管理页面
 */
const comments = ref<Comment[]>([])
const pageResult = ref<PageResult<Comment> | null>(null)
const loading = ref(false)
const showDeleteDialog = ref(false)
const deleteTarget = ref<number | null>(null)

const loadComments = async (page = 1) => {
  loading.value = true
  try {
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

const confirmDelete = (id: number) => {
  deleteTarget.value = id
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!deleteTarget.value) return
  try {
    const res = await deleteComment(deleteTarget.value)
    if (res.code === 0) {
      loadComments()
    }
  } catch (error) {
    console.error('删除评论失败:', error)
  } finally {
    showDeleteDialog.value = false
    deleteTarget.value = null
  }
}

onMounted(() => {
  loadComments()
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-text-title mb-6">评论管理</h1>

    <LoadingBlock v-if="loading" />

    <div v-else-if="comments.length > 0">
      <div class="bg-bg-surface rounded-2xl overflow-hidden card-shadow">
        <table class="w-full text-sm">
          <thead class="border-b border-border bg-bg-canvas">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-text-title">评论内容</th>
              <th class="px-4 py-3 text-left font-semibold text-text-title">评论者</th>
              <th class="px-4 py-3 text-left font-semibold text-text-title">文章ID</th>
              <th class="px-4 py-3 text-left font-semibold text-text-title">时间</th>
              <th class="px-4 py-3 text-left font-semibold text-text-title">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="comment in comments"
              :key="comment.id"
              class="border-b border-border last:border-b-0"
            >
              <td class="px-4 py-3 text-text-body max-w-xs truncate">{{ comment.content }}</td>
              <td class="px-4 py-3 text-text-body">{{ comment.user?.nickname || '-' }}</td>
              <td class="px-4 py-3 text-text-meta font-mono text-xs">{{ comment.articleId }}</td>
              <td class="px-4 py-3 text-text-meta text-xs font-mono">{{ comment.createTime?.split('T')[0] }}</td>
              <td class="px-4 py-3">
                <button
                  class="p-1.5 rounded-lg text-text-meta hover:text-accent-rose hover:bg-accent-rose/10 transition-none"
                  @click="confirmDelete(comment.id)"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
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

    <EmptyState v-else title="暂无评论" description="还没有任何评论" />

    <ConfirmDialog
      v-model:open="showDeleteDialog"
      title="删除评论"
      description="确定要删除这条评论吗？此操作不可撤销。"
      confirm-text="删除"
      danger
      @confirm="handleDelete"
    />
  </div>
</template>
