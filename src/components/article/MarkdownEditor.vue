<template>
  <div class="w-full h-full" ref="editorContainer"></div>
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
  (e: 'input'): void
}>()

const editorContainer = ref<HTMLElement | null>(null)
let vditorInstance: Vditor | null = null

function setMode(mode: 'ir' | 'sv') {
  if (vditorInstance) {
    (vditorInstance as any).setMode(mode)
  }
}

defineExpose({ setMode })

onMounted(() => {
  if (!editorContainer.value) return

  vditorInstance = new Vditor(editorContainer.value, {
    height: '100%',
    mode: 'ir',
    theme: 'dark',
    icon: 'ant',
    value: props.modelValue || '',
    cache: {
      enable: false,
    },
    tab: '\t',
    toolbarConfig: {
      sticky: true,
    } as any,
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
      {
        name: 'mode-switch',
        tip: '切换源码/渲染模式',
        icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3L2 8L5.5 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 3L14 8L10.5 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        click: () => {
          if (!vditorInstance) return
          const currentMode = (vditorInstance as any).getCurrentMode()
          if (currentMode === 'sv') {
            (vditorInstance as any).setMode('ir')
          } else {
            (vditorInstance as any).setMode('sv')
          }
        },
      },
    ],
    input: (value: string) => {
      emit('update:modelValue', value)
      emit('input')
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

<style>
.vditor {
  border: none !important;
  background-color: transparent !important;
}
.vditor-toolbar {
  position: sticky !important;
  top: 0 !important;
  z-index: 10 !important;
  background: rgba(17, 17, 24, 0.95) !important;
  backdrop-filter: blur(8px) !important;
  border-bottom: 1px solid rgba(0, 240, 255, 0.1) !important;
}
.vditor-content {
  background-color: transparent !important;
}
.vditor-reset {
  background-color: transparent !important;
  color: #e0e0e8 !important;
}
.vditor-ir pre.vditor-reset {
  background-color: transparent !important;
}
.vditor-sv {
  background-color: transparent !important;
}
.vditor-preview {
  background-color: transparent !important;
}
</style>