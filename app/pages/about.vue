<template>
  <AppLayout :show-hero="false">
    <div class="mb-8 pb-4 border-b border-t-border relative">
      <h1 class="text-2xl font-bold text-t-title flex items-center gap-3">
        <span class="text-t-primary">✦</span>
        关于我
      </h1>
      <p class="text-sm text-t-muted mt-1">热爱技术，追求卓越</p>
      <div class="absolute bottom-0 left-0 w-16 md:w-28 h-0.5 bg-t-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.4)]" />
    </div>

    <div class="rounded-xl bg-t-surface border border-t-border p-4 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
      <div class="flex flex-col gap-3">
        <div class="h-5 w-2/5 rounded bg-[rgba(var(--color-primary-rgb),0.06)] animate-pulse" />
        <div class="h-4 w-full rounded bg-[rgba(var(--color-primary-rgb),0.06)] animate-pulse" />
        <div class="h-4 w-4/5 rounded bg-[rgba(var(--color-primary-rgb),0.06)] animate-pulse" />
        <div class="h-4 w-3/5 rounded bg-[rgba(var(--color-primary-rgb),0.06)] animate-pulse" />
      </div>
      <p class="mt-6 text-sm text-t-muted">关于页内容将在数据层接入后由文章接口渲染。</p>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '关于我 | 立里博客',
  description: '立里可（LiliCould），热爱技术，追求卓越。',
})
</script>
