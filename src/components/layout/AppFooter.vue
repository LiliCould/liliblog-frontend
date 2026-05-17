<script setup lang="ts">
</script>

<template>
  <footer class="border-t border-border py-8 mt-auto">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm font-bold text-text-title">立里博客</span>
          <span class="text-sm text-text-meta">LiliBlog</span>
        </div>
        <p class="text-xs text-text-meta">
          &copy; {{ new Date().getFullYear() }} 立里博客. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
