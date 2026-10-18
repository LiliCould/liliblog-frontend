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

  const config = useRuntimeConfig()
  const target = `${config.apiBase}${path}`
  return proxyRequest(event, target)
})
