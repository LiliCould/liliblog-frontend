<template>
  <AppLayout :show-hero="false">
    <div class="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div class="mb-8">
        <span class="text-[120px] sm:text-[160px] font-black leading-none text-t-primary opacity-15 select-none">
          404
        </span>
      </div>

      <h2 class="text-xl font-semibold text-t-title mb-2">页面不存在</h2>
      <p class="text-sm text-t-muted max-w-[320px] mb-8">
        你访问的页面可能已被移除、名称已更改，或暂时不可用
      </p>

      <router-link to="/"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary transition-[background-color,box-shadow] duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.2)] hover:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.15)]">
        <Home class="w-4 h-4" />
        返回首页
      </router-link>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { Home } from 'lucide-vue-next'
import AppLayout from '@/components/layout/AppLayout.vue'
</script>
