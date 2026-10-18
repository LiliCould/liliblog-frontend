<template>
  <ArticleEditorView />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'blank', middleware: 'auth' })

useSeoMeta({
  title: '编辑文章 | 立里博客',
  robots: 'noindex',
})
</script>
