<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>
      <div
        class="relative flex flex-col w-[90vw] h-[85vh] max-w-4xl rounded-xl bg-t-surface border border-t-border shadow-[0_0_24px_rgba(var(--color-primary-rgb),0.1)]">
        <div class="flex items-center justify-between px-6 py-4 border-b border-t-border">
          <h2 class="text-base font-semibold text-t-title truncate flex-1 mr-4">{{ fileName }}</h2>
          <button
            class="w-8 h-8 rounded-lg flex items-center justify-center text-t-muted hover:text-t-body hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200"
            @click="$emit('close')">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="flex-1 overflow-hidden p-4">
          <div v-if="loading" class="flex items-center justify-center h-full">
            <div
              class="w-8 h-8 border-2 border-[rgba(var(--color-primary-rgb),0.3)] border-t-t-primary rounded-full animate-spin">
            </div>
          </div>
          <iframe v-else-if="type === 'pdf'" :src="url" class="w-full h-full border-0 rounded-lg"></iframe>
          <video v-else-if="type === 'video'" :src="url" controls
            class="w-full h-full rounded-lg"></video>
          <iframe v-else-if="type === 'markdown'" :srcdoc="markdownDoc" class="w-full h-full border-0 rounded-lg"></iframe>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  url: string
  fileName: string
  type: 'pdf' | 'markdown' | 'video'
}>()

defineEmits<{ close: [] }>()

const loading = ref(true)
const markdownDoc = ref('')

async function loadMarkdown() {
  try {
    const response = await fetch(props.url)
    let text = await response.text()
    text = text.replace(/\\([#\[\]_*`~])/g, '$1')
    const { marked } = await import('marked')
    const html = marked.parse(text) as string
    markdownDoc.value = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    line-height: 1.7;
    color: #1f2937;
    padding: 24px;
    max-width: 100%;
    margin: 0;
  }
  h1, h2, h3, h4 { color: #0f172a; margin-top: 1.5em; margin-bottom: 0.5em; }
  h1 { font-size: 1.75em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
  h2 { font-size: 1.4em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
  a { color: #0284c7; text-decoration: none; }
  a:hover { text-decoration: underline; }
  code {
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.875em;
  }
  pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
  }
  pre code { background: none; padding: 0; color: inherit; }
  blockquote {
    border-left: 4px solid #0284c7;
    margin: 1em 0;
    padding: 0.5em 1em;
    background: #f8fafc;
    color: #475569;
  }
  img { max-width: 100%; border-radius: 8px; margin: 1em 0; }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; }
  th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
  th { background: #f8fafc; font-weight: 600; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 2em 0; }
  ul, ol { padding-left: 1.5em; }
  li { margin: 0.25em 0; }
</style>
</head>
<body>${html}</body>
</html>`
  } catch {
    // error state not critical
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.type === 'pdf' || props.type === 'video') {
    loading.value = false
  } else {
    loadMarkdown()
  }
})
</script>
