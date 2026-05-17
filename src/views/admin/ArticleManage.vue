<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleList, deleteArticle } from '@/api'
import type { Article, PageResult } from '@/types'
import Pagination from '@/components/common/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingBlock from '@/components/common/LoadingBlock.vue'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'

/**
 * 文章管理页面
 */
const router = useRouter()

const articles = ref<Article[]>([])
const pageResult = ref<PageResult<Article> | null>(null)
const loading = ref(false)

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

const handleDelete = async (id: number) => {
  if (!confirm('确定要删除这篇文章吗？')) return

  try {
    const res = await deleteArticle(id)
    if (res.code === 0) {
      loadArticles()
    }
  } catch (error) {
    console.error('删除文章失败:', error)
  }
}

onMounted(() => {
  loadArticles()
})
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-black">文章管理</h1>
      <router-link
        to="/write"
        class="flex items-center gap-2 border-2 border-black px-3 py-1 text-sm font-bold dark:border-white"
      >
        <Plus class="h-4 w-4" />
        写文章
      </router-link>
    </div>

    <LoadingBlock v-if="loading" />

    <div v-else-if="articles.length > 0">
      <!-- 表格 -->
      <div class="overflow-x-auto border-2 border-black dark:border-[var(--neutral-800)]">
        <table class="w-full text-sm">
          <thead class="border-b-2 border-black bg-[var(--neutral-100)] dark:border-[var(--neutral-800)] dark:bg-[var(--neutral-900)]">
            <tr>
              <th class="px-4 py-3 text-left font-bold">标题</th>
              <th class="px-4 py-3 text-left font-bold">分类</th>
              <th class="px-4 py-3 text-left font-bold">状态</th>
              <th class="px-4 py-3 text-left font-bold">时间</th>
              <th class="px-4 py-3 text-left font-bold">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="article in articles"
              :key="article.id"
              class="border-b border-[var(--neutral-200)] dark:border-[var(--neutral-800)]"
            >
              <td class="px-4 py-3">
                <router-link
                  :to="`/article/${article.id}`"
                  class="font-bold"
                >
                  {{ article.title }}
                </router-link>
              </td>
              <td class="px-4 py-3">
                {{ article.category?.name || '-' }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="border px-2 py-0.5 text-xs font-bold"
                  :class="{
                    'border-[#e11d48] text-[#e11d48]': article.status === 0,
                    'border-[#a3e635] text-[#a3e635]': article.status === 1,
                    'border-[#f59e0b] text-[#f59e0b]': article.status === 2,
                  }"
                >
                  {{ article.status === 0 ? '审核中' : article.status === 1 ? '已发布' : '草稿' }}
                </span>
              </td>
              <td class="px-4 py-3 font-mono text-xs">
                {{ article.createTime?.split('T')[0] }}
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    class="p-1"
                    @click="handleEdit(article.id)"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    class="p-1"
                    :style="{ color: 'var(--accent-magenta)' }"
                    @click="handleDelete(article.id)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
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

    <EmptyState v-else message="暂无文章" />
  </div>
</template>
