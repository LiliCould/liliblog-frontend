<template>
  <header class="fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300"
    :class="isScrolled ? 'bg-[rgba(10,10,15,0.95)] shadow-[0_2px_20px_rgba(0,240,255,0.08)]' : 'bg-[rgba(10,10,15,0.85)]'"
    style="backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0, 240, 255, 0.15);">
    <div class="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
      <router-link to="/"
        class="flex items-center gap-2.5 no-underline transition-transform duration-200 hover:scale-[1.02] group shrink-0">
        <img :src="logoSvg" alt="LiliBlog"
          class="w-[120px] h-auto object-contain transition-[filter] duration-400 group-hover:[filter:drop-shadow(0_0_8px_rgba(0,240,255,0.6))_drop-shadow(0_0_16px_rgba(0,240,255,0.3))]" />
      </router-link>

      <nav class="hidden md:flex items-center gap-1.5 ml-6 shrink-0">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path"
          class="relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-cyber-body no-underline rounded-md transition-all duration-200 hover:text-cyber-primary hover:bg-[rgba(0,240,255,0.08)]"
          active-class="!text-cyber-primary !font-semibold [text-shadow:0_0_8px_rgba(0,240,255,0.4)]">
          <component :is="item.icon" class="w-4 h-4" />
          <span>{{ item.label }}</span>
          <span
            class="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-cyber-primary rounded-full scale-x-0 transition-transform duration-300 [box-shadow:0_0_6px_rgba(0,240,255,0.5)]"
            :class="$route.path === item.path ? 'scale-x-100' : ''"></span>
        </router-link>
      </nav>

      <div class="flex-1 flex justify-center px-4">
        <div class="hidden md:flex w-full max-w-[400px]">
          <div class="flex-1 relative">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280] transition-colors duration-300 pointer-events-none"
              :class="{ 'text-[#00f0ff]': isSearchFocused }" />
            <input v-model="searchKeyword" type="text" placeholder="搜索文章..."
              class="w-full h-9 pl-9 pr-4 rounded-full bg-[rgba(17,17,24,0.6)] border border-[rgba(0,240,255,0.12)] text-white placeholder-[#6b7280] text-sm outline-none transition-all duration-300 focus:border-[rgba(0,240,255,0.4)] focus:shadow-[0_0_12px_rgba(0,240,255,0.1)]"
              @keyup.enter="handleSearch" @focus="isSearchFocused = true" @blur="isSearchFocused = false" />
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <template v-if="userStore.isLoggedIn">
          <div class="relative" ref="dropdownRef">
            <button
              class="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-transparent transition-all duration-200 hover:bg-[rgba(0,240,255,0.06)] hover:border-[rgba(0,240,255,0.2)] cursor-pointer"
              @click="showDropdown = !showDropdown">
              <div
                class="w-8 h-8 rounded-full bg-cyber-primary flex items-center justify-center text-white text-sm font-semibold overflow-hidden transition-transform duration-200 hover:rotate-[-3deg] hover:scale-[1.04]">
                <img :src="resolveAvatar(userStore.avatar)" alt="" class="w-full h-full object-cover"
                  @error="handleAvatarError" />
              </div>
              <span class="hidden md:block text-sm text-cyber-title font-medium max-w-[80px] truncate">{{
                userStore.nickname || userStore.username }}</span>
              <ChevronDown class="hidden md:block w-3.5 h-3.5 text-cyber-muted transition-transform duration-200"
                :class="showDropdown ? 'rotate-180' : ''" />
            </button>

            <Transition enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 -translate-y-2 scale-95">
              <div v-if="showDropdown"
                class="absolute right-0 top-full mt-2 w-52 bg-cyber-surface border border-[rgba(0,240,255,0.15)] rounded-lg overflow-hidden [box-shadow:0_8px_32px_rgba(0,0,0,0.4),0_0_1px_rgba(0,240,255,0.3)]">
                <div class="px-4 py-3 border-b border-[rgba(0,240,255,0.1)]">
                  <p class="text-sm font-semibold text-cyber-title truncate">{{ userStore.nickname || userStore.username
                    }}</p>
                </div>
                <button
                  class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-cyber-body hover:text-cyber-primary hover:bg-[rgba(0,240,255,0.06)] transition-colors duration-200 cursor-pointer"
                  @click="handleCommand('write')">
                  <PenSquare class="w-4 h-4" />
                  <span>写文章</span>
                </button>
                <button
                  class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-cyber-body hover:text-cyber-primary hover:bg-[rgba(0,240,255,0.06)] transition-colors duration-200 cursor-pointer"
                  @click="handleCommand('myHome')">
                  <User class="w-4 h-4" />
                  <span>我的主页</span>
                </button>
                <div class="h-px bg-[rgba(0,240,255,0.1)]"></div>
                <button
                  class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-cyber-pink hover:bg-[rgba(255,45,120,0.06)] transition-colors duration-200 cursor-pointer"
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
            class="hidden md:inline-flex px-4 py-2 text-sm font-medium text-cyber-primary border-[1.5px] border-[rgba(0,240,255,0.4)] rounded-md no-underline transition-all duration-200 hover:text-white hover:border-cyber-primary hover:bg-[rgba(0,240,255,0.1)] hover:-translate-y-px [box-shadow:0_0_8px_rgba(0,240,255,0.15)]">
            登录
          </router-link>
          <router-link to="/register"
            class="hidden md:inline-flex px-4 py-2 text-sm font-medium text-white bg-cyber-primary rounded-md no-underline transition-all duration-200 hover:-translate-y-0.5 [box-shadow:0_4px_12px_rgba(0,240,255,0.25)] hover:[box-shadow:0_6px_20px_rgba(0,240,255,0.35),0_0_12px_rgba(0,240,255,0.2)]">
            注册
          </router-link>
        </template>

        <button
          class="md:hidden flex items-center justify-center w-10 h-10 text-cyber-title rounded-md transition-all duration-200 hover:bg-[rgba(0,240,255,0.08)] hover:text-cyber-primary cursor-pointer"
          @click="appStore.toggleMobileNav()" aria-label="菜单">
          <Menu class="w-5.5 h-5.5" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { resolveAvatar, handleAvatarError } from '@/utils/format'
import { Home, Info, PenSquare, User, LogOut, Menu, ChevronDown, Search, MessageCircle } from 'lucide-vue-next'
import logoSvg from '@/assets/logo.svg'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()

const isScrolled = ref(false)
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const searchKeyword = ref('')
const isSearchFocused = ref(false)

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
      router.push('/manage/editor')
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
