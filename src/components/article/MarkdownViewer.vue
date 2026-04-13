<template>
  <div class="markdown-viewer" :style="{
    backgroundColor: themeBgColor,
    color: themeTextColor,
  }">
    <div class="theme-switcher">
      <el-dropdown trigger="click" @command="handlePreviewThemeChange">
        <el-button size="small" text>
          <el-icon>
            <Document />
          </el-icon>
          预览主题: {{ currentPreviewThemeLabel }}
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="theme in previewThemes" :key="theme.value" :command="theme.value"
              :class="{ active: currentPreviewTheme === theme.value }">
              {{ theme.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown trigger="click" @command="handleCodeThemeChange">
        <el-button size="small" text>
          <el-icon>
            <Tickets />
          </el-icon>
          代码主题: {{ currentCodeThemeLabel }}
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="theme in codeThemes" :key="theme.value" :command="theme.value"
              :class="{ active: currentCodeTheme === theme.value }">
              {{ theme.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <MdPreview :id="editorId" :modelValue="processedContent" :previewTheme="currentPreviewTheme"
      :codeTheme="currentCodeTheme" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { Document, Tickets } from '@element-plus/icons-vue'

const props = defineProps<{
  content: string
}>()

const editorId = 'article-preview'

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
  if (!props.content) return ''

  return props.content.replace(/(```[\s\S]*?```|`[^`]+`)/g, (match) => {
    return decodeHtmlEntities(match)
  })
})

interface ThemeOption {
  label: string
  value: string
}

interface ThemeConfig {
  bg: string
  text: string
}

type PreviewThemeValue = 'default' | 'github' | 'vuepress' | 'mk-cute' | 'smart-blue' | 'cyanosis'

const previewThemes: ThemeOption[] = [
  { label: '默认', value: 'default' },
  { label: 'GitHub', value: 'github' },
  { label: 'VuePress', value: 'vuepress' },
  { label: '可爱', value: 'mk-cute' },
  { label: '智能蓝', value: 'smart-blue' },
  { label: '青色', value: 'cyanosis' },
]

const codeThemes: ThemeOption[] = [
  { label: 'Atom', value: 'atom' },
  { label: 'A11y', value: 'a11y' },
  { label: 'GitHub', value: 'github' },
  { label: '渐变', value: 'gradient' },
  { label: 'Kimbie', value: 'kimbie' },
  { label: 'Paraiso', value: 'paraiso' },
  { label: 'QtCreator', value: 'qtcreator' },
  { label: 'StackOverflow', value: 'stackoverflow' },
]

const currentPreviewTheme = ref<PreviewThemeValue>('github')
const currentCodeTheme = ref<string>('atom')

const themeConfig: Record<PreviewThemeValue, ThemeConfig> = {
  default: { bg: '#ffffff', text: '#333333' },
  github: { bg: '#ffffff', text: '#24292f' },
  vuepress: { bg: '#ffffff', text: '#2c3e50' },
  'mk-cute': { bg: '#ffffff', text: '#333333' },
  'smart-blue': { bg: '#f7f8fa', text: '#333333' },
  cyanosis: { bg: '#f7f8fa', text: '#333333' },
}

const themeBgColor = ref<string>(themeConfig[currentPreviewTheme.value].bg)
const themeTextColor = ref<string>(themeConfig[currentPreviewTheme.value].text)

const currentPreviewThemeLabel = computed(() => {
  return previewThemes.find(t => t.value === currentPreviewTheme.value)?.label || currentPreviewTheme.value
})

const currentCodeThemeLabel = computed(() => {
  return codeThemes.find(t => t.value === currentCodeTheme.value)?.label || currentCodeTheme.value
})

watch(currentPreviewTheme, (val: PreviewThemeValue) => {
  themeBgColor.value = themeConfig[val].bg
  themeTextColor.value = themeConfig[val].text
})

const handlePreviewThemeChange = (theme: string) => {
  currentPreviewTheme.value = theme as PreviewThemeValue
}

const handleCodeThemeChange = (theme: string) => {
  currentCodeTheme.value = theme
}
</script>

<style scoped>
.markdown-viewer {
  width: 100%;
  min-height: 100%;
  padding: 20px 24px;
  border-radius: 8px;
  transition: all 0.25s ease;
  box-sizing: border-box;
}

.theme-switcher {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 8px 0;
  border-bottom: 1px solid var(--el-border-color-light);
}

.theme-switcher :deep(.el-button) {
  font-size: 13px;
}

.theme-switcher :deep(.el-button:hover) {
  color: var(--el-color-primary);
}

.theme-switcher :deep(.el-dropdown-menu__item.active) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.markdown-viewer :deep(.md-editor-preview),
.markdown-viewer :deep(.md-editor-preview-wrapper),
.markdown-viewer :deep(.md-editor-content) {
  background: transparent !important;
  padding: 0 !important;
  min-height: auto !important;
}

.markdown-viewer :deep(.pie-chart) {
  display: flex;
  justify-content: center;
  align-items: center;
}

.markdown-viewer :deep(.md-editor-preview img) {
  max-width: 100%;
}

.markdown-viewer :deep(.md-editor-preview blockquote) {
  border-left-color: var(--el-color-primary);
}

.markdown-viewer :deep(.md-editor-preview ul) {
  list-style-type: disc !important;
}

.markdown-viewer :deep(.md-editor-preview ol) {
  list-style-type: decimal !important;
}

.markdown-viewer :deep(.md-editor-preview ul),
.markdown-viewer :deep(.md-editor-preview ol) {
  padding-left: 24px !important;
  list-style: inherit !important;
}

/* 确保有序列表正确显示序号 */
.markdown-viewer :deep(.md-editor-preview ol li) {
  list-style-type: decimal !important;
}
</style>