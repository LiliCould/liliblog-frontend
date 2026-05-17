<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { Menu, Search } from 'lucide-vue-next'
import MobileDrawer from './MobileDrawer.vue'

const authStore = useAuthStore()
const router = useRouter()

const mobileMenuOpen = ref(false)
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/?search=${encodeURIComponent(searchQuery.value.trim())}`)
    searchQuery.value = ''
  }
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-bg-canvas/80 backdrop-blur-md border-b border-border">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2">
          <span class="text-xl font-black text-text-title tracking-tight">立里博客</span>
        </router-link>

        <!-- 搜索框（桌面端） -->
        <div class="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章..."
              class="w-full pl-10 pr-4 py-2 bg-bg-surface border border-border rounded-full text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary"
              @keyup.enter="handleSearch"
            />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-meta" />
          </div>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center gap-3">
          <!-- 移动端汉堡菜单按钮 -->
          <button
            class="md:hidden p-2 rounded-lg text-text-body hover:bg-bg-surface"
            @click="mobileMenuOpen = true"
          >
            <Menu class="w-6 h-6" />
          </button>

          <!-- 桌面端用户头像 -->
          <router-link
            v-if="authStore.isLoggedIn && authStore.userInfo"
            to="/user/me"
            class="hidden md:flex items-center gap-2"
          >
            <img
              :src="authStore.userInfo.avatar || '/favicon.svg'"
              :alt="authStore.userInfo.nickname"
              class="w-8 h-8 rounded-full object-cover border border-border"
            />
          </router-link>

          <router-link
            v-else
            to="/login"
            class="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-none"
          >
            登录
          </router-link>
        </div>
      </div>
    </div>

    <!-- 移动端抽屉 -->
    <MobileDrawer v-model:open="mobileMenuOpen" />
  </header>
</template>
