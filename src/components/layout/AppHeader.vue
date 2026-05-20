<template>
  <header class="fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300 border-b border-t-border"
    :class="isScrolled ? 'bg-[rgba(var(--color-bg-rgb),0.95)] shadow-[0_2px_20px_rgba(var(--color-primary-rgb),0.08)]' : 'bg-[rgba(var(--color-bg-rgb),0.85)]'"
    style="backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);">
    <div class="h-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10 flex items-center">
      <router-link to="/"
        class="flex items-center gap-2.5 no-underline transition-transform duration-200 hover:scale-[1.02] group shrink-0">
        <img :src="logoSvg" alt="LiliBlog"
          class="w-[120px] h-auto object-contain transition-[filter] duration-400 group-hover:[filter:drop-shadow(0_0_8px_rgba(var(--color-primary-rgb),0.6))_drop-shadow(0_0_16px_rgba(var(--color-primary-rgb),0.3))]" />
      </router-link>

      <nav class="hidden md:flex items-center gap-1.5 ml-6 shrink-0">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path"
          class="relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-t-body no-underline rounded-md transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)]"
          active-class="!text-t-primary !font-semibold [text-shadow:0_0_8px_rgba(var(--color-primary-rgb),0.4)]">
          <component :is="item.icon" class="w-4 h-4" />
          <span>{{ item.label }}</span>
          <span
            class="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-t-primary rounded-full scale-x-0 transition-transform duration-300 [box-shadow:0_0_6px_rgba(var(--color-primary-rgb),0.5)]"
            :class="$route.path === item.path ? 'scale-x-100' : ''"></span>
        </router-link>
      </nav>

      <div class="flex-1 flex justify-center px-4">
        <div class="hidden md:flex w-full max-w-[400px]">
          <div class="flex-1 relative">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted transition-colors duration-300 pointer-events-none"
              :class="{ 'text-t-primary': isSearchFocused }" />
            <input v-model="searchKeyword" type="text" placeholder="搜索文章..."
              class="w-full h-9 pl-9 pr-4 rounded-full bg-[rgba(var(--color-surface-rgb),0.6)] border border-[rgba(var(--color-primary-rgb),0.12)] text-t-body placeholder-[#6b7280] text-sm outline-none transition-all duration-300 focus:border-[rgba(var(--color-primary-rgb),0.4)] focus:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.1)]"
              @keyup.enter="handleSearch" @focus="isSearchFocused = true" @blur="isSearchFocused = false" />
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button
          class="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-t-muted hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all duration-200 cursor-pointer"
          @click="showThemePanel = true" title="主题设置">
          <Palette class="w-4.5 h-4.5" />
        </button>

        <template v-if="userStore.isLoggedIn">
          <div class="relative" ref="dropdownRef">
            <button
              class="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-transparent transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:border-[rgba(var(--color-primary-rgb),0.2)] cursor-pointer"
              @click="showDropdown = !showDropdown">
              <div
                class="w-8 h-8 rounded-full bg-t-primary flex items-center justify-center text-white text-sm font-semibold overflow-hidden transition-transform duration-200 hover:rotate-[-3deg] hover:scale-[1.04]">
                <img :src="resolveAvatar(userStore.avatar)" alt="" class="w-full h-full object-cover"
                  @error="handleAvatarError" />
              </div>
              <span class="hidden md:block text-sm text-t-title font-medium max-w-[80px] truncate">{{
                userStore.nickname || userStore.username }}</span>
              <ChevronDown class="hidden md:block w-3.5 h-3.5 text-t-muted transition-transform duration-200"
                :class="showDropdown ? 'rotate-180' : ''" />
            </button>

            <Transition enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 -translate-y-2 scale-95">
              <div v-if="showDropdown"
                class="absolute right-0 top-full mt-2 w-52 bg-t-surface border border-t-border rounded-lg overflow-hidden [box-shadow:0_8px_32px_rgba(0,0,0,0.4),0_0_1px_rgba(var(--color-primary-rgb),0.3)]">
                <div class="px-4 py-3 border-b border-[rgba(var(--color-primary-rgb),0.1)]">
                  <p class="text-sm font-semibold text-t-title truncate">{{ userStore.nickname || userStore.username
                  }}</p>
                </div>
                <button
                  class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-t-body hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] transition-colors duration-200 cursor-pointer"
                  @click="handleCommand('write')">
                  <PenSquare class="w-4 h-4" />
                  <span>写文章</span>
                </button>
                <button
                  class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-t-body hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] transition-colors duration-200 cursor-pointer"
                  @click="handleCommand('myHome')">
                  <User class="w-4 h-4" />
                  <span>我的主页</span>
                </button>
                <div class="h-px bg-[rgba(var(--color-primary-rgb),0.1)]"></div>
                <button
                  class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-t-secondary hover:bg-[rgba(var(--color-secondary-rgb),0.06)] transition-colors duration-200 cursor-pointer"
                  @click="handleCommand('logout')">
                  <LogOut class="w-4 h-4" />
                  <span>退出登录</span>
                </button>
              </div>
            </Transition>
          </div>
        </template>

        <template v-else>
          <router-link to="/login"
            class="hidden md:inline-flex px-4 py-2 text-sm font-medium text-t-primary border-[1.5px] border-[rgba(var(--color-primary-rgb),0.4)] rounded-md no-underline transition-all duration-200 hover:text-white hover:border-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.1)] hover:-translate-y-px [box-shadow:0_0_8px_rgba(var(--color-primary-rgb),0.15)]">
            登录
          </router-link>
          <router-link to="/register"
            class="hidden md:inline-flex px-4 py-2 text-sm font-medium text-white bg-t-primary rounded-md no-underline transition-all duration-200 hover:-translate-y-0.5 [box-shadow:0_4px_12px_rgba(var(--color-primary-rgb),0.25)] hover:[box-shadow:0_6px_20px_rgba(var(--color-primary-rgb),0.35),0_0_12px_rgba(var(--color-primary-rgb),0.2)]">
            注册
          </router-link>
        </template>

        <button
          class="md:hidden flex items-center justify-center w-10 h-10 text-t-title rounded-md transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.08)] hover:text-t-primary cursor-pointer"
          @click="appStore.toggleMobileNav()" aria-label="菜单">
          <Menu class="w-5.5 h-5.5" />
        </button>
      </div>
    </div>
  </header>

  <ThemePanel v-if="showThemePanel" @close="showThemePanel = false" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { resolveAvatar, handleAvatarError } from '@/utils/format'
import { Home, Info, PenSquare, User, LogOut, Menu, ChevronDown, Search, MessageCircle, Palette } from 'lucide-vue-next'
import logoSvg from '@/assets/logo.svg'
import ThemePanel from '@/components/common/ThemePanel.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()

const isScrolled = ref(false)
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const searchKeyword = ref('')
const isSearchFocused = ref(false)
const showThemePanel = ref(false)

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/about', label: '关于', icon: Info },
  { path: '/article/2', label: '交流', icon: MessageCircle },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 100
}

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

watch(() => route.path, () => {
  showDropdown.value = false
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})

function handleSearch() {
  const kw = searchKeyword.value.trim()
  if (kw) {
    router.push({ path: '/search', query: { q: kw } })
  }
}

function handleCommand(command: string) {
  showDropdown.value = false
  switch (command) {
    case 'write':
      router.push('/write')
      break
    case 'myHome':
      router.push('/user/me')
      break
    case 'logout':
      userStore.logout()
      break
  }
}
</script>
