<template>
  <div class="app-wrapper">
    <KleeCursor />
    <template v-if="isBlankLayout">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </template>
    <template v-else>
      <AppHeader />
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <AppFooter />
      <MobileNav />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import KleeCursor from '@/components/common/KleeCursor.vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const chatStore = useChatStore()
const userStore = useUserStore()

const isBlankLayout = computed(() => route.meta.layout === 'blank')

// 初始化聊天连接
const initChat = () => {
  if (userStore.isLoggedIn) {
    chatStore.initialize()
  }
}

onMounted(() => {
  initChat()
})

// 监听登录状态变化
watch(() => userStore.isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    chatStore.initialize()
  } else {
    chatStore.closeConnection()
  }
})

// 监听路由变化，设置聊天室激活状态
watch(() => route.path, (path) => {
  if (path === '/chat') {
    chatStore.setChatRoomActive(true)
  } else {
    chatStore.setChatRoomActive(false)
  }
}, { immediate: true })
</script>

<style>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: var(--header-height);
  min-height: calc(100vh - var(--header-height));
}
</style>
