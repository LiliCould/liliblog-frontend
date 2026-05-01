<template>
  <header class="app-header" :class="{ scrolled: isScrolled }">
    <div class="header-inner page-container">
      <router-link to="/" class="logo">
        <span class="logo-icon">✦</span>
        <span class="logo-text">LiliBlog</span>
      </router-link>

      <nav class="desktop-nav">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-link" active-class="active">
          <span class="link-text">{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </router-link>

        <div class="search-trigger" @click="goSearch">
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
            <div class="user-avatar-wrapper">
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
                  <span class="dropdown-icon">👤</span>
                  个人信息
                </el-dropdown-item>
                <el-dropdown-item command="myArticles">
                  <span class="dropdown-icon">📝</span>
                  我的文章
                </el-dropdown-item>
                <el-dropdown-item command="write" divided>
                  <span class="dropdown-icon">✏️</span>
                  写文章
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <span class="dropdown-icon">🚪</span>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>

        <template v-else>
          <router-link to="/login" class="btn-auth btn-login">登录</router-link>
          <router-link to="/register" class="btn-auth btn-register">注册</router-link>
        </template>

        <button class="mobile-menu-btn" @click="appStore.toggleMobileNav()" aria-label="菜单">
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
  isScrolled.value = window.scrollY > 20
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
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  z-index: var(--z-header);
  transition: all var(--transition-base);
}

.app-header.scrolled {
  background: rgba(255, 255, 255, 0.95);
  border-bottom-color: var(--color-border);
  box-shadow: var(--shadow-sm);
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
  font-size: 22px;
  color: var(--color-primary);
  animation: sparkle 3s ease-in-out infinite;
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

.logo-text {
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  font-family: var(--font-display);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
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
  color: var(--color-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 20px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  border-radius: var(--radius-full);
  transition: transform var(--transition-base);
}

.nav-link:hover {
  color: var(--color-title);
  background: var(--color-primary-light);
}

.nav-link.active {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.nav-link.active::before {
  transform: translateX(-50%) scaleX(1);
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
  color: var(--color-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-trigger svg {
  width: 18px;
  height: 18px;
}

.search-trigger:hover {
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
  color: var(--color-title);
  font-weight: var(--font-weight-medium);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow-icon {
  width: 14px;
  height: 14px;
  color: var(--color-muted-light);
  transition: transform var(--transition-fast);
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
  color: var(--color-primary);
  border: 1.5px solid var(--color-border);
}

.btn-login:hover {
  color: var(--color-primary-hover);
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  transform: translateY(-1px);
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
  color: var(--color-title);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.mobile-menu-btn:hover {
  background: var(--color-bg-warm);
}

.mobile-menu-btn svg {
  width: 22px;
  height: 22px;
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
