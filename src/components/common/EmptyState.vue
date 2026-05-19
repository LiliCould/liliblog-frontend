<template>
  <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div class="relative mb-6">
      <Inbox
        class="w-16 h-16 text-t-primary drop-shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.4)] animate-[float_3s_ease-in-out_infinite] relative z-[2]" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] pointer-events-none">
        <div
          class="absolute w-20 h-20 rounded-full opacity-10 bg-t-primary shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.2)] top-5 left-5 animate-[pulse-circle_4s_ease-in-out_infinite]">
        </div>
        <div
          class="absolute w-[60px] h-[60px] rounded-full opacity-10 bg-t-secondary shadow-[0_0_20px_rgba(var(--color-secondary-rgb),0.2)] top-[30px] right-2.5 animate-[pulse-circle_4s_ease-in-out_infinite_1s]">
        </div>
        <div
          class="absolute w-10 h-10 rounded-full opacity-10 bg-[#b967ff] shadow-[0_0_20px_rgba(185,103,255,0.2)] bottom-2.5 left-10 animate-[pulse-circle_4s_ease-in-out_infinite_2s]">
        </div>
      </div>
    </div>

    <h3 class="text-lg font-semibold text-t-primary mb-1">{{ message }}</h3>
    <p class="text-sm text-t-muted max-w-[280px]">这里还没有内容哦~</p>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'

withDefaults(defineProps<{
  message?: string
}>(), {
  message: '暂无数据',
})
</script>
