<template>
  <PlaceholderPage title="文章详情" description="按 ID 访问的文章详情页，阶段 2 接入数据" />
</template>

<script setup lang="ts">
const route = useRoute()

useSeoMeta({
  title: `文章 #${route.params.id} | 立里博客`,
  robots: 'noindex',
})
</script>
