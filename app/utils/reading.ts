/**
 * 估算中文/英文混合文章的阅读时长（分钟）。
 * 中文约 400 字/分钟，英文约 220 词/分钟，代码块不计入正文。
 */
export function getReadingMinutes(contentHtml: string): number {
  if (!contentHtml) return 1

  const text = contentHtml
    .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .trim()

  const chineseCount = (text.match(/[一-鿿]/g) || []).length
  const englishWords = (text.replace(/[一-鿿]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length

  const minutes = chineseCount / 400 + englishWords / 220
  return Math.max(1, Math.round(minutes))
}
