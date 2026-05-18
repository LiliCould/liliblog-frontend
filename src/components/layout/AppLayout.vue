<template>
  <div class="flex-1">
    <slot v-if="showHero" name="hero"></slot>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-[256px_1fr_256px] gap-6">
        <AppSidebar />

        <div class="min-w-0">
          <slot></slot>
        </div>

        <RightSidebar />
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
