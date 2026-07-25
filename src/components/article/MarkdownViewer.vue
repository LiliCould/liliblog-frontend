<template>
  <div class="w-full min-h-full p-5 px-6 rounded-lg bg-t-bg transition-all duration-250 box-border">
    <div
      class="prose max-w-none prose-headings:text-t-title prose-p:text-t-body prose-a:text-t-primary prose-strong:text-t-title prose-code:text-t-primary prose-pre:bg-t-elevated prose-blockquote:border-t-primary prose-li:text-t-body"
      v-html="sanitizedHtml"
      @click="handleClick"></div>
    <FilePreviewModal v-if="previewState.show" :url="previewState.url" :file-name="previewState.name"
      :type="previewState.type" @close="previewState.show = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import DOMPurify from 'dompurify'
import FilePreviewModal from '@/components/common/FilePreviewModal.vue'

const props = defineProps<{
  contentHtml: string
}>()

const FILE_TYPES: Record<string, { color: string; bg: string; label: string }> = {
  doc:  { color: '#2B579A', bg: '#E8F0FE', label: 'DOC' },
  docx: { color: '#2B579A', bg: '#E8F0FE', label: 'DOC' },
  xls:  { color: '#217346', bg: '#E6F4EA', label: 'XLS' },
  xlsx: { color: '#217346', bg: '#E6F4EA', label: 'XLS' },
  ppt:  { color: '#D24726', bg: '#FDE7E4', label: 'PPT' },
  pptx: { color: '#D24726', bg: '#FDE7E4', label: 'PPT' },
  pdf:  { color: '#E53935', bg: '#FFEBEE', label: 'PDF' },
  zip:  { color: '#F57C00', bg: '#FFF3E0', label: 'ZIP' },
  rar:  { color: '#F57C00', bg: '#FFF3E0', label: 'RAR' },
  '7z':  { color: '#F57C00', bg: '#FFF3E0', label: '7Z' },
  mp4:  { color: '#7B1FA2', bg: '#F3E5F5', label: 'MP4' },
  avi:  { color: '#7B1FA2', bg: '#F3E5F5', label: 'AVI' },
  mov:  { color: '#7B1FA2', bg: '#F3E5F5', label: 'MOV' },
  mp3:  { color: '#E64A19', bg: '#FBE9E7', label: 'MP3' },
  wav:  { color: '#E64A19', bg: '#FBE9E7', label: 'WAV' },
  flac: { color: '#E64A19', bg: '#FBE9E7', label: 'FLAC' },
  txt:  { color: '#616161', bg: '#F5F5F5', label: 'TXT' },
  csv:  { color: '#217346', bg: '#E6F4EA', label: 'CSV' },
  apk:  { color: '#3DDC84', bg: '#E8F5E9', label: 'APK' },
}

const PREVIEWABLE_TYPES = new Set(['pdf', 'md', 'markdown'])

const previewState = reactive({
  show: false,
  url: '',
  name: '',
  type: 'pdf' as 'pdf' | 'markdown',
})

function getFileCardHtml(href: string, text: string): string {
  const ext = href.split('.').pop()?.split('?')[0]?.toLowerCase() || ''
  const fileType = FILE_TYPES[ext]
  if (!fileType) return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`

  const displayName = text || href.split('/').pop() || '未知文件'
  const canPreview = PREVIEWABLE_TYPES.has(ext)
  const previewType = ext === 'pdf' ? 'pdf' : 'markdown'

  const eyeIcon = `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
  const downloadIcon = `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`

  const previewBtn = canPreview
    ? `<button class="file-card__action" data-preview="true" data-url="${href}" data-name="${displayName}" data-type="${previewType}">${eyeIcon}</button>`
    : ''

  return `<div class="file-card">
    <span class="file-card__icon" style="background:${fileType.bg};color:${fileType.color}">${fileType.label}</span>
    <span class="file-card__name">${displayName}</span>
    ${previewBtn}
    <a href="${href}" target="_blank" rel="noopener noreferrer" class="file-card__action">${downloadIcon}</a>
  </div>`
}

function handleClick(e: Event) {
  const target = e.target as HTMLElement
  const btn = target.closest('[data-preview="true"]') as HTMLElement
  if (!btn) return
  e.preventDefault()
  e.stopPropagation()
  previewState.url = btn.dataset.url || ''
  previewState.name = btn.dataset.name || ''
  previewState.type = (btn.dataset.type as 'pdf' | 'markdown') || 'pdf'
  previewState.show = true
}

const sanitizedHtml = computed(() => {
  if (!props.contentHtml) return ''
  let html = DOMPurify.sanitize(props.contentHtml)
  html = html.replace(
    /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi,
    (_match, href, text) => getFileCardHtml(href, text)
  )
  return html
})
</script>

<style>
.file-card {
  display: flex !important;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin: 12px 0;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  cursor: default;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.file-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-sm);
}

.file-card__icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.file-card__name {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-body);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-card__action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: var(--color-muted);
  text-decoration: none !important;
  transition: all 0.2s ease;
}

.file-card__action:hover {
  color: var(--color-primary);
  background: var(--color-elevated);
}
</style>
