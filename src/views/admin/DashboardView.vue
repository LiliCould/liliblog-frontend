<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllCategories, getAllTags } from '@/api'

import { FileText, Tags, FolderOpen, MessageSquare } from 'lucide-vue-next'

const router = useRouter()

const stats = ref({
  articles: 0,
  categories: 0,
  tags: 0,
  comments: 0,
})

const fetchStats = async () => {
  try {
    const [catRes, tagRes] = await Promise.all([
      getAllCategories(),
      getAllTags(),
    ])
    stats.value.categories = catRes.data.length
    stats.value.tags = tagRes.data.length
  } catch (error) {
    console.error('获取统计数据失败', error)
  }
}

const menuItems = [
  { name: '文章管理', path: '/admin/articles', icon: FileText, color: 'bg-primary/10 text-primary' },
  { name: '分类管理', path: '/admin/categories', icon: FolderOpen, color: 'bg-accent-toxic/10 text-accent-toxic' },
  { name: '标签管理', path: '/admin/tags', icon: Tags, color: 'bg-accent-amber/10 text-accent-amber' },
  { name: '评论管理', path: '/admin/comments', icon: MessageSquare, color: 'bg-accent-rose/10 text-accent-rose' },
]

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-text-title mb-6">仪表盘</h1>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        v-for="item in menuItems"
        :key="item.path"
        class="bg-bg-surface rounded-2xl p-5 card-shadow cursor-pointer transition-none hover:card-shadow-hover"
        @click="router.push(item.path)"
      >
        <div class="flex items-center gap-3 mb-3">
          <div :class="['p-2 rounded-xl', item.color]">
            <component :is="item.icon" class="w-5 h-5" />
          </div>
        </div>
        <p class="text-sm text-text-meta">{{ item.name }}</p>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="bg-bg-surface rounded-2xl p-6 card-shadow">
      <h2 class="text-lg font-bold text-text-title mb-4">快捷操作</h2>
      <div class="flex flex-wrap gap-3">
        <button
          class="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-none"
          @click="router.push('/write')"
        >
          写文章
        </button>
        <button
          class="px-4 py-2 bg-bg-canvas border border-border text-text-body rounded-xl text-sm font-medium hover:bg-bg-surface transition-none"
          @click="router.push('/register')"
        >
          注册新用户
        </button>
      </div>
    </div>
  </div>
</template>
