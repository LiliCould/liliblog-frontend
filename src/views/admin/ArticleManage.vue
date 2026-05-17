<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleList, deleteArticle } from '@/api'
import type { Article, PageResult } from '@/types'
import Pagination from '@/components/ui/Pagination.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { Pencil, Trash2, Plus, Eye } from 'lucide-vue-next'

/**
 * 文章管理页面
 */
const router = useRouter()

const articles = ref<Article[]>([])
const pageResult = ref<PageResult<Article> | null>(null)
const loading = ref(false)
const deleteTarget = ref<number | null>(null)
const showDeleteDialog = ref(false)

const loadArticles = async (page = 1) => {
  loading.value = true
  try {
    const res = await getArticleList({ current: page, size: 10 })
    if (res.code === 0) {
      articles.value = res.data.records
      pageResult.value = res.data
    }
  } catch (error) {
    console.error('加载文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  loadArticles(page)
}

const handleEdit = (id: number) => {
  router.push(`/write/${id}`)
}

const confirmDelete = (id: number) => {
  deleteTarget.value = id
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!deleteTarget.value) return
  try {
    const res = await deleteArticle(deleteTarget.value)
    if (res.code === 0) {
      loadArticles()
    }
  } catch (error) {
    console.error('删除文章失败:', error)
  } finally {
    showDeleteDialog.value = false
    deleteTarget.value = null
  }
}

onMounted(() => {
  loadArticles()
})
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-text-title">文章管理</h1>
      <router-link
to="/write"
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-none">
        <Plus class="h-4 w-4" />
        写文章
      </router-link>
    </div>

    <LoadingBlock v-if="loading" />

    <div v-else-if="articles.length > 0">
      <div class="bg-bg-surface rounded-2xl overflow-hidden card-shadow">
        <table class="w-full text-sm">
          <thead class="border-b border-border bg-bg-canvas">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-text-title">标题</th>
              <th class="px-4 py-3 text-left font-semibold text-text-title">分类</th>
              <th class="px-4 py-3 text-left font-semibold text-text-title">状态</th>
              <th class="px-4 py-3 text-left font-semibold text-text-title">时间</th>
              <th class="px-4 py-3 text-left font-semibold text-text-title">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="article in articles"
              :key="article.id"
              class="border-b border-border last:border-b-0"
            >
              <td class="px-4 py-3">
                <router-link
                  :to="`/article/${article.id}`"
                  class="font-medium text-text-title hover:text-primary transition-none"
                >
                  {{ article.title }}
                </router-link>
              </td>
              <td class="px-4 py-3 text-text-body">
                {{ article.category?.name || '-' }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="pill-badge text-xs"
                  :class="{
                    'bg-accent-rose/10 text-accent-rose': article.status === 0,
                    'bg-accent-toxic/10 text-accent-toxic': article.status === 1,
                    'bg-accent-amber/10 text-accent-amber': article.status === 2,
                  }"
                >
                  {{ article.status === 0 ? '审核中' : article.status === 1 ? '已发布' : '草稿' }}
                </span>
              </td>
              <td class="px-4 py-3 text-text-meta text-xs font-mono">
                {{ article.createTime?.split('T')[0] }}
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    class="p-1.5 rounded-lg text-text-meta hover:text-primary hover:bg-primary/10 transition-none"
                    @click="router.push(`/article/${article.id}`)"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button
                    class="p-1.5 rounded-lg text-text-meta hover:text-primary hover:bg-primary/10 transition-none"
                    @click="handleEdit(article.id)"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    class="p-1.5 rounded-lg text-text-meta hover:text-accent-rose hover:bg-accent-rose/10 transition-none"
                    @click="confirmDelete(article.id)"
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

    <EmptyState v-else title="暂无文章" description="还没有发布任何文章" />

    <ConfirmDialog
      v-model:open="showDeleteDialog"
      title="删除文章"
      description="确定要删除这篇文章吗？此操作不可撤销。"
      confirm-text="删除"
      danger
      @confirm="handleDelete"
    />
  </div>
</template>
