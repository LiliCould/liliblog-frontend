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
  const targetMode = currentMode === 'sv' ? 'wysiwyg' : 'sv'
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
    mode: 'wysiwyg',
    theme: 'dark',
    icon: 'ant',
    value: props.modelValue || '',
    placeholder: '开始写作...',
    cache: {
      enable: false,
    },
    tab: '\t',
    typewriterMode: true,
    undoDelay: 800,
    outline: {
      enable: true,
      position: 'left',
    },
    toolbarConfig: {
      pin: true,
    },
    preview: {
      mode: 'both',
      maxWidth: 768,
      theme: {
        current: 'dark',
      },
      hljs: {
        enable: true,
        style: 'dracula',
        lineNumber: true,
      },
      markdown: {
        autoSpace: true,
        paragraphBeginningSpace: true,
        fixTermTypo: true,
        toc: true,
        footnotes: true,
        codeBlockPreview: true,
        mathBlockPreview: true,
      },
    },
    hint: {
      parse: true,
      emoji: {
        '+1': '👍',
        '-1': '👎',
        'confused': '😕',
        'eyes': '👀',
        'heart': '❤️',
        'rocket': '🚀',
        'smile': '😄',
        'tada': '🎉',
      },
    },
    toolbar: [
      'headings', 'bold', 'italic', 'strike', '|',
      'line', 'quote', 'list', 'ordered-list', 'check', 'outdent', 'indent', '|',
      'code', 'inline-code', 'link', 'upload', 'table', '|',
      'undo', 'redo', '|',
      'outline', 'fullscreen', 'edit-mode',
      {
        name: 'more',
        toolbar: [
          'both',
          'code-theme',
          'content-theme',
          'export',
          'preview',
        ],
      },
    ],
    customWysiwygToolbar: () => {},
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
          vditorInstance.focus()
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
}

.vditor-reset {
  color: #e0e0e8 !important;
}

.vditor-wysiwyg {
  background-color: transparent !important;
}

.vditor-wysiwyg pre.vditor-reset {
  background-color: transparent !important;
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

.vditor-outline {
  background: rgba(17, 17, 24, 0.95) !important;
  border-right: 1px solid rgba(0, 240, 255, 0.08) !important;
}

.vditor-outline__title {
  color: #e0e0e8 !important;
  border-bottom: 1px solid rgba(0, 240, 255, 0.08) !important;
}

.vditor-outline__item {
  color: #9ca3af !important;
}

.vditor-outline__item--current {
  color: #00f0ff !important;
}

.vditor-popover {
  background: rgba(17, 17, 24, 0.95) !important;
  border: 1px solid rgba(0, 240, 255, 0.15) !important;
  border-radius: 6px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
}

.vditor-panel {
  background: rgba(17, 17, 24, 0.95) !important;
  border: 1px solid rgba(0, 240, 255, 0.15) !important;
  border-radius: 6px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
}

.vditor-hint {
  background: rgba(17, 17, 24, 0.95) !important;
  border: 1px solid rgba(0, 240, 255, 0.15) !important;
  border-radius: 6px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
}

.vditor-hint button {
  color: #e0e0e8 !important;
}

.vditor-hint button:not(.vditor-menu--disabled):hover,
.vditor-hint button:not(.vditor-menu--disabled):focus {
  background-color: rgba(0, 240, 255, 0.1) !important;
  color: #00f0ff !important;
}

.vditor-toolbar__item[data-type="edit-mode"] {
  display: none !important;
}

.vditor-wysiwyg table {
  border-collapse: collapse !important;
  width: auto !important;
}

.vditor-wysiwyg table th,
.vditor-wysiwyg table td {
  border: 1px solid rgba(0, 240, 255, 0.15) !important;
  padding: 6px 12px !important;
  min-width: 60px !important;
}

.vditor-wysiwyg table th {
  background: rgba(0, 240, 255, 0.06) !important;
  font-weight: 600 !important;
  color: #00f0ff !important;
}

.vditor-wysiwyg table tr:nth-child(even) {
  background: rgba(10, 10, 15, 0.3) !important;
}

.vditor-wysiwyg table tr:hover {
  background: rgba(0, 240, 255, 0.04) !important;
}
</style>
