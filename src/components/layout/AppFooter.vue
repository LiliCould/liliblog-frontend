<script setup lang="ts">
/**
 * 页脚组件
 * 显示版权信息和技术栈标识
 */
</script>

<template>
  <footer
    class="border-t-2 border-black py-6 dark:border-[var(--neutral-800)]"
  >
    <div class="mx-auto max-w-7xl px-4 text-center">
      <p class="text-sm font-mono text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
        &copy; {{ new Date().getFullYear() }} LiliCould's Blog | Powered by Vue 3 + Vite
      </p>
    </div>
  </footer>
</template>
