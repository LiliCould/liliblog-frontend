<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import {
  Home,
  User,
  Settings,
  LogIn,
  LogOut,
  Sun,
  Moon,
  PenLine,
  Shield,
  Rss,
} from 'lucide-vue-next'

const authStore = useAuthStore()
const themeStore = useThemeStore()
</script>

<template>
  <nav class="space-y-1">
    <router-link
      to="/"
      class="flex items-center gap-3 px-4 py-3 rounded-xl text-text-body hover:bg-bg-surface hover:text-text-title transition-none"
      :class="{ 'bg-bg-surface text-text-title font-semibold': $route.path === '/' }"
    >
      <Home class="w-5 h-5" />
      <span>首页</span>
    </router-link>

    <router-link
      v-if="authStore.isLoggedIn"
      to="/user/me"
      class="flex items-center gap-3 px-4 py-3 rounded-xl text-text-body hover:bg-bg-surface hover:text-text-title transition-none"
      :class="{ 'bg-bg-surface text-text-title font-semibold': $route.path === '/user/me' }"
    >
      <User class="w-5 h-5" />
      <span>我的文章</span>
    </router-link>

    <router-link
      v-if="authStore.isLoggedIn"
      to="/settings"
      class="flex items-center gap-3 px-4 py-3 rounded-xl text-text-body hover:bg-bg-surface hover:text-text-title transition-none"
      :class="{ 'bg-bg-surface text-text-title font-semibold': $route.path === '/settings' }"
    >
      <Settings class="w-5 h-5" />
      <span>账号设置</span>
    </router-link>

    <router-link
      v-if="authStore.isAdmin"
      to="/write"
      class="flex items-center gap-3 px-4 py-3 rounded-xl text-text-body hover:bg-bg-surface hover:text-text-title transition-none"
      :class="{ 'bg-bg-surface text-text-title font-semibold': $route.path === '/write' }"
    >
      <PenLine class="w-5 h-5" />
      <span>写文章</span>
    </router-link>

    <router-link
      v-if="authStore.isAdmin"
      to="/admin"
      class="flex items-center gap-3 px-4 py-3 rounded-xl text-text-body hover:bg-bg-surface hover:text-text-title transition-none"
      :class="{ 'bg-bg-surface text-text-title font-semibold': $route.path.startsWith('/admin') }"
    >
      <Shield class="w-5 h-5" />
      <span>后台管理</span>
    </router-link>

    <router-link
      to="/about"
      class="flex items-center gap-3 px-4 py-3 rounded-xl text-text-body hover:bg-bg-surface hover:text-text-title transition-none"
      :class="{ 'bg-bg-surface text-text-title font-semibold': $route.path === '/about' }"
    >
      <Rss class="w-5 h-5" />
      <span>关于</span>
    </router-link>

    <div class="pt-4 border-t border-border mt-4">
      <button
        v-if="authStore.isLoggedIn"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-text-body hover:bg-bg-surface hover:text-text-title transition-none w-full text-left"
        @click="authStore.logout()"
      >
        <LogOut class="w-5 h-5" />
        <span>退出登录</span>
      </button>

      <router-link
        v-else
        to="/login"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-text-body hover:bg-bg-surface hover:text-text-title transition-none"
      >
        <LogIn class="w-5 h-5" />
        <span>登录</span>
      </router-link>

      <button
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-text-body hover:bg-bg-surface hover:text-text-title transition-none w-full text-left mt-1"
        @click="themeStore.toggleTheme()"
      >
        <Sun v-if="themeStore.isDark" class="w-5 h-5" />
        <Moon v-else class="w-5 h-5" />
        <span>{{ themeStore.isDark ? '亮色模式' : '暗色模式' }}</span>
      </button>
    </div>
  </nav>
</template>
