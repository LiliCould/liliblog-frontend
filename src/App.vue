<template>
  <div class="app-wrapper">
    <CustomCursor />
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
import CustomCursor from '@/components/common/CustomCursor.vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const chatStore = useChatStore()
const userStore = useUserStore()

const isBlankLayout = computed(() => route.meta.layout === 'blank')

const initChat = () => {
  if (userStore.isLoggedIn) {
    chatStore.initialize()
  }
}

onMounted(() => {
  initChat()
})

watch(() => userStore.isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    chatStore.initialize()
  } else {
    chatStore.closeConnection()
  }
})

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
  cursor: none;
  background-color: #0a0a0f;
  color: #e0e0e8;
}

@media (max-width: 768px) {
  .app-wrapper {
    cursor: auto;
  }
}

.main-content {
  flex: 1;
  padding-top: var(--header-height);
  min-height: calc(100vh - var(--header-height));
  background-color: #0a0a0f;
}
</style>
