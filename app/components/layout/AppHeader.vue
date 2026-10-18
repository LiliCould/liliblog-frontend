<template>
  <header
    class="fixed top-0 left-0 right-0 h-16 z-[var(--z-header)] nav-glass transition-[transform,box-shadow] duration-300"
    :class="[
      isHidden ? '-translate-y-full' : 'translate-y-0',
      isScrolled ? 'shadow-[0_8px_32px_rgba(0,0,0,0.12)]' : '',
    ]"
  >
    <div class="h-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 flex items-center">
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5 no-underline transition-transform duration-200 hover:scale-[1.02] group shrink-0 max-md:mx-auto"
      >
        <img
          :src="logoSvg"
          alt="LiliBlog"
          class="w-[100px] md:w-[120px] h-auto object-contain transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_0_8px_rgba(var(--color-primary-rgb),0.6))_drop-shadow(0_0_16px_rgba(var(--color-primary-rgb),0.3))]"
        />
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-1.5 ml-6 shrink-0">
        <NuxtLink
          v-for="item in primaryNavItems"
          :key="item.path"
          :to="item.path"
          class="relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-control no-underline transition-all duration-200"
          :class="isNavActive(item.path)
            ? 'text-t-primary bg-[rgba(var(--color-primary-rgb),0.08)] font-semibold'
            : 'text-t-body hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)]'"
        >
          <component :is="item.icon" class="w-4 h-4" />
          <span>{{ item.label }}</span>
          <span
            class="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-t-primary rounded-full transition-transform duration-300 [box-shadow:0_0_6px_rgba(var(--color-primary-rgb),0.5)]"
            :class="isNavActive(item.path) ? 'scale-x-100' : 'scale-x-0'"
          />
        </NuxtLink>
      </nav>

      <div class="flex-1 flex justify-center px-4">
        <div
          class="hidden md:flex w-full transition-[max-width] duration-300"
          :class="isSearchFocused ? 'max-w-[280px]' : 'max-w-[220px]'"
        >
          <div class="flex-1 relative">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 pointer-events-none"
              :class="isSearchFocused ? 'text-t-primary' : 'text-t-muted'"
            />
            <input
              v-model="searchKeyword"
              type="text"
              aria-label="搜索文章"
              placeholder="搜索文章..."
              class="w-full h-9 pl-9 pr-4 rounded-full bg-[rgba(var(--color-surface-rgb),0.55)] border border-[rgba(var(--color-primary-rgb),0.12)] text-t-body placeholder-t-muted text-sm outline-none transition-all duration-300 focus:border-[rgba(var(--color-primary-rgb),0.4)] focus:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.1)]"
              @keyup.enter="handleSearch"
              @focus="isSearchFocused = true"
              @blur="isSearchFocused = false"
            />
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <ThemePanel v-model:open="showThemePanel">
          <template #trigger>
            <button
              class="hidden md:flex items-center justify-center w-9 h-9 rounded-control text-t-muted hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all duration-200 cursor-pointer"
              aria-label="主题设置"
            >
              <Palette class="w-4 h-4" />
            </button>
          </template>
        </ThemePanel>

        <template v-if="userStore.isLoggedIn">
          <DropdownMenuRoot @update:open="userMenuOpen = $event">
            <DropdownMenuTrigger as-child>
              <button
                class="flex items-center gap-2 py-1.5 px-3 rounded-control border border-transparent transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:border-[rgba(var(--color-primary-rgb),0.2)] cursor-pointer"
              >
                <div
                  class="w-8 h-8 rounded-full bg-t-primary-fill flex items-center justify-center text-t-on-primary text-sm font-semibold overflow-hidden transition-transform duration-200 hover:rotate-[-3deg] hover:scale-[1.04]"
                >
                  <img
                    :src="resolveAvatar(userStore.avatar)"
                    alt=""
                    class="w-full h-full object-cover"
                    @error="handleAvatarError"
                  />
                </div>
                <span class="hidden md:block text-sm text-t-title font-medium max-w-[80px] truncate">
                  {{ userStore.nickname || userStore.username }}
                </span>
                <ChevronDown
                  class="hidden md:block w-3.5 h-3.5 text-t-muted transition-transform duration-200"
                  :class="{ 'rotate-180': userMenuOpen }"
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuPortal>
              <DropdownMenuContent
                align="end"
                :side-offset="8"
                class="panel-glass z-[var(--z-popover)] w-52 overflow-hidden p-1.5 outline-none"
              >
                <DropdownMenuLabel class="px-3 py-2 text-sm font-semibold text-t-title truncate">
                  {{ userStore.nickname || userStore.username }}
                </DropdownMenuLabel>
                <DropdownMenuSeparator class="h-px bg-[rgba(var(--color-primary-rgb),0.1)]" />
                <DropdownMenuItem
                  v-for="item in visibleUserMenuItems"
                  :key="item.key"
                  class="flex items-center gap-2.5 px-3 py-2.5 rounded-control text-sm text-t-body outline-none cursor-pointer transition-colors duration-150 data-[highlighted]:text-t-primary data-[highlighted]:bg-[rgba(var(--color-primary-rgb),0.08)]"
                  @select="handleCommand(item.key)"
                >
                  <component :is="item.icon" class="w-4 h-4" />
                  <span>{{ item.label }}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator class="h-px bg-[rgba(var(--color-primary-rgb),0.1)] my-1" />
                <DropdownMenuItem
                  class="flex items-center gap-2.5 px-3 py-2.5 rounded-control text-sm text-t-danger outline-none cursor-pointer transition-colors duration-150 data-[highlighted]:bg-t-danger-soft"
                  @select="handleCommand('logout')"
                >
                  <LogOut class="w-4 h-4" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenuRoot>
        </template>

        <template v-else>
          <button
            class="hidden md:inline-flex px-4 py-2 text-sm font-medium text-t-primary border-[1.5px] border-[rgba(var(--color-primary-rgb),0.4)] rounded-control transition-all duration-200 hover:text-t-on-primary hover:border-t-primary hover:bg-t-primary-fill hover:-translate-y-px cursor-pointer"
            @click="authModal.open('login')"
          >
            登录
          </button>
          <button
            class="hidden md:inline-flex px-4 py-2 text-sm font-medium text-t-on-primary bg-t-primary-fill rounded-control transition-all duration-200 hover:-translate-y-0.5 [box-shadow:0_4px_12px_rgba(var(--color-primary-rgb),0.25)] cursor-pointer"
            @click="authModal.open('register')"
          >
            注册
          </button>
        </template>

        <button
          class="md:hidden flex items-center justify-center w-10 h-10 text-t-title rounded-control transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.08)] hover:text-t-primary cursor-pointer"
          aria-label="菜单"
          @click="appStore.toggleMobileNav()"
        >
          <Menu class="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  ChevronDown,
  LogOut,
  Menu,
  Palette,
  PenSquare,
  Search,
  Shield,
  User,
} from 'lucide-vue-next'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import logoSvg from '~/assets/logo.svg'
import { handleAvatarError, resolveAvatar } from '~/utils/format'
import { primaryNavItems } from '~/utils/navigation'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()
const authModal = useAuthModal()
const { headerHidden } = useHeaderState()

const isScrolled = ref(false)
const isHidden = ref(false)
const searchKeyword = ref('')
const isSearchFocused = ref(false)
const showThemePanel = ref(false)
const userMenuOpen = ref(false)

let lastScrollY = 0

const userMenuItems = [
  { key: 'write', label: '写文章', icon: PenSquare, adminOnly: false },
  { key: 'myHome', label: '我的主页', icon: User, adminOnly: false },
  { key: 'admin', label: '管理后台', icon: Shield, adminOnly: true },
]

const visibleUserMenuItems = computed(() =>
  userMenuItems.filter(item => !item.adminOnly || userStore.isAdmin),
)

function isNavActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

function handleScroll(): void {
  const currentY = window.scrollY
  isScrolled.value = currentY > 12

  if (appStore.isMobileNavOpen || showThemePanel.value || userMenuOpen.value) {
    if (currentY < 80) isHidden.value = false
    lastScrollY = currentY
    return
  }

  if (currentY > lastScrollY && currentY > 160) {
    isHidden.value = true
  } else if (currentY < lastScrollY - 4) {
    isHidden.value = false
  }

  lastScrollY = currentY
}

watch(isHidden, (hidden) => {
  headerHidden.value = hidden
})

watch(() => route.path, () => {
  isHidden.value = false
  userMenuOpen.value = false
  showThemePanel.value = false
})

onMounted(() => {
  lastScrollY = window.scrollY
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  headerHidden.value = false
})

function handleSearch(): void {
  const keyword = searchKeyword.value.trim()
  if (keyword) {
    router.push({ path: '/search', query: { q: keyword } })
  }
}

function handleCommand(command: string): void {
  switch (command) {
    case 'write':
      window.open('/write', '_blank')
      break
    case 'myHome':
      router.push('/user/me')
      break
    case 'admin':
      router.push('/admin')
      break
    case 'logout':
      userStore.logout()
      break
  }
}
</script>
