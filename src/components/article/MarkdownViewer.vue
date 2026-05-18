<template>
  <div class="w-full min-h-full p-5 px-6 rounded-lg bg-[#0a0a0f] transition-all duration-250 box-border">
    <div class="prose prose-invert max-w-none prose-headings:text-white prose-p:text-[#e0e0e8] prose-a:text-[#00f0ff] prose-strong:text-white prose-code:text-[#00f0ff] prose-pre:bg-[#1a1a24] prose-blockquote:border-[#00f0ff] prose-li:text-[#e0e0e8]" v-html="sanitizedHtml"></div>
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
