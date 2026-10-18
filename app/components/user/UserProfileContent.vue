<template>
  <div>
  <AppLayout :show-hero="false">
    <div class="max-w-4xl mx-auto">
      <div class="rounded-xl bg-t-surface border border-t-border overflow-hidden mb-8">
        <div class="h-24 md:h-32 relative">
          <img :src="heroBg" alt="" class="absolute inset-0 w-full h-full object-cover opacity-25" width="1600" height="877" loading="lazy" decoding="async" />
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-t-surface" />
        </div>
        <div class="px-4 md:px-6 pb-6 -mt-10 md:-mt-12 relative z-10">
          <div class="flex items-end gap-3 md:gap-5 max-md:flex-col max-md:items-start">
            <div class="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-t-surface border-2 border-t-primary flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(var(--color-surface-rgb),0.95)] flex-shrink-0">
              <img :src="resolveAvatar(user?.avatar)" alt="" class="w-full h-full object-cover" @error="handleAvatarError" />
            </div>
            <div class="flex-1 min-w-0 pb-1">
              <div class="flex items-center gap-3 flex-wrap">
                <h1 class="text-xl md:text-2xl font-bold text-t-title">{{ user?.nickname || '用户' }}</h1>
                <span class="text-sm text-t-muted">@{{ user?.username }}</span>
              </div>
              <div v-if="user?.email" class="flex items-center gap-1.5 mt-1.5">
                <Mail class="w-3.5 h-3.5 text-t-muted" />
                <span class="text-sm text-t-muted">{{ user.email }}</span>
              </div>
            </div>
            <div v-if="self" class="flex items-center gap-2 flex-shrink-0 pb-1 max-md:w-full max-md:mt-2">
              <button class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(var(--color-primary-rgb),0.1)] border border-[rgba(var(--color-primary-rgb),0.2)] text-t-primary transition-[background-color,box-shadow] duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.18)] hover:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.12)] max-md:flex-1" @click="router.push('/profile/edit')">
                <PenLine class="w-3 h-3" />
                编辑资料
              </button>
              <button class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(var(--color-secondary-rgb),0.08)] border border-[rgba(var(--color-secondary-rgb),0.2)] text-t-secondary transition-[background-color,box-shadow] duration-200 hover:bg-[rgba(var(--color-secondary-rgb),0.15)] hover:shadow-[0_0_8px_rgba(var(--color-secondary-rgb),0.12)] max-md:flex-1" @click="showPasswordModal = true">
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
          <h2 class="text-lg font-semibold text-t-title">{{ self ? '我的文章' : '已发布文章' }}</h2>
        </div>
        <button v-if="self" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary transition-[background-color,box-shadow] duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.2)] hover:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.15)]" @click="openWrite">
          <Plus class="w-3.5 h-3.5" />
          写文章
        </button>
      </div>

      <div v-if="self" class="flex gap-2 mb-6 overflow-x-auto scrollbar-hide flex-nowrap">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-[background-color,border-color,color,box-shadow] duration-200 shrink-0"
          :class="activeTab === tab.value
            ? 'bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)]'
            : 'border border-t-border text-t-muted hover:text-t-body hover:border-[rgba(var(--color-primary-rgb),0.3)]'"
          @click="handleTabChange(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="pending && articles.length === 0" class="flex flex-col gap-3">
        <div v-for="i in 3" :key="i" class="h-20 rounded-xl bg-t-surface animate-pulse" />
      </div>

      <div v-else-if="articles.length > 0" class="flex flex-col gap-3">
        <div v-for="article in articles" :key="article.id" class="flex items-center justify-between gap-4 p-4 rounded-xl bg-t-surface border border-t-border transition-[border-color,box-shadow] duration-200 hover:border-[rgba(var(--color-primary-rgb),0.3)] hover:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.06)]">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <NuxtLink :to="`/article/${encodeURIComponent(article.slug)}`" class="text-sm font-semibold text-t-body truncate no-underline transition-[color] duration-200 hover:text-t-primary">
                {{ article.title }}
              </NuxtLink>
              <span v-if="self" class="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0" :class="articleStatusClass(article.status)">
                {{ articleStatusText(article.status) }}
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5 text-xs text-t-muted">
              <span class="flex items-center gap-1">
                <FolderOpen class="w-3 h-3" />
                {{ article.category?.name || '未分类' }}
              </span>
              <template v-if="article.tags?.length">
                <span v-for="tag in article.tags.slice(0, 3)" :key="tag.id" class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0" :style="{ backgroundColor: tag.color ? `${tag.color}18` : 'rgba(var(--color-primary-rgb),0.08)', color: tag.color || 'var(--color-primary)' }">
                  #{{ tag.name }}
                </span>
                <span v-if="article.tags.length > 3" class="text-[10px] text-t-muted shrink-0">+{{ article.tags.length - 3 }}</span>
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
          <div v-if="self" class="flex items-center gap-1 shrink-0">
            <button class="w-9 h-9 rounded flex items-center justify-center text-t-muted hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-[color,background-color] duration-200" aria-label="编辑文章" @click="openWriteEdit(article.id)">
              <Edit class="w-4 h-4" />
            </button>
            <button class="w-9 h-9 rounded flex items-center justify-center text-t-muted hover:text-[#f43f5e] hover:bg-[rgba(244,63,94,0.08)] transition-[color,background-color] duration-200" aria-label="删除文章" @click="confirmDelete(article)">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <Pagination v-if="total > 0" :current="currentPage" :total="total" :page-size="pageSize" @update:current="handlePageChange" @update:page-size="handlePageSizeChange" />
      </div>

      <EmptyState v-else :message="emptyMessage">
        <button v-if="self" class="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary transition-[background-color] duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.2)]" @click="openWrite">
          <Plus class="w-3.5 h-3.5" />
          开始写作
        </button>
      </EmptyState>
    </div>

  </AppLayout>

  <ChangePasswordModal v-if="self" v-model:open="showPasswordModal" />

  <AppConfirmDialog
    v-if="self"
    v-model:open="showDeleteConfirm"
    title="确认删除"
    :description="`确定要删除文章「${deleteTarget?.title || ''}」吗？此操作不可恢复。`"
    confirm-text="确认删除"
    danger
    @confirm="doDelete"
  />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Clock, Edit, Eye, FileText, FolderOpen, Lock, Mail, PenLine, Plus, Trash2 } from 'lucide-vue-next'
import type { Article, User } from '~/types'
import { formatRelativeTime, handleAvatarError, resolveAvatar } from '~/utils/format'
import request from '~/utils/request'
import heroBg from '~/assets/hero-bg.webp'

const props = defineProps<{
  user: User | null
  articles: Article[]
  total: number
  pending: boolean
  self: boolean
  activeTab: string
  currentPage: number
  pageSize: number
}>()

const emit = defineEmits<{
  'update:activeTab': [value: string]
  'update:currentPage': [value: number]
  'update:pageSize': [value: number]
  refresh: []
}>()

const router = useRouter()
const toast = useToast()

const showPasswordModal = ref(false)
const showDeleteConfirm = ref(false)
const deleteTarget = ref<Article | null>(null)

const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '审核中', value: '0' },
  { label: '已发布', value: '1' },
  { label: '草稿', value: '2' },
]

const currentTabLabel = computed(() => statusTabs.find(tab => tab.value === props.activeTab)?.label || '')

const emptyMessage = computed(() => {
  if (!props.self) return '该用户暂无文章'
  return props.activeTab === 'all' ? '还没有文章' : `还没有${currentTabLabel.value}的文章`
})

function articleStatusText(status: number): string {
  const map: Record<number, string> = { 0: '审核中', 1: '已发布', 2: '草稿' }
  return map[status] || '未知'
}

function articleStatusClass(status: number): string {
  if (status === 1) return 'bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary border border-[rgba(var(--color-primary-rgb),0.3)]'
  if (status === 0) return 'bg-[rgba(255,170,0,0.1)] text-[#ffaa00] border border-[rgba(255,170,0,0.3)]'
  return 'bg-[rgba(107,114,128,0.1)] text-t-muted border border-[rgba(107,114,128,0.3)]'
}

function openWrite(): void {
  if (import.meta.client) window.open('/write', '_blank')
}

function openWriteEdit(id: number): void {
  if (import.meta.client) window.open(`/write/${id}`, '_blank')
}

function handleTabChange(tab: string): void {
  emit('update:activeTab', tab)
  emit('update:currentPage', 1)
}

function handlePageChange(page: number): void {
  emit('update:currentPage', page)
}

function handlePageSizeChange(size: number): void {
  emit('update:pageSize', size)
  emit('update:currentPage', 1)
}

function confirmDelete(article: Article): void {
  deleteTarget.value = article
  showDeleteConfirm.value = true
}

async function doDelete(): Promise<void> {
  if (!deleteTarget.value) return
  try {
    await request.delete(`/api/article/${deleteTarget.value.id}`)
    toast.success('文章已删除')
    showDeleteConfirm.value = false
    deleteTarget.value = null
    emit('refresh')
  } catch {
    // handled by interceptor
  }
}
</script>
