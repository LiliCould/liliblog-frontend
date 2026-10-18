<template>
  <AppLayout :show-hero="false">
    <div class="mb-8 pb-4 border-b border-t-border relative">
      <h1 class="text-2xl font-bold text-t-title flex items-center gap-3">
        <span class="text-t-primary">✦</span>
        {{ title }}
      </h1>
      <p v-if="description" class="text-sm text-t-muted mt-1">{{ description }}</p>
      <div class="absolute bottom-0 left-0 w-16 md:w-28 h-0.5 bg-t-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.4)]" />
    </div>

    <div class="rounded-xl bg-t-surface border border-t-border p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
      <div class="flex items-center gap-3 text-sm text-t-body">
        <span class="w-2 h-2 rounded-full bg-t-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.6)]" />
        <span>页面骨架已迁移，数据与交互将在下一阶段接入。</span>
      </div>
      <div class="mt-6 flex flex-col gap-3">
        <div class="h-4 w-3/5 rounded bg-[rgba(var(--color-primary-rgb),0.06)] animate-pulse" />
        <div class="h-4 w-4/5 rounded bg-[rgba(var(--color-primary-rgb),0.06)] animate-pulse" />
        <div class="h-4 w-2/5 rounded bg-[rgba(var(--color-primary-rgb),0.06)] animate-pulse" />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
