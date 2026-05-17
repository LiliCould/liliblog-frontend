<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tag,
  MessageSquare,
  Sun,
  Moon,
  LogOut,
  ArrowLeft,
} from 'lucide-vue-next'

/**
 * 后台管理布局组件
 * 左侧 Sidebar 导航 + 右侧内容区
 */
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// 导航菜单
const navItems = computed(() => [
  { name: '仪表盘', path: '/admin', icon: LayoutDashboard },
  { name: '文章管理', path: '/admin/articles', icon: FileText },
  { name: '分类管理', path: '/admin/categories', icon: FolderOpen },
  { name: '标签管理', path: '/admin/tags', icon: Tag },
  { name: '评论管理', path: '/admin/comments', icon: MessageSquare },
])

// 判断当前路由是否激活
const isActive = (path: string) => route.path === path

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen">
    <!-- 左侧 Sidebar -->
    <aside
      class="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r-2 border-black bg-[var(--neutral-50)] dark:border-[var(--neutral-800)] dark:bg-[var(--background)]"
    >
      <!-- Logo -->
      <div class="flex h-14 items-center border-b-2 border-black px-4 dark:border-[var(--neutral-800)]">
        <router-link
          to="/"
          class="flex items-center gap-2 text-lg font-black"
          :style="{ color: 'var(--accent-toxic)' }"
        >
          <ArrowLeft class="h-5 w-5" />
          LiliBlog
        </router-link>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 space-y-1 p-4">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2 text-sm font-semibold"
          :class="{
            'bg-[var(--accent-toxic)] text-black': isActive(item.path),
          }"
        >
          <component :is="item.icon" class="h-5 w-5" />
          {{ item.name }}
        </router-link>
      </nav>

      <!-- 底部操作 -->
      <div class="border-t-2 border-black p-4 dark:border-[var(--neutral-800)]">
        <div class="flex items-center justify-between">
          <button
            class="p-1"
            @click="themeStore.toggleTheme"
          >
            <Sun v-if="themeStore.isDark" class="h-5 w-5" />
            <Moon v-else class="h-5 w-5" />
          </button>
          <button
            class="flex items-center gap-2 text-sm"
            @click="handleLogout"
          >
            <LogOut class="h-4 w-4" />
            退出
          </button>
        </div>
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <main class="ml-64 flex-1 p-6">
      <slot />
    </main>
  </div>
</template>
