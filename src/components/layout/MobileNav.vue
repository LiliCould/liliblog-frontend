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
.mobile-nav {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mobile-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}

.close-btn {
  font-size: 20px;
  cursor: pointer;
  color: var(--color-muted);
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--color-title);
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
}

.mobile-link:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.mobile-unread-badge {
  background: var(--color-danger);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  min-width: 16px;
  text-align: center;
  margin-left: auto;
}

.mobile-link.logout {
  color: var(--color-danger);
}

.mobile-divider {
  height: 1px;
  background: var(--color-border);
  margin: 8px 20px;
}
</style>
