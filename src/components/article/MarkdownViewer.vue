<template>
  <div class="w-full min-h-full p-5 px-6 rounded-lg bg-t-bg transition-all duration-250 box-border">
    <div
      class="prose max-w-none prose-headings:text-t-title prose-p:text-t-body prose-a:text-t-primary prose-strong:text-t-title prose-code:text-t-primary prose-pre:bg-t-elevated prose-blockquote:border-t-primary prose-li:text-t-body"
      v-html="sanitizedHtml"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DOMPurify from 'dompurify'

const props = defineProps<{
  contentHtml: string
}>()

const sanitizedHtml = computed(() => {
  if (!props.contentHtml) return ''
  return DOMPurify.sanitize(props.contentHtml)
})
</script>
