export interface TocItem {
  id: string
  text: string
  level: number
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w一-龥-]+/g, '')
}

/**
 * 使用正则提取目录，避免 SSR 阶段依赖 DOMParser。
 * 后端 contentHtml 的标题已带 id，优先使用原 id。
 */
export function extractTocItems(html: string): TocItem[] {
  if (!html) return []

  const items: TocItem[] = []
  const headingRegex = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(html)) !== null) {
    const level = Number(match[1])
    const attributes = match[2] || ''
    const text = stripTags(match[3])
    if (!text) continue

    const idMatch = attributes.match(/\sid\s*=\s*["']([^"']+)["']/i)
    items.push({
      id: idMatch?.[1] || slugify(text),
      text,
      level,
    })
  }

  return items
}
