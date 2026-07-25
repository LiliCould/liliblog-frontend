<template>
  <div class="w-full h-full" ref="editorContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { useTheme } from '@/composables/useTheme'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'input'): void
}>()

const { currentTheme } = useTheme()
const editorContainer = ref<HTMLElement | null>(null)
let vditorInstance: Vditor | null = null

function isLightTheme(): boolean {
  return currentTheme.value === 'light'
}

function getVditorTheme(): 'classic' | 'dark' {
  return isLightTheme() ? 'classic' : 'dark'
}

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

function updateVditorTheme() {
  if (!vditorInstance) return
  const theme = getVditorTheme()
  try {
    vditorInstance.setTheme(theme)
  } catch {
    // ignore if method not available
  }
}

defineExpose({ switchMode })

onMounted(() => {
  if (!editorContainer.value) return

  const vditorTheme = getVditorTheme()
  const isMobile = window.innerWidth < 768

  vditorInstance = new Vditor(editorContainer.value, {
    height: '100%',
    mode: 'wysiwyg',
    cdn: '/vditor',
    theme: vditorTheme,
    icon: 'ant',
    value: props.modelValue || '',
    placeholder: '开始写作...',
    cache: {
      enable: false,
    },
    tab: '\t',
    typewriterMode: !isMobile,
    undoDelay: 800,
    outline: {
      enable: !isMobile,
      position: 'left',
    },
    toolbarConfig: {
      pin: true,
    },
    preview: {
      mode: isMobile ? 'editor' : 'both',
      maxWidth: 768,
      theme: {
        current: vditorTheme,
      },
      hljs: {
        enable: true,
        style: isLightTheme() ? 'github' : 'dracula',
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
        'doge': '/vditor/dist/images/emoji/doge.png',
        'huaji': '/vditor/dist/images/emoji/huaji.gif',
        'trollface': '/vditor/dist/images/emoji/trollface.png',
        'vditor': '/vditor/dist/images/emoji/vditor.png',
        'octocat': '/vditor/dist/images/emoji/octocat.png',
      },
    },
    toolbar: isMobile
      ? ['headings', 'bold', 'italic', '|', 'quote', 'list', 'ordered-list', '|', 'code', 'inline-code', 'link', 'upload', '|', 'undo', 'redo']
      : [
          'headings', 'bold', 'italic', 'strike', '|',
          'line', 'quote', 'list', 'ordered-list', 'check', 'outdent', 'indent', '|',
          'code', 'inline-code', 'link', 'upload', 'table', 'emoji', '|',
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
    customWysiwygToolbar: () => { },
    input: (value: string) => {
      emit('update:modelValue', value)
      emit('input')
    },
    upload: {
      handler: async (files: File[]) => {
        const snippets: string[] = []
        for (const file of files) {
          try {
            const { uploadFile } = await import('@/api/file')
            const isImage = file.type.startsWith('image/')
            const type = isImage ? 'image' : 'file'
            const originalName = file.name
            const cleanName = originalName.replace(/\s/g, '')
            const uploadFileObj = cleanName !== originalName
              ? new File([file], cleanName, { type: file.type })
              : file
            const res = await uploadFile(uploadFileObj, type) as any
            const url = res.message?.trim() || res.data
            if (url) {
              snippets.push(isImage ? `![${originalName}](${url})` : `[${originalName}](${url})`)
            }
          } catch {
            // skip
          }
        }
        if (snippets.length > 0 && vditorInstance) {
          vditorInstance.insertValue(snippets.join('\n'))
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

watch(currentTheme, () => {
  updateVditorTheme()
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
  background: rgba(var(--color-surface-rgb), 0.95) !important;
  backdrop-filter: blur(8px) !important;
  border-bottom: 1px solid rgba(var(--color-primary-rgb), 0.1) !important;
}

.vditor-content {
  background-color: rgba(var(--color-bg-rgb), 0.4) !important;
  border: 1px solid rgba(var(--color-primary-rgb), 0.08) !important;
  border-radius: 0.375rem !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
}

.vditor-reset {
  color: var(--color-body) !important;
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
  background: rgba(var(--color-surface-rgb), 0.95) !important;
  border-right: 1px solid rgba(var(--color-primary-rgb), 0.08) !important;
}

.vditor-outline__title {
  color: var(--color-title) !important;
  border-bottom: 1px solid rgba(var(--color-primary-rgb), 0.08) !important;
}

.vditor-outline__item {
  color: var(--color-muted) !important;
}

.vditor-outline__item--current {
  color: var(--color-primary) !important;
}

.vditor-popover {
  background: rgba(var(--color-surface-rgb), 0.95) !important;
  border: 1px solid rgba(var(--color-primary-rgb), 0.15) !important;
  border-radius: 6px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
}

.vditor-panel {
  background: rgba(var(--color-surface-rgb), 0.95) !important;
  border: 1px solid rgba(var(--color-primary-rgb), 0.15) !important;
  border-radius: 6px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
}

.vditor-hint {
  background: rgba(var(--color-surface-rgb), 0.95) !important;
  border: 1px solid rgba(var(--color-primary-rgb), 0.15) !important;
  border-radius: 6px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
}

.vditor-hint button {
  color: var(--color-body) !important;
}

.vditor-hint button:not(.vditor-menu--disabled):hover,
.vditor-hint button:not(.vditor-menu--disabled):focus {
  background-color: rgba(var(--color-primary-rgb), 0.1) !important;
  color: var(--color-primary) !important;
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
  border: 1px solid rgba(var(--color-primary-rgb), 0.15) !important;
  padding: 6px 12px !important;
  min-width: 60px !important;
}

.vditor-wysiwyg table th {
  background: rgba(var(--color-primary-rgb), 0.06) !important;
  font-weight: 600 !important;
  color: var(--color-primary) !important;
}

.vditor-wysiwyg table tr:nth-child(even) {
  background: rgba(var(--color-bg-rgb), 0.3) !important;
}

.vditor-wysiwyg table tr:hover {
  background: rgba(var(--color-primary-rgb), 0.04) !important;
}

.vditor-toolbar__item .vditor-tooltipped {
  color: var(--color-body) !important;
}

.vditor-toolbar__item:hover .vditor-tooltipped,
.vditor-toolbar__item .vditor-tooltipped:hover {
  color: var(--color-primary) !important;
}

.vditor-reset strong {
  color: var(--color-title) !important;
}

.vditor-reset h1,
.vditor-reset h2,
.vditor-reset h3,
.vditor-reset h4,
.vditor-reset h5,
.vditor-reset h6 {
  color: var(--color-title) !important;
}

.vditor-reset a {
  color: var(--color-primary) !important;
}

.vditor-reset blockquote {
  border-left: 4px solid var(--color-primary) !important;
  color: var(--color-body-secondary) !important;
}

.vditor-reset code {
  color: var(--color-primary) !important;
  background: rgba(var(--color-primary-rgb), 0.08) !important;
}

.vditor-reset hr {
    border-color: rgba(var(--color-primary-rgb), 0.2) !important;
}

.vditor-reset ol {
    list-style-type: decimal !important;
    padding-left: 24px !important;
}

.vditor-reset ul {
    list-style-type: disc !important;
    padding-left: 24px !important;
}

.vditor-reset ol li::marker {
    color: var(--color-primary) !important;
}

.vditor-reset ul li::marker {
    color: var(--color-primary) !important;
}
</style>
