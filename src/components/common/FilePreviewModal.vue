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
        <div class="flex-1 overflow-auto p-4">
          <div v-if="loading" class="flex items-center justify-center h-full">
            <div
              class="w-8 h-8 border-2 border-[rgba(var(--color-primary-rgb),0.3)] border-t-t-primary rounded-full animate-spin">
            </div>
          </div>
          <div v-else-if="error" class="flex items-center justify-center h-full text-t-muted text-sm">
            {{ error }}
          </div>
          <div v-show="!loading && !error && type === 'pdf'" ref="pdfContainer" class="w-full h-full"></div>
          <MarkdownViewer v-if="!loading && !error && type === 'markdown'" :content-html="markdownHtml" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'
import MarkdownViewer from '@/components/article/MarkdownViewer.vue'

const props = defineProps<{
  url: string
  fileName: string
  type: 'pdf' | 'markdown'
}>()

defineEmits<{ close: [] }>()

const loading = ref(true)
const error = ref('')
const markdownHtml = ref('')
const pdfContainer = ref<HTMLElement | null>(null)

async function loadPdf() {
  if (!pdfContainer.value) {
    console.warn('[PDF] container not ready')
    return
  }
  try {
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url
    ).href

    const pdf = await pdfjsLib.getDocument({ url: props.url }).promise
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const scale = 1.5
      const viewport = page.getViewport({ scale })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      canvas.className = 'w-full h-auto mb-4 rounded-lg'
      await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
      pdfContainer.value.appendChild(canvas)
    }
  } catch (e) {
    console.error('[PDF] error:', e)
    error.value = 'PDF 加载失败'
  } finally {
    loading.value = false
  }
}

async function loadMarkdown() {
  try {
    const response = await fetch(props.url)
    const text = await response.text()
    const { marked } = await import('marked')
    markdownHtml.value = marked.parse(text) as string
  } catch {
    error.value = 'Markdown 加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.type === 'pdf') {
    loadPdf()
  } else {
    loadMarkdown()
  }
})

onUnmounted(() => {
  if (pdfContainer.value) {
    pdfContainer.value.innerHTML = ''
  }
})
</script>
