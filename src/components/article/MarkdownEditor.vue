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

function switchMode() {
  if (!vditorInstance || !editorContainer.value) return
  const currentMode = vditorInstance.getCurrentMode()
  const targetMode = currentMode === 'sv' ? 'ir' : 'sv'
  const editModeItem = editorContainer.value.querySelector('.vditor-toolbar__item[data-type="edit-mode"]') as HTMLElement | null
  if (!editModeItem) return
  const targetBtn = editModeItem.querySelector(`button[data-mode="${targetMode}"]`) as HTMLButtonElement | null
  if (targetBtn) {
    targetBtn.click()
  }
}

defineExpose({ switchMode })

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
      'fullscreen',
      'edit-mode',
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
      setTimeout(() => {
        if (vditorInstance) {
          (vditorInstance as any).focus()
        }
      }, 200)
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
  background-color: rgba(17, 17, 24, 0.4) !important;
  border: 1px solid rgba(0, 240, 255, 0.08) !important;
  border-radius: 0.375rem !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
  padding: 0.5rem !important;
  margin: 0.25rem !important;
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

.vditor-toolbar__item[data-type="edit-mode"] {
  display: none !important;
}
</style>