<template>
  <nav class="md:hidden fixed bottom-0 inset-x-0 z-[55] border-t border-t-border bg-[rgba(var(--color-bg-rgb),0.95)]"
    style="backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding-bottom: env(safe-area-inset-bottom);">
    <div class="flex items-center justify-around h-14">
      <button v-for="item in navItems" :key="item.path"
        class="flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200"
        :class="isActive(item.path) ? 'text-t-primary' : 'text-t-muted'"
        @click="handleClick(item)">
        <component :is="item.icon" class="w-5 h-5" />
        <span class="text-[10px] mt-0.5">{{ item.label }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { Home, LayoutGrid, Search, User, Menu } from 'lucide-vue-next'

interface NavItem {
  path: string
  label: string
  icon: Component
  action?: () => void
}

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const navItems = computed<NavItem[]>(() => [
  { path: '/', label: '首页', icon: Home },
  { path: '/categories', label: '分类', icon: LayoutGrid },
  { path: '/search', label: '搜索', icon: Search },
  { path: '/user/me', label: '我的', icon: User },
  { path: 'menu', label: '菜单', icon: Menu, action: () => appStore.toggleMobileNav() },
])

function isActive(path: string) {
  if (path === 'menu') return appStore.isMobileNavOpen
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function handleClick(item: NavItem) {
  if (item.action) {
    item.action()
    return
  }
  if (item.path === '/user/me' && !route.path.startsWith('/user')) {
    router.push(item.path)
  } else if (item.path !== route.path) {
    router.push(item.path)
  }
}
</script>
