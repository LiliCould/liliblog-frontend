<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useAppStore } from '@/stores/app'
import { Menu, Sun, Moon, LogOut, User, Settings, PenLine, Shield } from 'lucide-vue-next'

/**
 * 顶部导航栏组件
 * 包含 Logo、导航链接、主题切换、用户菜单
 */
const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const appStore = useAppStore()

const navLinks = computed(() => [
  { name: '首页', path: '/' },
  { name: '分类', path: '/category/all' },
  { name: '标签', path: '/tag/all' },
  { name: '关于', path: '/about' },
])

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

// 用户菜单显示状态
const showUserMenu = ref(false)
let menuHideTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 显示用户菜单
 * 清除隐藏定时器，防止菜单闪烁
 */
const handleMouseEnter = () => {
  if (menuHideTimer) {
    clearTimeout(menuHideTimer)
    menuHideTimer = null
  }
  showUserMenu.value = true
}

/**
 * 延迟隐藏用户菜单
 * 设置1.5秒延迟，给用户足够时间移动鼠标到菜单区域
 */
const handleMouseLeave = () => {
  menuHideTimer = setTimeout(() => {
    showUserMenu.value = false
  }, 1500)
}

/**
 * 立即隐藏用户菜单
 * 用于点击菜单项后关闭菜单
 */
const hideMenu = () => {
  showUserMenu.value = false
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b-2 border-black bg-[var(--neutral-50)] dark:border-[var(--neutral-800)] dark:bg-[var(--background)]"
  >
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
      <!-- 左侧：汉堡菜单 + Logo -->
      <div class="flex items-center gap-4">
        <button
          class="md:hidden"
          @click="appStore.toggleSidebar"
        >
          <Menu class="h-5 w-5" />
        </button>
        <router-link
          to="/"
          class="text-xl font-black tracking-tight"
          :style="{ color: 'var(--accent-toxic)' }"
        >
          LiliBlog
        </router-link>
      </div>

      <!-- 中间：导航链接 -->
      <nav class="hidden items-center gap-6 md:flex">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="text-sm font-semibold"
        >
          {{ link.name }}
        </router-link>
      </nav>

      <!-- 右侧：主题切换 + 用户菜单 -->
      <div class="flex items-center gap-3">
        <!-- 主题切换按钮 -->
        <button
          class="p-1"
          @click="themeStore.toggleTheme"
        >
          <Sun v-if="themeStore.isDark" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5" />
        </button>

        <!-- 未登录：登录按钮 -->
        <router-link
          v-if="!authStore.isLoggedIn"
          to="/login"
          class="border-2 border-black px-3 py-1 text-sm font-bold dark:border-white"
        >
          登录
        </router-link>

        <!-- 已登录：用户菜单 -->
        <div
          v-else
          class="relative"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <button class="flex items-center gap-2">
            <img
              :src="authStore.userInfo?.avatar || '/default-avatar.png'"
              alt="avatar"
              class="h-8 w-8 rounded-none border-2 border-black object-cover dark:border-white"
            />
            <span class="hidden text-sm font-semibold sm:inline">
              {{ authStore.userInfo?.nickname }}
            </span>
          </button>

          <!-- 下拉菜单 -->
          <div
            v-show="showUserMenu"
            class="absolute right-0 top-full mt-2 w-48 border-2 border-black bg-[var(--neutral-50)] dark:border-[var(--neutral-800)] dark:bg-[var(--surface)]"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <router-link
              to="/user/me"
              class="flex items-center gap-2 px-4 py-2 text-sm"
              @click="hideMenu"
            >
              <User class="h-4 w-4" />
              我的首页
            </router-link>
            <router-link
              v-if="authStore.isAdmin"
              to="/write"
              class="flex items-center gap-2 px-4 py-2 text-sm"
              @click="hideMenu"
            >
              <PenLine class="h-4 w-4" />
              写文章
            </router-link>
            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              class="flex items-center gap-2 px-4 py-2 text-sm"
              @click="hideMenu"
            >
              <Shield class="h-4 w-4" />
              后台管理
            </router-link>
            <router-link
              to="/settings"
              class="flex items-center gap-2 px-4 py-2 text-sm"
              @click="hideMenu"
            >
              <Settings class="h-4 w-4" />
              设置
            </router-link>
            <button
              class="flex w-full items-center gap-2 px-4 py-2 text-sm"
              @click="hideMenu; handleLogout()"
            >
              <LogOut class="h-4 w-4" />
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
