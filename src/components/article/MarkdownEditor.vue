<template>
  <div class="markdown-editor-wrapper">
    <MdEditor
      v-model="content"
      :theme="'light'"
      :preview="true"
      :toolbarsExclude="['github']"
      @onUploadImg="handleUploadImg"
      @onHtmlChanged="handleHtmlChanged"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { uploadFile } from '@/api/file'
import type { ApiResponse } from '@/types/api.d'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'htmlChanged', html: string): void
}>()

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
}

const processedContent = computed(() => {
  if (!props.modelValue) return ''

  return props.modelValue.replace(/(```[\s\S]*?```|`[^`]+`)/g, (match) => {
    return decodeHtmlEntities(match)
  })
})

const content = ref(processedContent.value)

watch(() => props.modelValue, (val) => {
  const newProcessed = val ? val.replace(/(```[\s\S]*?```|`[^`]+`)/g, (match) => {
    return decodeHtmlEntities(match)
  }) : ''
  if (newProcessed !== content.value) {
    content.value = newProcessed
  }
})

watch(content, (val) => {
  emit('update:modelValue', val)
})

function handleHtmlChanged(html: string) {
  emit('htmlChanged', html)
}

async function handleUploadImg(files: File[], callback: (urls: string[]) => void) {
  const urls: string[] = []
  for (const file of files) {
    try {
      const res = await uploadFile(file, 'article') as unknown as ApiResponse<string>
      const url = res.message?.trim() || res.data
      if (url) {
        urls.push(url)
      }
    } catch {
      // skip failed uploads
    }
  }
  callback(urls)
}
</script>

<style scoped>
.markdown-editor-wrapper {
  width: 100%;
}

.markdown-editor-wrapper :deep(.md-editor) {
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.markdown-editor-wrapper :deep(.md-editor-preview ul) {
  list-style-type: disc !important;
}

.markdown-editor-wrapper :deep(.md-editor-preview ol) {
  list-style-type: decimal !important;
}

.markdown-editor-wrapper :deep(.md-editor-preview ul),
.markdown-editor-wrapper :deep(.md-editor-preview ol) {
  padding-left: 24px !important;
  list-style: inherit !important;
}

/* 确保有序列表正确显示序号 */
.markdown-editor-wrapper :deep(.md-editor-preview ol li) {
  list-style-type: decimal !important;
}
</style>