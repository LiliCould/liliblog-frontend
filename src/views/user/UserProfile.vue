<template>
  <AppLayout :show-hero="false">
    <div class="max-w-4xl mx-auto">
      <div class="rounded-xl bg-t-surface border border-t-border overflow-hidden mb-6">
        <div class="h-44 relative">
          <img :src="heroBg" alt="" class="absolute inset-0 w-full h-full object-cover opacity-25" />
        </div>
        <div class="px-6 pb-5 -mt-10 relative z-10">
          <div class="flex items-end justify-between">
            <div class="flex items-end gap-4">
              <div
                class="w-20 h-20 rounded-full bg-t-surface border-2 border-t-primary flex items-center justify-center overflow-hidden shadow-[0_0_16px_rgba(var(--color-surface-rgb),0.9)]">
                <img :src="resolveAvatar(targetUser?.avatar)" alt="" class="w-full h-full object-cover"
                  @error="handleAvatarError" />
              </div>
              <div class="pb-1">
                <h1 class="text-xl font-bold text-t-title">{{ targetUser?.nickname || '用户' }}</h1>
                <p class="text-sm text-t-muted">@{{ targetUser?.username }}</p>
              </div>
            </div>
            <div v-if="isSelf" class="flex items-center gap-2 pb-1">
              <button
                class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-[rgba(var(--color-primary-rgb),0.1)] border border-[rgba(var(--color-primary-rgb),0.2)] text-t-primary transition-all duration-300 hover:bg-[rgba(var(--color-primary-rgb),0.18)] hover:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.12)]"
                @click="router.push('/profile/edit')">
                <PenLine class="w-3.5 h-3.5" />
                编辑资料
              </button>
              <button
                class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-[rgba(var(--color-secondary-rgb),0.08)] border border-[rgba(var(--color-secondary-rgb),0.2)] text-t-secondary transition-all duration-300 hover:bg-[rgba(var(--color-secondary-rgb),0.15)] hover:shadow-[0_0_8px_rgba(var(--color-secondary-rgb),0.12)]"
                @click="showPasswordModal = true">
                <Lock class="w-3.5 h-3.5" />
                修改密码
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <FileText class="w-5 h-5 text-t-primary" />
          <h2 class="text-lg font-semibold text-t-title">{{ isSelf ? '我的文章' : '已发布文章' }}</h2>
        </div>
        <button v-if="isSelf"
          class="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary transition-all duration-300 hover:bg-[rgba(var(--color-primary-rgb),0.2)] hover:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.15)]"
          @click="router.push('/write')">
          <Plus class="w-4 h-4" />
          写文章
        </button>
      </div>

      <div v-if="isSelf" class="flex gap-2 mb-6">
        <button v-for="tab in statusTabs" :key="tab.value"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
          :class="activeTab === tab.value
            ? 'bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)]'
            : 'border border-t-border text-t-muted hover:text-t-body hover:border-[rgba(var(--color-primary-rgb),0.3)]'" @click="handleTabChange(tab.value)">
          {{ tab.label }}
        </button>
      </div>

      <div v-if="loading" class="flex flex-col gap-3">
        <div v-for="i in 3" :key="i" class="h-20 rounded-xl bg-t-surface animate-pulse"></div>
      </div>

      <div v-else-if="articles.length > 0" class="flex flex-col gap-3">
        <div v-for="article in articles" :key="article.id"
          class="flex items-center justify-between gap-4 p-4 rounded-xl bg-t-surface border border-t-border transition-all duration-300 hover:border-[rgba(var(--color-primary-rgb),0.3)] hover:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.06)]">
          <div class="flex-1 min-w-0">
            <h3
              class="text-sm font-semibold text-t-body truncate cursor-pointer transition-colors duration-200 hover:text-t-primary"
              @click="router.push(`/article/${article.id}`)">
              {{ article.title }}
            </h3>
            <div class="flex items-center gap-3 mt-1.5 text-xs text-t-muted">
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
                <span v-if="article.tags.length > 3" class="text-[10px] text-t-muted">
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
          <div v-if="isSelf" class="flex items-center gap-1 shrink-0">
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center text-t-muted hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all duration-200"
              @click="router.push(`/manage/editor/${article.id}`)">
              <Edit class="w-4 h-4" />
            </button>
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center text-t-muted hover:text-t-secondary hover:bg-[rgba(var(--color-secondary-rgb),0.08)] transition-all duration-200"
              @click="confirmDelete(article)">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <Pagination v-if="total > pageSize" :current="currentPage" :total="total" :page-size="pageSize"
          @update:current="handlePageChange" />
      </div>

      <EmptyState v-else :message="emptyMessage">
        <button v-if="isSelf"
          class="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary transition-all duration-300 hover:bg-[rgba(var(--color-primary-rgb),0.2)]"
          @click="router.push('/manage/editor')">
          <Plus class="w-4 h-4" />
          开始写作
        </button>
      </EmptyState>
    </div>

    <ChangePasswordModal v-if="showPasswordModal" @close="showPasswordModal = false" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus, Edit, Trash2, Eye, Clock, FolderOpen, FileText, PenLine, Lock } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { getUserById } from '@/api/user'
import { getArticles, deleteArticle } from '@/api/article'
import { resolveAvatar, handleAvatarError, formatRelativeTime } from '@/utils/format'
import { useToast } from '@/composables/useToast'
import AppLayout from '@/components/layout/AppLayout.vue'
import Pagination from '@/components/ui/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ChangePasswordModal from '@/components/user/ChangePasswordModal.vue'
import heroBg from '@/assets/heros/hero-1.png'
import type { Article } from '@/types/article'
import type { User } from '@/types/user'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

const targetUser = ref<User | null>(null)
const articles = ref<Article[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 10
const loading = ref(false)
const activeTab = ref<string>('all')
const showPasswordModal = ref(false)

const isSelf = computed(() => {
  const routeId = route.params.id
  if (!routeId) return true
  return Number(routeId) === userStore.userId
})

const targetUserId = computed(() => {
  const routeId = route.params.id
  if (!routeId) return userStore.userId
  return Number(routeId)
})

const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '审核中', value: '0' },
  { label: '已发布', value: '1' },
  { label: '草稿', value: '2' },
]

const currentTabLabel = computed(() => {
  return statusTabs.find(t => t.value === activeTab.value)?.label || ''
})

const emptyMessage = computed(() => {
  if (!isSelf.value) return '该用户暂无文章'
  return activeTab.value === 'all' ? '还没有文章' : `还没有${currentTabLabel.value}的文章`
})

async function fetchUser() {
  if (isSelf.value) {
    targetUser.value = {
      id: userStore.userId,
      username: userStore.username,
      nickname: userStore.nickname,
      avatar: userStore.avatar,
      role: userStore.isAdmin ? 0 : 1,
      status: 1,
      lastLoginTime: '',
    }
  } else {
    try {
      const res = await getUserById(targetUserId.value) as unknown as ApiResponse<User>
      targetUser.value = res.data
    } catch {
    }
  }
}

async function fetchArticles() {
  loading.value = true
  try {
    const params: Record<string, any> = {
      createBy: targetUserId.value,
      current: currentPage.value,
      size: pageSize,
    }
    if (isSelf.value && activeTab.value !== 'all') {
      params.status = Number(activeTab.value)
    } else if (!isSelf.value) {
      params.status = 1
    }
    const res = await getArticles(params) as unknown as ApiResponse<PageResult<Article>>
    articles.value = res.data?.records || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

function handleTabChange(tab: string) {
  activeTab.value = tab
  currentPage.value = 1
  fetchArticles()
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchArticles()
}

async function confirmDelete(article: Article) {
  if (!confirm(`确定要删除文章「${article.title}」吗？此操作不可恢复。`)) return
  try {
    await deleteArticle(article.id)
    toast.success('文章已删除')
    fetchArticles()
  } catch {
  }
}

watch(() => route.params.id, () => {
  currentPage.value = 1
  activeTab.value = 'all'
  fetchUser()
  fetchArticles()
})

onMounted(() => {
  fetchUser()
  fetchArticles()
})
</script>
