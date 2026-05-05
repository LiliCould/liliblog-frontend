<template>
  <header class="app-header" :class="{ scrolled: isScrolled }">
    <div class="header-inner page-container">
      <router-link to="/" class="logo">
        <img class="logo-icon" :src="logoSvg" alt="LiliBlog" />
      </router-link>

      <nav class="desktop-nav">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-link" active-class="active">
          <span class="link-text">{{ item.label }}</span>
          <span class="link-underline"></span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </router-link>

        <div class="search-trigger clickable" @click="goSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
      </nav>

      <div class="header-right">
        <template v-if="userStore.isLoggedIn">
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-avatar-wrapper clickable">
              <el-avatar :size="34" :src="userStore.avatar || undefined" class="user-avatar">
                {{ userStore.nickname?.charAt(0) || 'U' }}
              </el-avatar>
              <span class="username-text">{{ userStore.nickname || userStore.username }}</span>
              <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="custom-dropdown">
                <el-dropdown-item command="profile">
                  <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  个人信息
                </el-dropdown-item>
                <el-dropdown-item command="myArticles">
                  <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  我的文章
                </el-dropdown-item>
                <el-dropdown-item command="write" divided>
                  <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  写文章
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>

        <template v-else>
          <router-link to="/login" class="btn-auth btn-login clickable">登录</router-link>
          <router-link to="/register" class="btn-auth btn-register clickable">注册</router-link>
        </template>

        <button class="mobile-menu-btn clickable" @click="appStore.toggleMobileNav()" aria-label="菜单">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { useChatStore } from '@/stores/chat'
import logoSvg from '@/assets/logo.svg'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
const chatStore = useChatStore()

const isScrolled = ref(false)

const navItems = computed(() => [
  {
    path: '/',
    label: '首页',
    badge: undefined
  },
  {
    path: '/about',
    label: '关于',
    badge: undefined
  },
  {
    path: '/chat',
    label: '聊天室',
    badge: chatStore.unreadCount > 0 && !chatStore.isChatRoomActive ? (chatStore.unreadCount > 99 ? '99+' : chatStore.unreadCount) : undefined
  }
])

const handleScroll = () => {
  isScrolled.value = window.scrollY > 100
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function goSearch() {
  router.push('/search')
}

function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'myArticles':
      router.push('/manage/articles')
      break
    case 'write':
      router.push('/manage/editor')
      break
    case 'logout':
      userStore.logout()
      break
  }
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: var(--z-header);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-header.scrolled {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom-color: var(--color-border);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
}

.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: transform var(--transition-fast);
}

.logo:hover {
  transform: scale(1.02);
}

.logo-icon {
  width: 120px;
  height: auto;
  object-fit: contain;
  animation: sparkle 3s ease-in-out infinite;
}

.app-header.scrolled .logo-icon {
  filter: none;
}

@keyframes sparkle {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  color: #fff;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.app-header.scrolled .nav-link {
  color: var(--color-body);
  text-shadow: none;
  font-weight: var(--font-weight-medium);
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.app-header.scrolled .nav-link:hover {
  color: var(--color-title);
  background: var(--color-primary-light);
}

.nav-link:hover .link-underline,
.nav-link.active .link-underline {
  transform: translateX(-50%) scaleX(1);
}

.nav-link.active {
  color: #fff;
  font-weight: var(--font-weight-semibold);
}

.app-header.scrolled .nav-link.active {
  color: var(--color-primary);
}

.link-text {
  position: relative;
  z-index: 1;
}

.nav-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  color: #fff;
  background: linear-gradient(135deg, var(--color-danger), var(--color-primary));
  border-radius: var(--radius-full);
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.search-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  margin-left: 8px;
  border-radius: var(--radius-md);
  color: #fff;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.app-header.scrolled .search-trigger {
  color: var(--color-muted);
}

.search-trigger svg {
  width: 18px;
  height: 18px;
}

.search-trigger:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.app-header.scrolled .search-trigger:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
  transform: scale(1.05);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.user-avatar-wrapper:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.app-header.scrolled .user-avatar-wrapper:hover {
  background: var(--color-bg-warm);
  border-color: var(--color-border);
}

.user-avatar {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  transition: transform var(--transition-fast);
}

.user-avatar-wrapper:hover .user-avatar {
  transform: rotate(-5deg) scale(1.05);
}

.username-text {
  font-size: var(--font-size-sm);
  color: #fff;
  font-weight: var(--font-weight-medium);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-header.scrolled .username-text {
  color: var(--color-title);
}

.arrow-icon {
  width: 14px;
  height: 14px;
  color: rgba(255, 255, 255, 0.7);
  transition: transform var(--transition-fast);
}

.app-header.scrolled .arrow-icon {
  color: var(--color-muted-light);
}

.btn-auth {
  padding: 8px 20px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.btn-login {
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
}

.btn-login:hover {
  color: #fff;
  border-color: #fff;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.app-header.scrolled .btn-login {
  color: var(--color-primary);
  border-color: var(--color-border);
}

.app-header.scrolled .btn-login:hover {
  color: var(--color-primary-hover);
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.btn-register {
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  box-shadow: 0 4px 12px rgba(196, 93, 53, 0.25);
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(196, 93, 53, 0.35);
}

.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #fff;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.app-header.scrolled .mobile-menu-btn {
  color: var(--color-title);
}

.mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.app-header.scrolled .mobile-menu-btn:hover {
  background: var(--color-bg-warm);
}

.mobile-menu-btn svg {
  width: 22px;
  height: 22px;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .username-text,
  .arrow-icon {
    display: none;
  }

  .btn-auth {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .user-avatar-wrapper {
    padding: 6px;
  }
}
</style>
