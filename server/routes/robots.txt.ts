export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || 'https://lilicould.cn').replace(/\/$/, '')

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /auth/',
    'Disallow: /file/',
    'Disallow: /admin',
    'Disallow: /admin/',
    'Disallow: /write',
    'Disallow: /write/',
    'Disallow: /profile/',
    'Disallow: /user/me',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /search',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')
})
