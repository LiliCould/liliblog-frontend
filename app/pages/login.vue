<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none" style="background:repeating-linear-gradient(0deg,transparent,transparent 2px,var(--color-primary) 2px,var(--color-primary) 4px);opacity:var(--scanline-opacity)" />
    <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(var(--grid-line-color) 1px,transparent 1px),linear-gradient(90deg,var(--grid-line-color) 1px,transparent 1px);background-size:40px 40px" />

    <div class="w-full max-w-md relative z-10 panel-glass p-8">
      <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-t-primary via-t-secondary to-t-tertiary rounded-t-panel shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.3)]" />
      <AuthPanel initial-view="login" :allow-register="false" @success="handleSuccess" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const route = useRoute()

useSeoMeta({
  title: '登录 | 立里博客',
  robots: 'noindex',
})

async function handleSuccess(): Promise<void> {
  const redirect = route.query.redirect
  await navigateTo(typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/')
}
</script>
