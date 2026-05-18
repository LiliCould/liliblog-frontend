<template>
  <div class="min-h-screen bg-cyber-bg flex">
    <aside class="hidden md:flex flex-col w-60 bg-cyber-surface border-r border-[rgba(0,240,255,0.15)] flex-shrink-0 sticky top-0 h-screen">
      <div class="px-5 py-6 border-b border-[rgba(0,240,255,0.15)]">
        <router-link to="/" class="flex items-center gap-2.5 no-underline group">
          <div class="w-8 h-8 rounded-sm bg-cyber-primary flex items-center justify-center text-white font-bold text-sm [box-shadow:0_0_12px_rgba(0,240,255,0.3)]">
            L
          </div>
          <span class="text-lg font-bold bg-gradient-to-r from-cyber-primary to-cyber-pink bg-clip-text [-webkit-text-fill-color:transparent]">LiliBlog</span>
        </router-link>
      </div>

      <nav class="flex-1 py-4 overflow-y-auto">
        <div class="px-3 mb-2">
          <span class="text-[11px] font-semibold text-cyber-muted uppercase tracking-wider px-3">管理</span>
        </div>
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 mx-3 px-3 py-2.5 rounded-sm text-sm font-medium no-underline transition-all duration-200"
          :class="isActive(item.path) ? 'text-cyber-primary bg-[rgba(0,240,255,0.1)] [box-shadow:inset_2px_0_0_#00f0ff]' : 'text-cyber-body hover:text-cyber-primary hover:bg-[rgba(0,240,255,0.06)]'"
        >
          <component :is="item.icon" class="w-[18px] h-[18px]" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="px-3 py-4 border-t border-[rgba(0,240,255,0.15)]">
        <router-link
          to="/"
          class="flex items-center gap-3 mx-3 px-3 py-2.5 rounded-sm text-sm font-medium text-cyber-muted no-underline transition-all duration-200 hover:text-cyber-primary hover:bg-[rgba(0,240,255,0.06)]"
        >
          <ArrowLeft class="w-[18px] h-[18px]" />
          <span>返回前台</span>
        </router-link>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <header class="sticky top-0 z-40 h-14 bg-[rgba(10,10,15,0.9)] border-b border-[rgba(0,240,255,0.15)] flex items-center justify-between px-6"
        style="backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
      >
        <div class="flex items-center gap-3">
          <button class="md:hidden flex items-center justify-center w-9 h-9 text-cyber-body rounded-sm transition-colors duration-200 hover:text-cyber-primary hover:bg-[rgba(0,240,255,0.06)] cursor-pointer" @click="sidebarOpen = !sidebarOpen">
            <Menu class="w-5 h-5" />
          </button>
          <h1 class="text-base font-semibold text-cyber-title m-0">{{ pageTitle }}</h1>
        </div>
        <div class="flex items-center gap-3">
          <div v-if="userStore.isLoggedIn" class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-cyber-primary flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
              <img v-if="userStore.avatar" :src="userStore.avatar" alt="" class="w-full h-full object-cover" />
              <span v-else>{{ userStore.nickname?.charAt(0) || 'U' }}</span>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-6">
        <slot></slot>
      </main>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="sidebarOpen" class="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.6)] md:hidden" @click="sidebarOpen = false"></div>
      </Transition>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div v-if="sidebarOpen" class="fixed top-0 left-0 bottom-0 w-60 z-[70] bg-cyber-surface border-r border-[rgba(0,240,255,0.15)] flex flex-col md:hidden">
          <div class="px-5 py-6 border-b border-[rgba(0,240,255,0.15)] flex items-center justify-between">
            <router-link to="/" class="flex items-center gap-2.5 no-underline" @click="sidebarOpen = false">
              <div class="w-8 h-8 rounded-sm bg-cyber-primary flex items-center justify-center text-white font-bold text-sm">L</div>
              <span class="text-lg font-bold bg-gradient-to-r from-cyber-primary to-cyber-pink bg-clip-text [-webkit-text-fill-color:transparent]">LiliBlog</span>
            </router-link>
            <button class="flex items-center justify-center w-8 h-8 text-cyber-muted cursor-pointer transition-colors duration-200 hover:text-cyber-primary" @click="sidebarOpen = false">
              <X class="w-5 h-5" />
            </button>
          </div>

          <nav class="flex-1 py-4 overflow-y-auto">
            <div class="px-3 mb-2">
              <span class="text-[11px] font-semibold text-cyber-muted uppercase tracking-wider px-3">管理</span>
            </div>
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3 mx-3 px-3 py-2.5 rounded-sm text-sm font-medium no-underline transition-all duration-200"
              :class="isActive(item.path) ? 'text-cyber-primary bg-[rgba(0,240,255,0.1)] [box-shadow:inset_2px_0_0_#00f0ff]' : 'text-cyber-body hover:text-cyber-primary hover:bg-[rgba(0,240,255,0.06)]'"
              @click="sidebarOpen = false"
            >
              <component :is="item.icon" class="w-[18px] h-[18px]" />
              <span>{{ item.label }}</span>
            </router-link>
          </nav>

          <div class="px-3 py-4 border-t border-[rgba(0,240,255,0.15)]">
            <router-link
              to="/"
              class="flex items-center gap-3 mx-3 px-3 py-2.5 rounded-sm text-sm font-medium text-cyber-muted no-underline transition-all duration-200 hover:text-cyber-primary hover:bg-[rgba(0,240,255,0.06)]"
              @click="sidebarOpen = false"
            >
              <ArrowLeft class="w-[18px] h-[18px]" />
              <span>返回前台</span>
            </router-link>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { LayoutDashboard, FileText, FolderOpen, Tag, MessageSquare, ArrowLeft, Menu, X } from 'lucide-vue-next'

const route = useRoute()
const userStore = useUserStore()
const sidebarOpen = ref(false)

const navItems = [
  { path: '/admin', label: '仪表盘', icon: LayoutDashboard },
  { path: '/admin/articles', label: '文章管理', icon: FileText },
  { path: '/admin/categories', label: '分类管理', icon: FolderOpen },
  { path: '/admin/tags', label: '标签管理', icon: Tag },
  { path: '/admin/comments', label: '评论管理', icon: MessageSquare },
]

const pageTitle = computed(() => {
  const item = navItems.find(n => route.path === n.path || (n.path !== '/admin' && route.path.startsWith(n.path)))
  return item?.label || '后台管理'
})

function isActive(path: string) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>
