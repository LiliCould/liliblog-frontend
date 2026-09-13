<template>
  <div class="w-full min-h-full p-5 px-6 rounded-lg bg-t-bg transition-all duration-250 box-border">
    <div
      ref="viewerEl"
      class="prose max-w-none prose-headings:text-t-title prose-p:text-t-body prose-a:text-t-primary prose-strong:text-t-title prose-code:text-t-primary prose-pre:bg-t-elevated prose-blockquote:border-t-primary prose-li:text-t-body"
      v-html="sanitizedHtml"
      @click="handleClick"></div>
    <FilePreviewModal v-if="previewState.show" :url="previewState.url" :file-name="previewState.name"
      :type="previewState.type" @close="previewState.show = false" />
    <Teleport to="body">
      <div v-if="externalLinkState.show" class="fixed inset-0 z-[1200] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="externalLinkState.show = false"></div>
        <div class="relative w-full max-w-md mx-4 rounded-xl bg-t-surface border border-t-border p-6 shadow-[0_0_24px_rgba(var(--color-primary-rgb),0.1)]">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full bg-[rgba(var(--color-warning-rgb,217,119,6),0.1)] flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-[var(--color-warning,#d97706)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <path d="M12 9v4"/><path d="M12 17h.01"/>
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-t-title">您即将离开本站</h2>
          </div>
          <div class="mb-6">
            <p class="text-t-body mb-3">您正在访问的外部链接：</p>
            <div class="px-3 py-2 rounded-lg bg-t-elevated border border-t-border">
              <p class="text-sm text-t-muted break-all line-clamp-2">{{ externalLinkState.url }}</p>
            </div>
            <p class="text-t-body-secondary text-sm mt-3">本站不对第三方网站的内容、安全性或隐私保护措施负责。请确认您信任该网站后再继续访问。</p>
          </div>
          <div class="flex justify-end gap-3">
            <button class="px-4 py-2 text-sm text-t-muted border border-t-border hover:text-t-body transition-colors rounded-lg" @click="externalLinkState.show = false">取消</button>
            <button class="px-4 py-2 text-sm font-semibold text-white bg-t-primary hover:opacity-90 transition-all rounded-lg" @click="openExternalLink">继续访问</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from 'vue'
import DOMPurify from 'dompurify'
import FilePreviewModal from '@/components/common/FilePreviewModal.vue'
import { highlightCodeBlocks } from '@/utils/highlight'

const props = defineProps<{
  contentHtml: string
}>()

const viewerEl = ref<HTMLElement | null>(null)

function highlight() {
  if (viewerEl.value) highlightCodeBlocks(viewerEl.value)
}

onMounted(highlight)
watch(() => props.contentHtml, highlight, { flush: 'post' })

const FILE_TYPES: Record<string, { color: string; bg: string; label: string }> = {
  doc:  { color: '#2B579A', bg: '#E8F0FE', label: 'DOC' },
  docx: { color: '#2B579A', bg: '#E8F0FE', label: 'DOC' },
  xls:  { color: '#217346', bg: '#E6F4EA', label: 'XLS' },
  xlsx: { color: '#217346', bg: '#E6F4EA', label: 'XLS' },
  ppt:  { color: '#D24726', bg: '#FDE7E4', label: 'PPT' },
  pptx: { color: '#D24726', bg: '#FDE7E4', label: 'PPT' },
  pdf:  { color: '#E53935', bg: '#FFEBEE', label: 'PDF' },
  md:   { color: '#64748b', bg: '#f1f5f9', label: 'MD' },
  markdown: { color: '#64748b', bg: '#f1f5f9', label: 'MD' },
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

const PREVIEWABLE_TYPES = new Set(['pdf', 'md', 'markdown', 'mp4', 'avi', 'mov'])

const previewState = reactive({
  show: false,
  url: '',
  name: '',
  type: 'pdf' as 'pdf' | 'markdown' | 'video',
})

const externalLinkState = reactive({
  show: false,
  url: '',
})

function isLilicouldDomain(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return hostname === 'lilicould.cn' || hostname.endsWith('.lilicould.cn')
  } catch {
    return false
  }
}

function getFileCardHtml(href: string, text: string): string {
  if (!isLilicouldDomain(href)) {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" data-external="true" data-url="${href}">${text}</a>`
  }

  const ext = href.split('.').pop()?.split('?')[0]?.toLowerCase() || ''
  const fileType = FILE_TYPES[ext]
  if (!fileType) return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`

  const displayName = text || href.split('/').pop() || '未知文件'
  const canPreview = PREVIEWABLE_TYPES.has(ext)
  const VIDEO_EXTS = new Set(['mp4', 'avi', 'mov'])
  const previewType = VIDEO_EXTS.has(ext) ? 'video' : ext === 'pdf' ? 'pdf' : 'markdown'

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

  const previewBtn = target.closest('[data-preview="true"]') as HTMLElement
  if (previewBtn) {
    e.preventDefault()
    e.stopPropagation()
    previewState.url = previewBtn.dataset.url || ''
    previewState.name = previewBtn.dataset.name || ''
    previewState.type = (previewBtn.dataset.type as 'pdf' | 'markdown' | 'video') || 'pdf'
    previewState.show = true
    return
  }

  const externalLink = target.closest('[data-external="true"]') as HTMLElement
  if (externalLink) {
    e.preventDefault()
    e.stopPropagation()
    externalLinkState.url = externalLink.dataset.url || ''
    externalLinkState.show = true
  }
}

function openExternalLink() {
  window.open(externalLinkState.url, '_blank', 'noopener,noreferrer')
  externalLinkState.show = false
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
