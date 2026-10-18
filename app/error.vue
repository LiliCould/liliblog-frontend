<template>
  <NuxtLayout name="default">
    <div class="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div class="mb-8">
        <span class="text-[120px] sm:text-[160px] font-black leading-none text-t-primary opacity-15 select-none">
          {{ error?.statusCode || 404 }}
        </span>
      </div>

      <h2 class="text-xl font-semibold text-t-title mb-2">
        {{ error?.statusCode === 404 ? '页面不存在' : '页面出错了' }}
      </h2>
      <p class="text-sm text-t-muted max-w-[320px] mb-8">
        {{ error?.statusCode === 404
          ? '你访问的页面可能已被移除、名称已更改，或暂时不可用'
          : '服务暂时不可用，请稍后再试' }}
      </p>

      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary transition-[background-color,box-shadow] duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.2)] hover:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.15)]"
      >
        <Home class="w-4 h-4" />
        返回首页
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Home } from 'lucide-vue-next'
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  title: `${props.error?.statusCode || 404} | 立里博客`,
  robots: 'noindex',
})
</script>
