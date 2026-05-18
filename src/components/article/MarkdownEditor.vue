<template>
  <div class="w-full" ref="editorContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorContainer = ref<HTMLElement | null>(null)
let vditorInstance: Vditor | null = null

onMounted(() => {
  if (!editorContainer.value) return

  vditorInstance = new Vditor(editorContainer.value, {
    height: 'auto',
    mode: 'ir',
    theme: 'dark',
    icon: 'ant',
    value: props.modelValue || '',
    cache: {
      enable: false,
    },
    preview: {
      theme: {
        current: 'dark',
      },
      hljs: {
        style: 'dracula',
      },
    },
    toolbar: [
      'headings', 'bold', 'italic', 'strike', '|',
      'line', 'quote', 'list', 'ordered-list', 'check', '|',
      'code', 'inline-code', 'link', 'upload', 'table', '|',
      'undo', 'redo', '|',
      'fullscreen', 'preview',
    ],
    input: (value: string) => {
      emit('update:modelValue', value)
    },
    upload: {
      handler: async (files: File[]) => {
        const urls: string[] = []
        for (const file of files) {
          try {
            const { uploadFile } = await import('@/api/file')
            const res = await uploadFile(file, 'article') as any
            const url = res.message?.trim() || res.data
            if (url) {
              urls.push(url)
            }
          } catch {
            // skip
          }
        }
        if (urls.length > 0 && vditorInstance) {
          vditorInstance.insertValue(urls.map(url => `![](${url})`).join('\n'))
        }
        return null
      },
    },
    after: () => {
      if (vditorInstance && props.modelValue) {
        vditorInstance.setValue(props.modelValue)
      }
    },
  })
})

watch(() => props.modelValue, (val) => {
  if (vditorInstance && val !== vditorInstance.getValue()) {
    vditorInstance.setValue(val || '')
  }
})

onUnmounted(() => {
  if (vditorInstance) {
    vditorInstance.destroy()
    vditorInstance = null
  }
})
</script>
