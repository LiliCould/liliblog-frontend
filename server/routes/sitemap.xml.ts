interface ApiResponse<T> {
  code: number
  data: T
  msg?: string
}

interface PageResult<T> {
  records: T[]
  total: number
  totalPage: number
}

interface ArticleLike {
  slug?: string
  createTime?: string
  updateTime?: string
  creator?: { id?: number }
}

interface CategoryLike {
  slug?: string
}

interface TagLike {
  name?: string
}

interface SitemapEntry {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: string
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseURL = config.apiBase
  const siteUrl = String(config.public.siteUrl || 'https://lilicould.cn').replace(/\/$/, '')

  async function get<T>(path: string, params: Record<string, string | number>): Promise<T | null> {
    try {
      const response = await $fetch<ApiResponse<T>>(path, { baseURL, params })
      return response.code === 0 ? response.data : null
    } catch {
      return null
    }
  }

  const entries: SitemapEntry[] = [
    { loc: `${siteUrl}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${siteUrl}/categories`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${siteUrl}/about`, changefreq: 'monthly', priority: '0.6' },
  ]

  const firstPage = await get<PageResult<ArticleLike>>('/api/article', { status: 1, current: 1, size: 100 })
  const articles: ArticleLike[] = [...(firstPage?.records || [])]
  if (firstPage?.totalPage) {
    for (let page = 2; page <= firstPage.totalPage; page++) {
      const next = await get<PageResult<ArticleLike>>('/api/article', { status: 1, current: page, size: 100 })
      if (next?.records) articles.push(...next.records)
    }
  }

  for (const article of articles) {
    if (!article.slug) continue
    entries.push({
      loc: `${siteUrl}/article/${encodeURIComponent(article.slug)}`,
      lastmod: (article.updateTime || article.createTime || '').slice(0, 10) || undefined,
      changefreq: 'monthly',
      priority: '0.7',
    })
  }

  const categories = await get<PageResult<CategoryLike>>('/api/category', { size: 100, status: 1 })
  for (const category of categories?.records || []) {
    if (!category.slug) continue
    entries.push({
      loc: `${siteUrl}/category/${encodeURIComponent(category.slug)}`,
      changefreq: 'weekly',
      priority: '0.6',
    })
  }

  const tags = await get<PageResult<TagLike>>('/api/tag', { size: 100 })
  for (const tag of tags?.records || []) {
    if (!tag.name) continue
    entries.push({
      loc: `${siteUrl}/tag/${encodeURIComponent(tag.name)}`,
      changefreq: 'weekly',
      priority: '0.5',
    })
  }

  const userIds = new Set<number>()
  for (const article of articles) {
    if (article.creator?.id) userIds.add(article.creator.id)
  }
  for (const id of userIds) {
    entries.push({
      loc: `${siteUrl}/user/${id}`,
      changefreq: 'weekly',
      priority: '0.5',
    })
  }

  const urls = entries.map((entry) => {
    const lines = [`    <loc>${escapeXml(entry.loc)}</loc>`]
    if (entry.lastmod) lines.push(`    <lastmod>${entry.lastmod}</lastmod>`)
    if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`)
    if (entry.priority) lines.push(`    <priority>${entry.priority}</priority>`)
    return `  <url>\n${lines.join('\n')}\n  </url>`
  })

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}, {
  maxAge: 3600,
  name: 'sitemap',
  getKey: () => 'sitemap',
})
