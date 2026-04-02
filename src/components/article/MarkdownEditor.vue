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
import { ref, watch } from 'vue'
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

const content = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  if (val !== content.value) {
    content.value = val
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
      urls.push(res.data)
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
</style>
