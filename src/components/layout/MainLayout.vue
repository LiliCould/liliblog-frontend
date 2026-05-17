<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import LeftSidebar from './LeftSidebar.vue'
import RightSidebar from './RightSidebar.vue'
import NoiseOverlay from '@/components/ui/NoiseOverlay.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg-canvas">
    <AppHeader />
    <div class="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <!-- 左侧边栏：桌面端显示，移动端隐藏 -->
        <aside class="hidden md:block md:col-span-3 lg:col-span-3">
          <div class="sticky top-24">
            <LeftSidebar />
          </div>
        </aside>

        <!-- 主内容区 -->
        <main class="col-span-1 md:col-span-9 lg:col-span-6 min-h-[500px]">
          <slot />
        </main>

        <!-- 右侧边栏：桌面端显示，移动端隐藏 -->
        <aside class="hidden lg:block lg:col-span-3">
          <div class="sticky top-24">
            <RightSidebar />
          </div>
        </aside>
      </div>
    </div>
    <AppFooter />
    <NoiseOverlay />
  </div>
</template>
