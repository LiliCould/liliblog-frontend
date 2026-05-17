<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  MessageSquare,
  ArrowLeft,
  LogOut,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const menuItems = [
  { name: '仪表盘', path: '/admin', icon: LayoutDashboard },
  { name: '文章管理', path: '/admin/articles', icon: FileText },
  { name: '分类管理', path: '/admin/categories', icon: FolderOpen },
  { name: '标签管理', path: '/admin/tags', icon: Tags },
  { name: '评论管理', path: '/admin/comments', icon: MessageSquare },
]
</script>

<template>
  <div class="min-h-screen flex bg-bg-canvas">
    <!-- 侧边栏 -->
    <aside class="w-64 bg-bg-surface border-r border-border flex-shrink-0">
      <div class="p-6">
        <div class="flex items-center gap-2 mb-8">
          <span class="text-lg font-black text-text-title">立里博客</span>
        </div>

        <nav class="space-y-1">
          <button
            v-for="item in menuItems"
            :key="item.path"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-none',
              $route.path === item.path
                ? 'bg-primary/10 text-primary'
                : 'text-text-body hover:bg-bg-canvas hover:text-text-title',
            ]"
            @click="router.push(item.path)"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.name }}
          </button>
        </nav>
      </div>

      <div class="absolute bottom-0 left-0 w-64 p-6 border-t border-border">
        <button
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-body hover:bg-bg-canvas hover:text-text-title transition-none"
          @click="router.push('/')"
        >
          <ArrowLeft class="w-5 h-5" />
          返回前台
        </button>
        <button
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-body hover:bg-bg-canvas hover:text-text-title transition-none mt-1"
          @click="authStore.logout()"
        >
          <LogOut class="w-5 h-5" />
          退出登录
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 p-8 overflow-auto">
      <slot />
    </main>
  </div>
</template>
