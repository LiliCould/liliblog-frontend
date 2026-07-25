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
          <MarkdownViewer v-else :content-html="markdownHtml" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import MarkdownViewer from '@/components/article/MarkdownViewer.vue'

const props = defineProps<{
  url: string
  fileName: string
  type: 'pdf' | 'markdown'
}>()

defineEmits<{ close: [] }>()

const loading = ref(true)
const markdownHtml = ref('')

async function loadMarkdown() {
  try {
    const response = await fetch(props.url)
    const text = await response.text()
    const { marked } = await import('marked')
    markdownHtml.value = marked.parse(text) as string
  } catch {
    // error state not critical, empty content shown
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.type === 'pdf') {
    loading.value = false
  } else {
    loadMarkdown()
  }
})
</script>
