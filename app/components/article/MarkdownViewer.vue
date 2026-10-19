<template>
  <div class="w-full min-h-full box-border">
    <div
      ref="viewerEl"
      class="article-prose"
      v-html="sanitizedHtml"
      @click="handleClick"
    />

    <FilePreviewModal
      v-if="previewState.show"
      :url="previewState.url"
      :file-name="previewState.name"
      :type="previewState.type"
      @close="previewState.show = false"
    />

    <AppConfirmDialog
      :open="externalLinkState.show"
      warning
      title="您即将离开本站"
      confirm-text="继续访问"
      cancel-text="取消"
      @update:open="externalLinkState.show = $event"
      @confirm="openExternalLink"
    >
      <div class="space-y-3">
        <p class="text-t-body">您正在访问的外部链接：</p>
        <div class="px-3 py-2 rounded-control bg-t-elevated border border-t-border">
          <p class="text-sm text-t-muted break-all line-clamp-2">{{ externalLinkState.url }}</p>
        </div>
        <p class="text-t-body-secondary text-sm">
          本站不对第三方网站的内容、安全性或隐私保护措施负责。请确认您信任该网站后再继续访问。
        </p>
      </div>
    </AppConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import DOMPurify from 'isomorphic-dompurify'
import { highlightCodeBlocks } from '~/utils/highlight'

const props = defineProps<{
  contentHtml: string
}>()

const viewerEl = ref<HTMLElement | null>(null)

const FILE_TYPES: Record<string, { color: string; label: string }> = {
  doc: { color: '#2B579A', label: 'DOC' },
  docx: { color: '#2B579A', label: 'DOC' },
  xls: { color: '#217346', label: 'XLS' },
  xlsx: { color: '#217346', label: 'XLS' },
  ppt: { color: '#D24726', label: 'PPT' },
  pptx: { color: '#D24726', label: 'PPT' },
  pdf: { color: '#E53935', label: 'PDF' },
  md: { color: '#64748b', label: 'MD' },
  markdown: { color: '#64748b', label: 'MD' },
  zip: { color: '#F57C00', label: 'ZIP' },
  rar: { color: '#F57C00', label: 'RAR' },
  '7z': { color: '#F57C00', label: '7Z' },
  mp4: { color: '#7B1FA2', label: 'MP4' },
  avi: { color: '#7B1FA2', label: 'AVI' },
  mov: { color: '#7B1FA2', label: 'MOV' },
  mp3: { color: '#E64A19', label: 'MP3' },
  wav: { color: '#E64A19', label: 'WAV' },
  flac: { color: '#E64A19', label: 'FLAC' },
  txt: { color: '#616161', label: 'TXT' },
  csv: { color: '#217346', label: 'CSV' },
  apk: { color: '#3DDC84', label: 'APK' },
}

const PREVIEWABLE_TYPES = new Set(['pdf', 'md', 'markdown', 'mp4', 'avi', 'mov'])
const VIDEO_EXTS = new Set(['mp4', 'avi', 'mov'])

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

/**
 * 从 URL 路径中取扩展名。
 * 先去掉 query/fragment，避免签名参数里的点干扰后缀判断。
 */
function getFileExtension(href: string): string {
  const path = href.split('?')[0].split('#')[0]
  const lastSegment = path.split('/').pop() || ''
  const dotIndex = lastSegment.lastIndexOf('.')
  if (dotIndex < 0 || dotIndex === lastSegment.length - 1) return ''
  return lastSegment.substring(dotIndex + 1).toLowerCase()
}

/**
 * 链接文本通常是原始文件名（MarkdownEditor 插入时写入）；
 * 没有文本时退回 URL 最后一段。
 */
function getDisplayName(href: string, text: string): string {
  if (text) return text
  const raw = href.split('?')[0].split('#')[0].split('/').pop() || ''
  try {
    return decodeURIComponent(raw) || '未知文件'
  } catch {
    return raw || '未知文件'
  }
}

/**
 * 七牛的 attname 参数会设置 Content-Disposition 的下载文件名，
 * 这样对象 key 用 UUID 也不会让用户下载到 uuid.ext。
 */
function getDownloadHref(href: string, displayName: string): string {
  if (!displayName) return href
  const separator = href.includes('?') ? '&' : '?'
  return `${href}${separator}attname=${encodeURIComponent(displayName)}`
}

function getFileCardHtml(href: string, text: string): string {
  if (!isLilicouldDomain(href)) {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" data-external="true" data-url="${href}">${text}</a>`
  }

  const ext = getFileExtension(href)
  const fileType = FILE_TYPES[ext]
  if (!fileType) {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
  }

  const displayName = getDisplayName(href, text)
  const downloadHref = getDownloadHref(href, displayName)
  const canPreview = PREVIEWABLE_TYPES.has(ext)
  const previewType = VIDEO_EXTS.has(ext) ? 'video' : ext === 'pdf' ? 'pdf' : 'markdown'

  const eyeIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
  const downloadIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'

  const previewBtn = canPreview
    ? `<button class="file-card__action" data-preview="true" data-url="${href}" data-name="${displayName}" data-type="${previewType}">${eyeIcon}</button>`
    : ''

  return `<div class="file-card">
    <span class="file-card__icon" style="--file-color:${fileType.color}">${fileType.label}</span>
    <span class="file-card__name">${displayName}</span>
    ${previewBtn}
    <a href="${downloadHref}" target="_blank" rel="noopener noreferrer" class="file-card__action">${downloadIcon}</a>
  </div>`
}

function handleClick(event: Event): void {
  const target = event.target as HTMLElement

  const previewBtn = target.closest('[data-preview="true"]') as HTMLElement | null
  if (previewBtn) {
    event.preventDefault()
    event.stopPropagation()
    previewState.url = previewBtn.dataset.url || ''
    previewState.name = previewBtn.dataset.name || ''
    previewState.type = (previewBtn.dataset.type as 'pdf' | 'markdown' | 'video') || 'pdf'
    previewState.show = true
    return
  }

  const externalLink = target.closest('[data-external="true"]') as HTMLElement | null
  if (externalLink) {
    event.preventDefault()
    event.stopPropagation()
    externalLinkState.url = externalLink.dataset.url || ''
    externalLinkState.show = true
  }
}

function openExternalLink(): void {
  if (!import.meta.client) return
  window.open(externalLinkState.url, '_blank', 'noopener,noreferrer')
  externalLinkState.show = false
}

const sanitizedHtml = computed(() => {
  if (!props.contentHtml) return ''
  let html = DOMPurify.sanitize(props.contentHtml, { ADD_ATTR: ['target'] })
  html = html.replace(
    /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi,
    (_match, href: string, text: string) => getFileCardHtml(href, text),
  )
  return html
})

function highlight(): void {
  if (viewerEl.value) highlightCodeBlocks(viewerEl.value)
}

onMounted(highlight)
watch(() => props.contentHtml, highlight, { flush: 'post' })
</script>

<style>
.file-card {
  display: flex !important;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin: 12px 0;
  border-radius: var(--radius-control);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  cursor: default;
  transition: all var(--motion-base) var(--ease-standard);
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
  background: color-mix(in srgb, var(--file-color, var(--color-primary)) 14%, var(--color-surface));
  color: color-mix(in srgb, var(--file-color, var(--color-primary)) 72%, var(--color-title));
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
