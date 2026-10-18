const REDIRECTS: Record<string, string> = {
  '/index.html': '/',
  '/home': '/',
  '/posts': '/',
}

export default defineEventHandler((event) => {
  const path = (event.path || '/').split('?')[0]
  const target = REDIRECTS[path]
  if (target) return sendRedirect(event, target, 301)
})
