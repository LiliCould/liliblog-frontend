<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="appStore.isMobileNavOpen"
        class="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.6)]"
        @click="appStore.closeMobileNav()"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="appStore.isMobileNavOpen"
        class="fixed top-0 right-0 bottom-0 w-[280px] z-[70] bg-[rgba(10,10,15,0.95)] border-l border-[rgba(0,240,255,0.15)] flex flex-col"
        style="backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);"
      >
        <div class="flex items-center justify-between px-5 py-4 border-b border-[rgba(0,240,255,0.15)] relative">
          <span class="text-lg font-bold text-cyber-primary [text-shadow:0_0_8px_rgba(0,240,255,0.3)]">LiliBlog</span>
          <button class="flex items-center justify-center w-8 h-8 text-cyber-muted cursor-pointer transition-all duration-200 hover:text-cyber-primary [filter:hover:drop-shadow(0_0_4px_rgba(0,240,255,0.4))]" @click="appStore.closeMobileNav()">
            <X class="w-5 h-5" />
          </button>
          <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent opacity-40"></div>
        </div>

        <div class="flex-1 py-4 overflow-y-auto">
          <template v-if="userStore.isLoggedIn">
            <div class="flex items-center gap-3 px-5 py-3 mb-2">
              <div class="w-12 h-12 rounded-full bg-cyber-primary flex items-center justify-center text-white text-base font-semibold overflow-hidden">
                <img v-if="userStore.avatar" :src="userStore.avatar" alt="" class="w-full h-full object-cover" />
                <span v-else>{{ userStore.nickname?.charAt(0) || 'U' }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-[15px] font-semibold text-cyber-title truncate">{{ userStore.nickname || userStore.username }}</div>
                <div class="text-xs text-cyber-muted mt-0.5">{{ userStore.userInfo?.role === 0 ? '管理员' : '用户' }}</div>
              </div>
            </div>
          </template>

          <nav class="flex flex-col">
            <a class="flex items-center gap-3 px-5 py-3 text-sm text-cyber-body cursor-pointer transition-all duration-200 relative hover:bg-[rgba(0,240,255,0.06)] hover:text-cyber-primary before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-0 before:bg-cyber-primary before:rounded-full before:transition-[height] before:duration-200 before:[box-shadow:0_0_6px_rgba(0,240,255,0.4)] hover:before:h-3/5" @click="navigate('/')">
              <Home class="w-[18px] h-[18px]" />
              <span>首页</span>
            </a>
            <a class="flex items-center gap-3 px-5 py-3 text-sm text-cyber-body cursor-pointer transition-all duration-200 relative hover:bg-[rgba(0,240,255,0.06)] hover:text-cyber-primary before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-0 before:bg-cyber-primary before:rounded-full before:transition-[height] before:duration-200 before:[box-shadow:0_0_6px_rgba(0,240,255,0.4)] hover:before:h-3/5" @click="navigate('/about')">
              <Info class="w-[18px] h-[18px]" />
              <span>关于</span>
            </a>

            <template v-if="userStore.isLoggedIn">
              <div class="h-px bg-[rgba(0,240,255,0.15)] my-2 mx-5 relative after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[rgba(0,240,255,0.2)] after:to-transparent"></div>
              <a class="flex items-center gap-3 px-5 py-3 text-sm text-cyber-body cursor-pointer transition-all duration-200 relative hover:bg-[rgba(0,240,255,0.06)] hover:text-cyber-primary before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-0 before:bg-cyber-primary before:rounded-full before:transition-[height] before:duration-200 before:[box-shadow:0_0_6px_rgba(0,240,255,0.4)] hover:before:h-3/5" @click="navigate('/manage/editor')">
                <PenSquare class="w-[18px] h-[18px]" />
                <span>写文章</span>
              </a>
              <a class="flex items-center gap-3 px-5 py-3 text-sm text-cyber-body cursor-pointer transition-all duration-200 relative hover:bg-[rgba(0,240,255,0.06)] hover:text-cyber-primary before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-0 before:bg-cyber-primary before:rounded-full before:transition-[height] before:duration-200 before:[box-shadow:0_0_6px_rgba(0,240,255,0.4)] hover:before:h-3/5" @click="navigate('/manage/articles')">
                <FileText class="w-[18px] h-[18px]" />
                <span>我的文章</span>
              </a>
              <a class="flex items-center gap-3 px-5 py-3 text-sm text-cyber-body cursor-pointer transition-all duration-200 relative hover:bg-[rgba(0,240,255,0.06)] hover:text-cyber-primary before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-0 before:bg-cyber-primary before:rounded-full before:transition-[height] before:duration-200 before:[box-shadow:0_0_6px_rgba(0,240,255,0.4)] hover:before:h-3/5" @click="navigate('/profile')">
                <UserIcon class="w-[18px] h-[18px]" />
                <span>个人信息</span>
              </a>
              <div class="h-px bg-[rgba(0,240,255,0.15)] my-2 mx-5 relative after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[rgba(0,240,255,0.2)] after:to-transparent"></div>
              <a class="flex items-center gap-3 px-5 py-3 text-sm text-cyber-pink cursor-pointer transition-all duration-200 relative hover:bg-[rgba(255,45,120,0.08)]" @click="handleLogout">
                <LogOut class="w-[18px] h-[18px]" />
                <span>退出登录</span>
              </a>
            </template>

            <template v-else>
              <div class="h-px bg-[rgba(0,240,255,0.15)] my-2 mx-5 relative after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[rgba(0,240,255,0.2)] after:to-transparent"></div>
              <a class="flex items-center gap-3 px-5 py-3 text-sm text-cyber-body cursor-pointer transition-all duration-200 relative hover:bg-[rgba(0,240,255,0.06)] hover:text-cyber-primary before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-0 before:bg-cyber-primary before:rounded-full before:transition-[height] before:duration-200 before:[box-shadow:0_0_6px_rgba(0,240,255,0.4)] hover:before:h-3/5" @click="navigate('/login')">
                <UserIcon class="w-[18px] h-[18px]" />
                <span>登录</span>
              </a>
              <a class="flex items-center gap-3 px-5 py-3 text-sm text-cyber-body cursor-pointer transition-all duration-200 relative hover:bg-[rgba(0,240,255,0.06)] hover:text-cyber-primary before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-0 before:bg-cyber-primary before:rounded-full before:transition-[height] before:duration-200 before:[box-shadow:0_0_6px_rgba(0,240,255,0.4)] hover:before:h-3/5" @click="navigate('/register')">
                <UserPlus class="w-[18px] h-[18px]" />
                <span>注册</span>
              </a>
            </template>
          </nav>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { X, Home, Info, PenSquare, FileText, User as UserIcon, LogOut, UserPlus } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

function navigate(path: string) {
  appStore.closeMobileNav()
  router.push(path)
}

function handleLogout() {
  appStore.closeMobileNav()
  userStore.logout()
}
</script>
