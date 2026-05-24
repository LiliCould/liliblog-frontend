<template>
  <AppLayout :show-hero="false">
    <div class="max-w-4xl mx-auto">
      <div class="rounded-xl bg-t-surface border border-t-border overflow-hidden mb-8">
        <div class="h-32 relative">
          <img :src="heroBg" alt="" class="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-t-surface"></div>
        </div>
        <div class="px-6 pb-6 -mt-12 relative z-10">
          <div class="flex items-end gap-5">
            <div
              class="w-24 h-24 rounded-2xl bg-t-surface border-2 border-t-primary flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(var(--color-surface-rgb),0.95)] flex-shrink-0">
              <img :src="resolveAvatar(targetUser?.avatar)" alt="" class="w-full h-full object-cover"
                @error="handleAvatarError" />
            </div>
            <div class="flex-1 min-w-0 pb-1">
              <div class="flex items-center gap-3 flex-wrap">
                <h1 class="text-2xl font-bold text-t-title">{{ targetUser?.nickname || '用户' }}</h1>
                <span class="text-sm text-t-muted">@{{ targetUser?.username }}</span>
              </div>
              <div v-if="targetUser?.email" class="flex items-center gap-1.5 mt-1.5">
                <Mail class="w-3.5 h-3.5 text-t-muted" />
                <span class="text-sm text-t-muted">{{ targetUser.email }}</span>
              </div>
            </div>
            <div v-if="isSelf" class="flex items-center gap-2 flex-shrink-0 pb-1">
              <button
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(var(--color-primary-rgb),0.1)] border border-[rgba(var(--color-primary-rgb),0.2)] text-t-primary transition-[background-color,box-shadow] duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.18)] hover:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.12)]"
                @click="router.push('/profile/edit')">
                <PenLine class="w-3 h-3" />
                编辑资料
              </button>
              <button
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(var(--color-secondary-rgb),0.08)] border border-[rgba(var(--color-secondary-rgb),0.2)] text-t-secondary transition-[background-color,box-shadow] duration-200 hover:bg-[rgba(var(--color-secondary-rgb),0.15)] hover:shadow-[0_0_8px_rgba(var(--color-secondary-rgb),0.12)]"
                @click="showPasswordModal = true">
                <Lock class="w-3 h-3" />
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
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary transition-[background-color,box-shadow] duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.2)] hover:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.15)]"
          @click="router.push('/write')">
          <Plus class="w-3.5 h-3.5" />
          写文章
        </button>
      </div>

      <div v-if="isSelf" class="flex gap-2 mb-6">
        <button v-for="tab in statusTabs" :key="tab.value"
          class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-[background-color,border-color,color,box-shadow] duration-200"
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
          class="flex items-center justify-between gap-4 p-4 rounded-xl bg-t-surface border border-t-border transition-[border-color,box-shadow] duration-200 hover:border-[rgba(var(--color-primary-rgb),0.3)] hover:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.06)]">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3
                class="text-sm font-semibold text-t-body truncate cursor-pointer transition-[color] duration-200 hover:text-t-primary"
                @click="router.push(`/article/${article.id}`)">
                {{ article.title }}
              </h3>
              <span v-if="isSelf" class="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0"
                :class="articleStatusClass(article.status)">
                {{ articleStatusText(article.status) }}
              </span>
            </div>
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
              class="w-7 h-7 rounded flex items-center justify-center text-t-muted hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-[color,background-color] duration-200"
              aria-label="编辑文章"
              @click="router.push(`/write/${article.id}`)">
              <Edit class="w-3.5 h-3.5" />
            </button>
            <button
              class="w-7 h-7 rounded flex items-center justify-center text-t-muted hover:text-[#f43f5e] hover:bg-[rgba(244,63,94,0.08)] transition-[color,background-color] duration-200"
              aria-label="删除文章"
              @click="confirmDelete(article)">
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <Pagination v-if="total > 0" :current="currentPage" :total="total" :page-size="pageSize"
          @update:current="handlePageChange" @update:page-size="handlePageSizeChange" />
      </div>

      <EmptyState v-else :message="emptyMessage">
        <button v-if="isSelf"
          class="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary transition-[background-color] duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.2)]"
          @click="router.push('/write')">
          <Plus class="w-3.5 h-3.5" />
          开始写作
        </button>
      </EmptyState>
    </div>

    <ChangePasswordModal v-if="showPasswordModal" @close="showPasswordModal = false" />
  </AppLayout>

  <Teleport to="body">
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-[1200] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.stop></div>
      <div class="relative bg-t-surface border border-t-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <button
          class="absolute top-4 right-4 w-7 h-7 rounded flex items-center justify-center text-t-muted hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-[background-color] duration-200"
          @click="showDeleteConfirm = false; deleteTarget = null">
          <X class="w-4 h-4" />
        </button>
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-[rgba(244,63,94,0.1)] flex items-center justify-center flex-shrink-0">
            <AlertTriangle class="w-5 h-5 text-[#f43f5e]" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-base font-semibold text-t-title">确认删除</h3>
            <p class="mt-2 text-sm text-t-muted">
              确定要删除文章「<span class="text-t-body font-medium">{{ deleteTarget?.title }}</span>」吗？此操作不可恢复。
            </p>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 mt-6">
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium text-t-muted border border-t-border hover:text-t-body transition-[color] duration-200"
            @click="showDeleteConfirm = false; deleteTarget = null">
            取消
          </button>
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium bg-[#f43f5e] text-white hover:opacity-90 transition-[opacity] duration-200"
            @click="doDelete">
            确认删除
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus, Edit, Trash2, Eye, Clock, FolderOpen, FileText, PenLine, Lock, Mail, AlertTriangle, X } from 'lucide-vue-next'
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
const pageSize = ref(10)
const loading = ref(false)
const activeTab = ref<string>('all')
const showPasswordModal = ref(false)
const showDeleteConfirm = ref(false)
const deleteTarget = ref<Article | null>(null)

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

function articleStatusText(status: number) {
  const map: Record<number, string> = { 0: '审核中', 1: '已发布', 2: '草稿' }
  return map[status] || '未知'
}

function articleStatusClass(status: number) {
  if (status === 1) return 'bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary border border-[rgba(var(--color-primary-rgb),0.3)]'
  if (status === 0) return 'bg-[rgba(255,170,0,0.1)] text-[#ffaa00] border border-[rgba(255,170,0,0.3)]'
  return 'bg-[rgba(107,114,128,0.1)] text-t-muted border border-[rgba(107,114,128,0.3)]'
}

async function fetchUser() {
  if (isSelf.value) {
    targetUser.value = {
      id: userStore.userId,
      username: userStore.username,
      nickname: userStore.nickname,
      avatar: userStore.avatar,
      email: userStore.userInfo?.email || '',
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
      size: pageSize.value,
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

function handlePageSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  fetchArticles()
}

function confirmDelete(article: Article) {
  deleteTarget.value = article
  showDeleteConfirm.value = true
}

async function doDelete() {
  if (!deleteTarget.value) return
  try {
    await deleteArticle(deleteTarget.value.id)
    toast.success('文章已删除')
    fetchArticles()
  } catch {}
  showDeleteConfirm.value = false
  deleteTarget.value = null
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
