<template>
  <AppLayout :show-hero="true">
    <template #hero>
      <HeroCarousel />
    </template>

    <div class="flex flex-col gap-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-40 rounded-xl bg-t-surface border border-t-border animate-pulse"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '立里博客 | LiliBlog - 立里可的技术与生活分享空间',
  description: '立里博客（LiliBlog）是立里可（LiliCould）的个人博客，分享技术、生活和思考。',
  ogTitle: '立里博客 | LiliBlog',
  ogDescription: '立里可的技术与生活分享空间',
  ogType: 'website',
})
</script>
