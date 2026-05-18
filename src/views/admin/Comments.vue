<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-white">评论管理</h2>
      </div>

      <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-[rgba(0,240,255,0.15)]">
                <th class="text-left px-5 py-3.5 text-[#6b7280] font-medium">评论内容</th>
                <th class="text-left px-5 py-3.5 text-[#6b7280] font-medium">评论者</th>
                <th class="text-left px-5 py-3.5 text-[#6b7280] font-medium">时间</th>
                <th class="text-right px-5 py-3.5 text-[#6b7280] font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="comment in comments"
                :key="comment.id"
                class="border-b border-[rgba(0,240,255,0.08)] transition-colors duration-200 hover:bg-[rgba(0,240,255,0.03)]"
              >
                <td class="px-5 py-3.5">
                  <div class="max-w-[300px]">
                    <p class="text-[#e0e0e8] line-clamp-2">{{ comment.content }}</p>
                    <p class="text-xs text-[#6b7280] mt-1">文章ID: {{ comment.articleId }}</p>
                  </div>
                </td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-[#1a1a24] border border-[rgba(0,240,255,0.15)] flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img v-if="comment.creator?.avatar" :src="comment.creator.avatar" alt="" class="w-full h-full object-cover" />
                      <MessageSquare v-else class="w-3.5 h-3.5 text-[#6b7280]" />
                    </div>
                    <span class="text-[#e0e0e8]">{{ comment.creator?.nickname || '匿名' }}</span>
                  </div>
                </td>
                <td class="px-5 py-3.5 text-[#6b7280]">{{ formatRelativeTime(comment.createTime) }}</td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      class="p-1.5 rounded-lg text-[#6b7280] transition-all duration-200 hover:text-[#ff2d78] hover:bg-[rgba(255,45,120,0.1)] cursor-pointer"
                      title="删除"
                      @click="handleDelete(comment)"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="comments.length === 0 && !loading" class="text-center py-12 text-[#6b7280] text-sm">
          暂无评论
        </div>
      </div>

      <div v-if="total > pageSize" class="flex justify-center">
        <Pagination
          :current="current"
          :total="total"
          :page-size="pageSize"
          @update:current="handlePageChange"
        />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Trash2, MessageSquare } from 'lucide-vue-next'
import { deleteComment } from '@/api/comment'
import type { Comment } from '@/types/comment'

import { formatRelativeTime } from '@/utils/format'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Pagination from '@/components/ui/Pagination.vue'
import request from '@/utils/request'

const comments = ref<Comment[]>([])
const total = ref(0)
const current = ref(1)
const pageSize = 10
const loading = ref(false)

async function fetchComments() {
  loading.value = true
  try {
    const res = await request.get('/api/comment', {
      params: { current: current.value, size: pageSize },
    }) as any
    comments.value = res.data?.records || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  current.value = page
  fetchComments()
}

async function handleDelete(comment: Comment) {
  await deleteComment(comment.id)
  fetchComments()
}

onMounted(fetchComments)
</script>
