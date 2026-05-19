<template>
  <div class="app-wrapper min-h-screen bg-t-bg text-t-body">
    <template v-if="layout === 'blank'">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </template>
    <template v-else-if="layout === 'admin'">
      <AdminLayout>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </AdminLayout>
    </template>
    <template v-else>
      <AppHeader />
      <main class="main-content pt-16 min-h-screen bg-t-bg">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <AppFooter />
      <MobileNav />
    </template>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const { initTheme } = useTheme()

const layout = computed(() => {
  if (route.meta.layout === 'blank') return 'blank'
  if (route.meta.layout === 'admin') return 'admin'
  return 'default'
})

onMounted(initTheme)
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
