<template>
  <DialogRoot :open="appStore.isMobileNavOpen" @update:open="onOpenChange">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-[var(--z-modal)] bg-[var(--color-scrim)] backdrop-blur-sm data-[state=open]:animate-[overlay-in_200ms_ease-out] data-[state=closed]:animate-[overlay-out_150ms_ease-in]"
      />

      <DialogContent
        class="fixed top-0 right-0 bottom-0 z-[var(--z-modal)] flex w-[300px] max-w-[86vw] flex-col border-l border-t-border bg-[var(--glass-bg-strong)] pt-[env(safe-area-inset-top)] pb-[var(--safe-bottom)] shadow-2xl outline-none data-[state=open]:animate-[drawer-in_300ms_cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:animate-[drawer-out_200ms_ease-in]"
      >
        <DialogTitle class="sr-only">站点菜单</DialogTitle>
        <DialogDescription class="sr-only">导航、登录与主题设置</DialogDescription>

        <div class="flex items-center justify-between px-5 py-4 border-b border-t-border relative">
          <span class="text-lg font-bold text-t-primary [text-shadow:0_0_8px_rgba(var(--color-primary-rgb),0.3)]">LiliBlog</span>
          <DialogClose as-child>
            <button
              class="flex items-center justify-center w-11 h-11 -mr-2 text-t-muted cursor-pointer transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)] rounded-control"
              aria-label="关闭菜单"
            >
              <X class="w-5 h-5" />
            </button>
          </DialogClose>
        </div>

        <div class="flex-1 py-4 overflow-y-auto overscroll-contain">
          <template v-if="userStore.isLoggedIn">
            <div class="flex items-center gap-3 px-5 py-3 mb-2">
              <div class="w-12 h-12 rounded-full bg-t-primary-fill flex items-center justify-center text-t-on-primary text-base font-semibold overflow-hidden">
                <img :src="resolveAvatar(userStore.avatar)" alt="" class="w-full h-full object-cover" @error="handleAvatarError" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-[15px] font-semibold text-t-title truncate">{{ userStore.nickname || userStore.username }}</div>
                <div class="text-xs text-t-muted mt-0.5">{{ userStore.isAdmin ? '管理员' : '用户' }}</div>
              </div>
            </div>
          </template>

          <nav class="flex flex-col px-2">
            <button
              v-for="item in primaryNavItems"
              :key="item.path"
              class="flex min-h-11 items-center gap-3 rounded-control px-3 py-2.5 text-sm text-t-body cursor-pointer transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:text-t-primary active:bg-[rgba(var(--color-primary-rgb),0.1)]"
              :class="isActive(item.path) ? 'text-t-primary bg-[rgba(var(--color-primary-rgb),0.06)]' : ''"
              @click="navigate(item.path)"
            >
              <component :is="item.icon" class="w-[18px] h-[18px]" />
              <span>{{ item.label }}</span>
            </button>

            <button
              class="flex min-h-11 items-center gap-3 rounded-control px-3 py-2.5 text-sm text-t-body cursor-pointer transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:text-t-primary"
              @click="navigate('/search')"
            >
              <Search class="w-[18px] h-[18px]" />
              <span>搜索文章</span>
            </button>
          </nav>

          <div class="h-px bg-[rgba(var(--color-primary-rgb),0.12)] my-3 mx-5" />

          <nav class="flex flex-col px-2">
            <template v-if="userStore.isLoggedIn">
              <button
                class="flex min-h-11 items-center gap-3 rounded-control px-3 py-2.5 text-sm text-t-body cursor-pointer transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:text-t-primary"
                @click="openWrite"
              >
                <PenSquare class="w-[18px] h-[18px]" />
                <span>写文章</span>
              </button>
              <button
                class="flex min-h-11 items-center gap-3 rounded-control px-3 py-2.5 text-sm text-t-body cursor-pointer transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:text-t-primary"
                @click="navigate('/user/me')"
              >
                <UserIcon class="w-[18px] h-[18px]" />
                <span>我的主页</span>
              </button>
              <button
                v-if="userStore.isAdmin"
                class="flex min-h-11 items-center gap-3 rounded-control px-3 py-2.5 text-sm text-t-body cursor-pointer transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:text-t-primary"
                @click="navigate('/admin')"
              >
                <Shield class="w-[18px] h-[18px]" />
                <span>管理后台</span>
              </button>
              <button
                class="flex min-h-11 items-center gap-3 rounded-control px-3 py-2.5 text-sm text-t-danger cursor-pointer transition-all duration-200 hover:bg-t-danger-soft"
                @click="handleLogout"
              >
                <LogOut class="w-[18px] h-[18px]" />
                <span>退出登录</span>
              </button>
            </template>

            <template v-else>
              <button
                class="flex min-h-11 items-center gap-3 rounded-control px-3 py-2.5 text-sm text-t-body cursor-pointer transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:text-t-primary"
                @click="navigate('/login')"
              >
                <UserIcon class="w-[18px] h-[18px]" />
                <span>登录</span>
              </button>
              <button
                class="flex min-h-11 items-center gap-3 rounded-control px-3 py-2.5 text-sm text-t-body cursor-pointer transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:text-t-primary"
                @click="navigate('/register')"
              >
                <UserPlus class="w-[18px] h-[18px]" />
                <span>注册</span>
              </button>
            </template>
          </nav>

          <div class="h-px bg-[rgba(var(--color-primary-rgb),0.12)] my-3 mx-5" />

          <section class="px-5 py-1">
            <div class="widget-title mb-3">
              <Palette class="w-4 h-4 text-t-primary" />
              <h3 class="text-sm font-semibold text-t-title m-0">主题设置</h3>
            </div>
            <ThemePanel variant="inline" />
          </section>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  LogOut,
  Palette,
  PenSquare,
  Search,
  Shield,
  User as UserIcon,
  UserPlus,
  X,
} from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { handleAvatarError, resolveAvatar } from '~/utils/format'
import { primaryNavItems } from '~/utils/navigation'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

function onOpenChange(value: boolean): void {
  if (!value) appStore.closeMobileNav()
}

function navigate(path: string): void {
  appStore.closeMobileNav()
  router.push(path)
}

function openWrite(): void {
  appStore.closeMobileNav()
  window.open('/write', '_blank')
}

function handleLogout(): void {
  appStore.closeMobileNav()
  userStore.logout()
}
</script>
