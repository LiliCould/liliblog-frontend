import { proxyRequest } from 'h3'

const PROXY_PREFIXES = ['/api', '/auth', '/file']

/**
 * 同源代理：浏览器请求本站 /api、/auth、/file，由 Nitro 转发到后端。
 * 生产环境也可以让 Nginx 直接代理这些前缀，二者不冲突。
 */
export default defineEventHandler((event) => {
  const path = event.path || '/'
  const shouldProxy = PROXY_PREFIXES.some(prefix =>
    path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(`${prefix}?`),
  )

  if (!shouldProxy) return

  // 本地开发时浏览器 Origin 是 localhost，后端会按来源拒绝认证请求。
  // 这里仅对本地来源移除 Origin/Referer；生产域名不做改写。
  const headers = event.node.req.headers
  const origin = typeof headers.origin === 'string' ? headers.origin : ''
  if (/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(origin)) {
    delete headers.origin
    delete headers.referer
  }

  const config = useRuntimeConfig()
  const target = `${config.apiBase}${path}`
  return proxyRequest(event, target)
})
