<template>
  <div class="min-h-screen bg-t-bg flex">
    <aside class="hidden md:flex flex-col w-60 bg-t-surface border-r border-t-border flex-shrink-0 sticky top-0 h-screen">
      <div class="px-5 py-5 border-b border-t-border">
        <NuxtLink to="/" class="flex items-center gap-2.5 no-underline group">
          <img :src="logoSvg" alt="LiliBlog" class="h-[52px] w-auto" />
        </NuxtLink>
      </div>

      <nav class="flex-1 py-4 overflow-y-auto">
        <div class="px-3 mb-2">
          <span class="text-[11px] font-semibold text-t-muted uppercase tracking-wider px-3">管理</span>
        </div>
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 mx-3 px-3 py-2 text-sm font-medium no-underline transition-all duration-200"
          :class="isActive(item.path)
            ? 'text-t-primary bg-[rgba(var(--color-primary-rgb),0.1)] [box-shadow:inset_2px_0_0_var(--color-primary)]'
            : 'text-t-body hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)]'"
        >
          <component :is="item.icon" class="w-[18px] h-[18px]" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="px-3 py-4 border-t border-t-border">
        <NuxtLink to="/" class="flex items-center gap-3 mx-3 px-3 py-2 text-sm font-medium text-t-muted no-underline transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)]">
          <ArrowLeft class="w-[18px] h-[18px]" />
          <span>返回前台</span>
        </NuxtLink>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <header class="sticky top-0 z-40 h-14 bg-[rgba(var(--color-bg-rgb),0.9)] border-b border-t-border flex items-center justify-between px-3 md:px-6" style="backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
        <div class="flex items-center gap-3">
          <button class="md:hidden flex items-center justify-center w-9 h-9 text-t-body transition-colors duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] cursor-pointer" aria-label="打开菜单" @click="sidebarOpen = !sidebarOpen">
            <Menu class="w-5 h-5" />
          </button>
          <h1 class="text-base font-semibold text-t-title m-0">{{ pageTitle }}</h1>
        </div>
        <div class="flex items-center gap-3">
          <div v-if="userStore.isLoggedIn" class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-t-primary-fill flex items-center justify-center text-t-on-primary text-xs font-semibold overflow-hidden">
              <img :src="resolveAvatar(userStore.avatar)" alt="" class="w-full h-full object-cover" @error="handleAvatarError" />
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-3 md:p-6">
        <slot />
      </main>
    </div>

    <Teleport to="body">
      <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="sidebarOpen" class="fixed inset-0 z-[60] bg-[var(--color-scrim)] md:hidden" @click="sidebarOpen = false" />
      </Transition>

      <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="-translate-x-full" enter-to-class="translate-x-0" leave-active-class="transition duration-200 ease-in" leave-from-class="translate-x-0" leave-to-class="-translate-x-full">
        <div v-if="sidebarOpen" class="fixed top-0 left-0 bottom-0 w-60 z-[70] bg-t-surface border-r border-t-border flex flex-col md:hidden">
          <div class="px-5 py-5 border-b border-t-border flex items-center justify-between">
            <NuxtLink to="/" class="flex items-center gap-2.5 no-underline" @click="sidebarOpen = false">
              <img :src="logoSvg" alt="LiliBlog" class="h-[52px] w-auto" />
            </NuxtLink>
            <button class="flex items-center justify-center w-8 h-8 text-t-muted cursor-pointer transition-colors duration-200 hover:text-t-primary" aria-label="关闭菜单" @click="sidebarOpen = false">
              <X class="w-5 h-5" />
            </button>
          </div>

          <nav class="flex-1 py-4 overflow-y-auto">
            <div class="px-3 mb-2">
              <span class="text-[11px] font-semibold text-t-muted uppercase tracking-wider px-3">管理</span>
            </div>
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3 mx-3 px-3 py-2.5 text-sm font-medium no-underline transition-all duration-200"
              :class="isActive(item.path)
                ? 'text-t-primary bg-[rgba(var(--color-primary-rgb),0.1)] [box-shadow:inset_2px_0_0_var(--color-primary)]'
                : 'text-t-body hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)]'"
              @click="sidebarOpen = false"
            >
              <component :is="item.icon" class="w-[18px] h-[18px]" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </nav>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowLeft,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Menu,
  MessageSquare,
  ScrollText,
  Tag,
  Users,
  X,
} from 'lucide-vue-next'
import logoSvg from '~/assets/logo.svg'
import { handleAvatarError, resolveAvatar } from '~/utils/format'

const route = useRoute()
const userStore = useUserStore()
const sidebarOpen = ref(false)

const navItems = [
  { path: '/admin', label: '仪表盘', icon: LayoutDashboard },
  { path: '/admin/articles', label: '文章管理', icon: FileText },
  { path: '/admin/categories', label: '分类管理', icon: FolderOpen },
  { path: '/admin/tags', label: '标签管理', icon: Tag },
  { path: '/admin/comments', label: '评论管理', icon: MessageSquare },
  { path: '/admin/users', label: '用户管理', icon: Users },
  { path: '/admin/audit-logs', label: '审计日志', icon: ScrollText },
]

const pageTitle = computed(() => {
  const item = navItems.find(nav => route.path === nav.path || (nav.path !== '/admin' && route.path.startsWith(nav.path)))
  return item?.label || '后台管理'
})

function isActive(path: string): boolean {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>
