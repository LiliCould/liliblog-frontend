<template>
  <DialogRoot :open="true" @update:open="onOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-[var(--z-modal)] bg-[var(--color-scrim)] backdrop-blur-sm" />

      <DialogContent
        class="panel-glass fixed left-1/2 top-1/2 z-[var(--z-modal)] flex h-[85dvh] max-h-[90dvh] w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden p-0 outline-none max-md:w-[calc(100vw-1rem)] max-md:max-w-none"
      >
        <DialogTitle class="sr-only">{{ fileName }}</DialogTitle>
        <DialogDescription class="sr-only">文件预览</DialogDescription>

        <div class="flex items-center justify-between px-6 py-4 border-b border-t-border">
          <h2 class="text-base font-semibold text-t-title truncate flex-1 mr-4">{{ fileName }}</h2>
          <DialogClose as-child>
            <button
              class="w-11 h-11 -mr-2 rounded-control flex items-center justify-center text-t-muted hover:text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all duration-200"
              aria-label="关闭预览"
            >
              <X class="w-5 h-5" />
            </button>
          </DialogClose>
        </div>
        <div class="flex-1 overflow-hidden p-4">
          <div v-if="loading" class="flex items-center justify-center h-full">
            <div class="w-8 h-8 border-2 border-[rgba(var(--color-primary-rgb),0.3)] border-t-t-primary rounded-full animate-spin" />
          </div>
          <iframe v-else-if="type === 'pdf'" :src="url" class="w-full h-full border-0 rounded-lg" />
          <video v-else-if="type === 'video'" :src="url" controls class="w-full h-full rounded-lg" />
          <iframe v-else-if="type === 'markdown'" :srcdoc="markdownDoc" class="w-full h-full border-0 rounded-lg" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'

const props = defineProps<{
  url: string
  fileName: string
  type: 'pdf' | 'markdown' | 'video'
}>()

const emit = defineEmits<{ close: [] }>()

function onOpenChange(value: boolean): void {
  if (!value) emit('close')
}

const { currentTheme } = useTheme()

const loading = ref(true)
const rawHtml = ref('')
const markdownDoc = ref('')

function themeValue(name: string, fallback: string): string {
  if (!import.meta.client) return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

function buildMarkdownDoc(html: string): string {
  const surface = themeValue('--color-surface', '#ffffff')
  const title = themeValue('--color-title', '#0f172a')
  const body = themeValue('--color-body', '#334155')
  const bodySecondary = themeValue('--color-body-secondary', '#475569')
  const border = themeValue('--color-border-solid', '#e2e8f0')
  const primary = themeValue('--color-primary', '#0284c7')
  const elevated = themeValue('--color-elevated', '#f1f5f9')
  const codeBg = themeValue('--color-code-bg', '#f1f5f9')
  const scheme = currentTheme.value === 'light' ? 'light' : 'dark'

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  :root { color-scheme: ${scheme}; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif; line-height: 1.7; color: ${body}; background: ${surface}; padding: 24px; max-width: 100%; margin: 0; }
  h1, h2, h3, h4 { color: ${title}; margin-top: 1.5em; margin-bottom: 0.5em; }
  h1, h2 { border-bottom: 1px solid ${border}; padding-bottom: 0.3em; }
  a { color: ${primary}; text-decoration: none; }
  code { background: ${elevated}; color: ${primary}; padding: 2px 6px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.875em; }
  pre { background: ${codeBg}; color: ${body}; padding: 16px; border: 1px solid ${border}; border-radius: 12px; overflow-x: auto; }
  pre code { background: none; padding: 0; color: inherit; }
  blockquote { border-left: 4px solid ${primary}; margin: 1em 0; padding: 0.5em 1em; background: ${elevated}; color: ${bodySecondary}; }
  img { max-width: 100%; border-radius: 12px; margin: 1em 0; }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; }
  th, td { border: 1px solid ${border}; padding: 8px 12px; text-align: left; }
  th { background: ${elevated}; font-weight: 600; }
  hr { border: none; border-top: 1px solid ${border}; margin: 2em 0; }
  ul, ol { padding-left: 1.5em; }
  li { margin: 0.25em 0; }
  li::marker { color: ${primary}; }
</style>
</head>
<body>${html}</body>
</html>`
}

async function loadMarkdown(): Promise<void> {
  try {
    const response = await fetch(props.url)
    let text = await response.text()
    text = text.replace(/\\([#[\]_*`~])/g, '$1')
    const { marked } = await import('marked')
    rawHtml.value = marked.parse(text) as string
    markdownDoc.value = buildMarkdownDoc(rawHtml.value)
  } catch {
    // 预览失败时保持空内容
  } finally {
    loading.value = false
  }
}

watch(currentTheme, () => {
  if (rawHtml.value && props.type === 'markdown') {
    markdownDoc.value = buildMarkdownDoc(rawHtml.value)
  }
})

onMounted(() => {
  if (props.type === 'pdf' || props.type === 'video') {
    loading.value = false
  } else {
    loadMarkdown()
  }
})
</script>
