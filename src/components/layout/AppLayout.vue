<template>
  <div class="flex-1">
    <div v-if="showHero" class="hero-wrapper max-md:hidden">
      <slot name="hero"></slot>
    </div>

    <div class="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 py-6 md:py-8">
      <div class="grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-x-8 gap-y-6">
        <AppSidebar />

        <div class="min-w-0">
          <slot></slot>
        </div>

        <RightSidebar>
          <template #top><slot name="rightSidebarTop"></slot></template>
          <slot name="rightSidebar"></slot>
        </RightSidebar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
import RightSidebar from './RightSidebar.vue'

defineProps<{
  showHero?: boolean
}>()
</script>
