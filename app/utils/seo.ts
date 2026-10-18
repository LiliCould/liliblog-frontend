export const SITE_URL = 'https://lilicould.cn'
export const SITE_NAME = '立里博客 | LiliBlog'

export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function stripHtml(html: string): string {
  return (html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function truncateText(text: string, maxLength = 150): string {
  const value = stripHtml(text)
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength).trim()}…`
}
