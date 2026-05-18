<template>
  <AppLayout :show-hero="false">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-white">我的文章</h1>
        <button
          class="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[rgba(0,240,255,0.12)] border border-[#00f0ff] text-[#00f0ff] transition-all duration-300 hover:bg-[rgba(0,240,255,0.2)] hover:shadow-[0_0_10px_rgba(0,240,255,0.15)]"
          @click="router.push('/manage/editor')">
          <Plus class="w-4 h-4" />
          写文章
        </button>
      </div>

      <div class="flex gap-2 mb-6">
        <button v-for="tab in statusTabs" :key="tab.value"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
          :class="activeTab === tab.value
            ? 'bg-[rgba(0,240,255,0.12)] border border-[#00f0ff] text-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.1)]'
            : 'border border-[rgba(0,240,255,0.15)] text-[#6b7280] hover:text-[#e0e0e8] hover:border-[rgba(0,240,255,0.3)]'" @click="handleTabChange(tab.value)">
          {{ tab.label }}
        </button>
      </div>

      <div v-if="articleStore.loading" class="flex flex-col gap-3">
        <div v-for="i in 3" :key="i" class="h-20 rounded-xl bg-[#111118] animate-pulse"></div>
      </div>

      <div v-else-if="articleStore.myList.length > 0" class="flex flex-col gap-3">
        <div v-for="article in articleStore.myList" :key="article.id"
          class="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] transition-all duration-300 hover:border-[rgba(0,240,255,0.3)] hover:shadow-[0_0_8px_rgba(0,240,255,0.06)]">
          <div class="flex-1 min-w-0">
            <h3
              class="text-sm font-semibold text-[#e0e0e8] truncate cursor-pointer transition-colors duration-200 hover:text-[#00f0ff]"
              @click="router.push(`/article/${article.id}`)">
              {{ article.title }}
            </h3>
            <div class="flex items-center gap-3 mt-1.5 text-xs text-[#6b7280]">
              <span class="flex items-center gap-1">
                <FolderOpen class="w-3 h-3" />
                {{ article.category?.name || '未分类' }}
              </span>
              <template v-if="article.tags?.length">
                <span v-for="tag in article.tags.slice(0, 3)" :key="tag.id"
                  class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                  :style="{ backgroundColor: tag.color ? `${tag.color}18` : 'rgba(0,240,255,0.08)', color: tag.color || '#00f0ff' }">
                  #{{ tag.name }}
                </span>
                <span v-if="article.tags.length > 3" class="text-[10px] text-[#6b7280]">
                  +{{ article.tags.length - 3 }}
                </span>
              </template>
              <span class="flex items-center gap-1">
                <Clock class="w-3 h-3" />
                {{ formatRelativeTime(article.updateTime || article.createTime) }}
              </span>
              <span class="flex items-center gap-1">
                <Eye class="w-3 h-3" />
                {{ article.viewCount }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.08)] transition-all duration-200"
              @click="router.push(`/manage/editor/${article.id}`)">
              <Edit class="w-4 h-4" />
            </button>
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#ff2d78] hover:bg-[rgba(255,45,120,0.08)] transition-all duration-200"
              @click="confirmDelete(article)">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <Pagination v-if="articleStore.total > pageSize" :current="currentPage" :total="articleStore.total"
          :page-size="pageSize" @update:current="handlePageChange" />
      </div>

      <EmptyState v-else :message="activeTab === 'all' ? '还没有文章' : `还没有${currentTabLabel}的文章`">
        <button
          class="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[rgba(0,240,255,0.12)] border border-[#00f0ff] text-[#00f0ff] transition-all duration-300 hover:bg-[rgba(0,240,255,0.2)]"
          @click="router.push('/manage/editor')">
          <Plus class="w-4 h-4" />
          开始写作
        </button>
      </EmptyState>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Edit, Trash2, Eye, Clock, FolderOpen } from 'lucide-vue-next'
import { useArticleStore } from '@/stores/article'
import { useUserStore } from '@/stores/user'
import { deleteArticle } from '@/api/article'
import { formatRelativeTime } from '@/utils/format'
import { useToast } from '@/composables/useToast'
import AppLayout from '@/components/layout/AppLayout.vue'
import Pagination from '@/components/ui/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { Article } from '@/types/article'

const router = useRouter()
const articleStore = useArticleStore()
const userStore = useUserStore()
const toast = useToast()
const activeTab = ref<string>('all')
const currentPage = ref(1)
const pageSize = 10

const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '审核中', value: '0' },
  { label: '已发布', value: '1' },
  { label: '草稿', value: '2' },
]

const currentTabLabel = computed(() => {
  return statusTabs.find(t => t.value === activeTab.value)?.label || ''
})

async function loadArticles() {
  const params: Record<string, any> = { createBy: userStore.userId, current: currentPage.value, size: pageSize }
  if (activeTab.value !== 'all') params.status = Number(activeTab.value)
  await articleStore.fetchMyArticles(params)
}

function handleTabChange(tab: string) {
  activeTab.value = tab
  currentPage.value = 1
  loadArticles()
}

function handlePageChange(page: number) {
  currentPage.value = page
  loadArticles()
}

async function confirmDelete(article: Article) {
  if (!confirm(`确定要删除文章「${article.title}」吗？此操作不可恢复。`)) return
  try {
    await deleteArticle(article.id)
    toast.success('文章已删除')
    loadArticles()
  } catch {
  }
}

onMounted(loadArticles)
</script>
