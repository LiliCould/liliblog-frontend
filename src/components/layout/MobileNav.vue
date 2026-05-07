<template>
  <el-drawer
    v-model="appStore.isMobileNavOpen"
    direction="rtl"
    :size="280"
    :show-close="false"
    :with-header="false"
  >
    <div class="mobile-nav">
      <div class="mobile-nav-header">
        <span class="logo-text">LiliBlog</span>
        <el-icon class="close-btn" @click="appStore.closeMobileNav()"><Close /></el-icon>
      </div>

      <div class="mobile-nav-body">
        <template v-if="userStore.isLoggedIn">
          <div class="mobile-user-info">
            <el-avatar :size="48" :src="userStore.avatar || undefined">
              {{ userStore.nickname?.charAt(0) || 'U' }}
            </el-avatar>
            <div class="user-detail">
              <div class="user-name">{{ userStore.nickname || userStore.username }}</div>
              <div class="user-role">{{ userStore.userInfo?.role || '用户' }}</div>
            </div>
          </div>
        </template>

        <nav class="mobile-links">
          <a class="mobile-link" @click="navigate('/')">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </a>
          <a class="mobile-link" @click="navigate('/about')">
            <el-icon><UserFilled /></el-icon>
            <span>关于我</span>
          </a>
          <a class="mobile-link" @click="navigate('/chat')">
            <el-icon><ChatLineSquare /></el-icon>
            <span>聊天室</span>
            <span v-if="chatStore.unreadCount > 0 && !chatStore.isChatRoomActive" class="mobile-unread-badge">
              {{ chatStore.unreadCount > 99 ? '99+' : chatStore.unreadCount }}
            </span>
          </a>
          <a class="mobile-link" @click="navigate('/search')">
            <el-icon><Search /></el-icon>
            <span>搜索</span>
          </a>

          <template v-if="userStore.isLoggedIn">
            <div class="mobile-divider"></div>
            <a class="mobile-link" @click="navigate('/manage/editor')">
              <el-icon><EditPen /></el-icon>
              <span>写文章</span>
            </a>
            <a class="mobile-link" @click="navigate('/manage/articles')">
              <el-icon><Document /></el-icon>
              <span>我的文章</span>
            </a>
            <a class="mobile-link" @click="navigate('/profile')">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </a>
            <div class="mobile-divider"></div>
            <a class="mobile-link logout" @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </a>
          </template>
          <template v-else>
            <div class="mobile-divider"></div>
            <a class="mobile-link" @click="navigate('/login')">
              <el-icon><User /></el-icon>
              <span>登录</span>
            </a>
            <a class="mobile-link" @click="navigate('/register')">
              <el-icon><UserFilled /></el-icon>
              <span>注册</span>
            </a>
          </template>
        </nav>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
// import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Close, HomeFilled, Search, EditPen, Document, User, UserFilled, SwitchButton, ChatLineSquare } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { useChatStore } from '@/stores/chat'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
const chatStore = useChatStore()

function navigate(path: string) {
  appStore.closeMobileNav()
  router.push(path)
}

function handleLogout() {
  appStore.closeMobileNav()
  userStore.logout()
}

// 只有在进入聊天室页面时才初始化
</script>

<style scoped>
:global(.el-drawer.rtl) {
  background: rgba(10, 10, 15, 0.95) !important;
  border-left: 1px solid rgba(0, 240, 255, 0.15);
}

:global(.el-drawer__body) {
  background: transparent;
  padding: 0;
}

:global(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.6) !important;
}

.mobile-nav {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(10, 10, 15, 0.95);
}

.mobile-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  position: relative;
}

.mobile-nav-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
  opacity: 0.4;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.3);
}

.close-btn {
  font-size: 20px;
  cursor: pointer;
  color: var(--color-muted);
  transition: all 0.2s;
}

.close-btn:hover {
  color: var(--color-primary);
  filter: drop-shadow(0 0 4px rgba(0, 240, 255, 0.4));
}

.mobile-nav-body {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  margin-bottom: 8px;
}

.user-detail {
  flex: 1;
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-title);
}

.user-role {
  font-size: 12px;
  color: var(--color-muted);
  margin-top: 2px;
}

.mobile-links {
  display: flex;
  flex-direction: column;
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  font-size: 14px;
  color: var(--color-body);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.mobile-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: height 0.2s ease;
  box-shadow: 0 0 6px rgba(0, 240, 255, 0.4);
}

.mobile-link:hover {
  background: rgba(0, 240, 255, 0.06);
  color: var(--color-primary);
}

.mobile-link:hover::before {
  height: 60%;
}

.mobile-unread-badge {
  background: var(--color-accent);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  min-width: 16px;
  text-align: center;
  margin-left: auto;
  box-shadow: 0 0 6px rgba(255, 45, 120, 0.4);
}

.mobile-link.logout {
  color: var(--color-danger);
}

.mobile-link.logout:hover {
  background: rgba(255, 45, 120, 0.08);
  color: var(--color-danger);
}

.mobile-divider {
  height: 1px;
  background: var(--color-border);
  margin: 8px 20px;
  position: relative;
}

.mobile-divider::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.2), transparent);
}
</style>
