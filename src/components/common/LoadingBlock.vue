<script setup lang="ts">
/**
 * 加载态组件
 * 像素块填充动画效果
 */
interface Props {
  /** 加载提示文字 */
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: '加载中...',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16">
    <!-- 像素块加载动画 -->
    <div class="flex gap-1">
      <div
        v-for="i in 5"
        :key="i"
        class="h-4 w-4 bg-[var(--accent-toxic)]"
        :style="{
          animation: `pixel-blink 1s linear ${i * 0.1}s infinite`,
        }"
      />
    </div>
    <p class="mt-4 font-mono text-sm">
      {{ text }}
    </p>
  </div>
</template>

<style scoped>
@keyframes pixel-blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
}
</style>
