<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="relative flex-1 sm:flex-initial">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <input v-model="keyword" type="text" placeholder="搜索文章..."
              class="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.15)]"
              @keyup.enter="fetchArticles" />
          </div>
          <select v-model="statusFilter"
            class="px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm outline-none transition-all duration-300 focus:border-[#00f0ff] cursor-pointer"
            @change="fetchArticles">
            <option :value="undefined">全部状态</option>
            <option :value="0">审核中</option>
            <option :value="1">已发布</option>
            <option :value="2">草稿</option>
          </select>
        </div>
        <button
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[rgba(0,240,255,0.1)] border border-[#00f0ff] text-[#00f0ff] text-sm font-medium transition-all duration-300 hover:bg-[rgba(0,240,255,0.2)] hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] cursor-pointer"
          @click="router.push('/write')">
          <Plus class="w-4 h-4" />
          新建文章
        </button>
      </div>

      <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-[rgba(0,240,255,0.15)]">
                <th class="text-left px-5 py-3.5 text-[#6b7280] font-medium">标题</th>
                <th class="text-left px-5 py-3.5 text-[#6b7280] font-medium">分类</th>
                <th class="text-left px-5 py-3.5 text-[#6b7280] font-medium">状态</th>
                <th class="text-left px-5 py-3.5 text-[#6b7280] font-medium">创建时间</th>
                <th class="text-right px-5 py-3.5 text-[#6b7280] font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="article in articles" :key="article.id"
                class="border-b border-[rgba(0,240,255,0.08)] transition-colors duration-200 hover:bg-[rgba(0,240,255,0.03)]">
                <td class="px-5 py-3.5">
                  <span class="text-[#e0e0e8] font-medium line-clamp-1">{{ article.title }}</span>
                </td>
                <td class="px-5 py-3.5">
                  <span class="text-[#6b7280]">{{ article.category?.name || '未分类' }}</span>
                </td>
                <td class="px-5 py-3.5">
                  <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium" :class="article.status === 1
                    ? 'bg-[rgba(0,240,255,0.1)] text-[#00f0ff] border border-[rgba(0,240,255,0.3)]'
                    : article.status === 0
                      ? 'bg-[rgba(255,170,0,0.1)] text-[#ffaa00] border border-[rgba(255,170,0,0.3)]'
                      : 'bg-[rgba(107,114,128,0.1)] text-[#6b7280] border border-[rgba(107,114,128,0.3)]'">
                    {{ statusText(article.status) }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-[#6b7280]">{{ formatDate(article.createTime) }}</td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      class="p-1.5 rounded-lg text-[#6b7280] transition-all duration-200 hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.1)] cursor-pointer"
                      title="切换状态" @click="toggleStatus(article)">
                      <Eye v-if="article.status !== 1" class="w-4 h-4" />
                      <EyeOff v-else class="w-4 h-4" />
                    </button>
                    <button
                      class="p-1.5 rounded-lg text-[#6b7280] transition-all duration-200 hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.1)] cursor-pointer"
                      title="编辑" @click="router.push(`/write/${article.id}`)">
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      class="p-1.5 rounded-lg text-[#6b7280] transition-all duration-200 hover:text-[#ff2d78] hover:bg-[rgba(255,45,120,0.1)] cursor-pointer"
                      title="删除" @click="handleDelete(article)">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="articles.length === 0 && !loading" class="text-center py-12 text-[#6b7280] text-sm">
          暂无文章
        </div>
      </div>

      <div v-if="total > pageSize" class="flex justify-center">
        <Pagination :current="current" :total="total" :page-size="pageSize" @update:current="handlePageChange" />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-vue-next'
import { getArticles, deleteArticle, updateArticle } from '@/api/article'
import type { Article } from '@/types/article'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import { formatDate } from '@/utils/format'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Pagination from '@/components/ui/Pagination.vue'

const router = useRouter()

const articles = ref<Article[]>([])
const total = ref(0)
const current = ref(1)
const pageSize = 10
const loading = ref(false)
const keyword = ref('')
const statusFilter = ref<number | undefined>(undefined)

function statusText(status: number) {
  const map: Record<number, string> = { 0: '审核中', 1: '已发布', 2: '草稿' }
  return map[status] || '未知'
}

async function fetchArticles() {
  loading.value = true
  try {
    const params: Record<string, any> = {
      current: current.value,
      size: pageSize,
    }
    if (statusFilter.value !== undefined) params.status = statusFilter.value
    if (keyword.value) params.title = keyword.value
    const res = await getArticles(params) as unknown as ApiResponse<PageResult<Article>>
    articles.value = res.data?.records || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  current.value = page
  fetchArticles()
}

async function toggleStatus(article: Article) {
  const newStatus = article.status === 1 ? 2 : 1
  await updateArticle(article.id, {
    title: article.title,
    content: '',
    status: newStatus,
    categoryId: article.category?.id || 0,
    tags: article.tags?.map(t => t.id) || []
  })
  fetchArticles()
}

async function handleDelete(article: Article) {
  await deleteArticle(article.id)
  fetchArticles()
}

onMounted(fetchArticles)
</script>
