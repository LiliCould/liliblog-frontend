<template>
  <header class="app-header">
    <div class="header-inner page-container">
      <router-link to="/" class="logo">
        <span class="logo-text">LiliBlog</span>
      </router-link>

      <nav class="desktop-nav">
        <router-link to="/" class="nav-link" active-class="active">首页</router-link>
        <div class="search-trigger" @click="goSearch">
          <el-icon><Search /></el-icon>
          <span>搜索文章</span>
        </div>
      </nav>

      <div class="header-right">
        <template v-if="userStore.isLoggedIn">
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-avatar-wrapper">
              <el-avatar :size="32" :src="userStore.avatar || undefined">
                {{ userStore.nickname?.charAt(0) || 'U' }}
              </el-avatar>
              <span class="username-text">{{ userStore.nickname || userStore.username }}</span>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="myArticles">我的文章</el-dropdown-item>
                <el-dropdown-item command="write" divided>写文章</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <router-link to="/login" class="btn-login">登录</router-link>
          <router-link to="/register" class="btn-register">注册</router-link>
        </template>

        <div class="mobile-menu-btn" @click="appStore.toggleMobileNav()">
          <el-icon :size="22"><Menu /></el-icon>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Search, ArrowDown, Menu } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

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
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
}

.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.5px;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  color: var(--color-body);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  padding: 6px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.nav-link.active,
.nav-link:hover {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.search-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--color-bg);
  border-radius: var(--radius-full);
  color: var(--color-muted);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.search-trigger:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
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
  padding: 4px 8px;
  border-radius: var(--radius-full);
  transition: background 0.2s;
}

.user-avatar-wrapper:hover {
  background: var(--color-bg);
}

.username-text {
  font-size: 13px;
  color: var(--color-title);
  font-weight: 500;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow-icon {
  font-size: 12px;
  color: var(--color-muted);
}

.btn-login {
  padding: 6px 16px;
  font-size: 13px;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  border-radius: var(--radius-full);
  transition: background 0.2s;
}

.btn-login:hover {
  background: var(--color-primary-light);
}

.btn-register {
  padding: 6px 16px;
  font-size: 13px;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: background 0.2s;
}

.btn-register:hover {
  background: var(--color-primary-hover);
}

.mobile-menu-btn {
  display: none;
  cursor: pointer;
  padding: 4px;
  color: var(--color-title);
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .username-text {
    display: none;
  }

  .arrow-icon {
    display: none;
  }

  .btn-login,
  .btn-register {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }
}
</style>
