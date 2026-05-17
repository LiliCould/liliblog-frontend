<script setup lang="ts">
import { watch } from 'vue'
import LeftSidebar from './LeftSidebar.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

watch(
  () => props.open,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

const close = () => {
  emit('update:open', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="fixed inset-0 z-[100] md:hidden">
        <!-- 遮罩层 -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="close"
        />
        <!-- 抽屉内容 -->
        <div class="absolute left-0 top-0 h-full w-72 bg-bg-canvas border-r border-border p-6 overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <span class="text-lg font-black text-text-title">立里博客</span>
            <button
              class="p-2 rounded-lg text-text-body hover:bg-bg-surface"
              @click="close"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <LeftSidebar />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0ms;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
</style>
