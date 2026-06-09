<template>
  <div class="app-wrapper min-h-screen bg-t-bg text-t-body">
    <template v-if="layout === 'blank'">
      <router-view v-slot="{ Component, route: viewRoute }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="viewRoute.path" />
        </transition>
      </router-view>
    </template>
    <template v-else-if="layout === 'admin'">
      <AdminLayout>
        <router-view v-slot="{ Component, route: viewRoute }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="viewRoute.path" />
          </transition>
        </router-view>
      </AdminLayout>
    </template>
    <template v-else>
      <AppHeader />
      <main class="main-content pt-16 min-h-screen bg-t-bg pb-14 md:pb-0">
        <router-view v-slot="{ Component, route: viewRoute }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="viewRoute.path" />
          </transition>
        </router-view>
      </main>
      <AppFooter />
      <MobileNav />
      <MobileBottomNav />
    </template>
    <ToastContainer />
    <AuthModal />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import { useTheme } from '@/composables/useTheme'
import { useTokenRefresh } from '@/composables/useTokenRefresh'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const appStore = useAppStore()
const { initTheme, destroyTheme } = useTheme()
useTokenRefresh()

const layout = computed(() => {
  if (route.meta.layout === 'blank') return 'blank'
  if (route.meta.layout === 'admin') return 'admin'
  return 'default'
})

onMounted(() => {
  initTheme()
  appStore.initResizeListener()
})

onUnmounted(() => {
  destroyTheme()
  appStore.destroyResizeListener()
})
</script>
