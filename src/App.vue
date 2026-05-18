<template>
  <div class="app-wrapper min-h-screen bg-[#0a0a0f] text-[#e0e0e8]">
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
      <main class="main-content pt-16 min-h-screen bg-[#0a0a0f]">
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const route = useRoute()

const layout = computed(() => {
  if (route.meta.layout === 'blank') return 'blank'
  if (route.meta.layout === 'admin') return 'admin'
  return 'default'
})
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
