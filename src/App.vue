<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import MainLayout from '@/components/layout/MainLayout.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

/**
 * 根组件
 * 根据路由元信息动态切换布局
 */
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// 根据路由布局类型选择对应布局组件
const layoutComponent = computed(() => {
  const layout = route.meta.layout as string
  if (layout === 'admin') return AdminLayout
  if (layout === 'main') return MainLayout
  return null
})

// 初始化：恢复登录状态和主题
onMounted(() => {
  themeStore.initTheme()
  if (authStore.isLoggedIn) {
    authStore.fetchUserInfo()
  }
})
</script>

<template>
  <component :is="layoutComponent" v-if="layoutComponent">
    <router-view />
  </component>
  <router-view v-else />
</template>
