<template>
  <div class="min-h-screen flex items-center justify-center bg-t-bg p-4 relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none" style="background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,240,255,0.015) 2px,rgba(0,240,255,0.015) 4px)" />
    <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(rgba(0,240,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,0.03) 1px,transparent 1px);background-size:40px 40px" />

    <div class="w-full max-w-md relative z-10 rounded-xl bg-t-surface border border-t-border p-8 shadow-[0_2px_20px_rgba(0,0,0,0.3)]">
      <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00f0ff] via-[#ff2d78] to-[#a3e635] rounded-t-xl shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.3)]" />
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
