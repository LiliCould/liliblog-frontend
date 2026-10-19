const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-18',
  srcDir: 'app/',

  devtools: { enabled: true },

  css: [
    '~/assets/styles/tailwind.css',
    '~/assets/styles/variables.css',
    '~/assets/styles/reset.css',
    '~/assets/styles/components.css',
    '~/assets/styles/transitions.css',
    '~/assets/styles/upload-progress.css',
    'vue-sonner/style.css',
  ],

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  imports: {
    dirs: ['stores'],
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN',
      },
      title: '立里博客 | LiliBlog - 立里可的技术与生活分享空间',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'theme-color', content: '#0a0a0f' },
        {
          name: 'description',
          content:
            '立里博客（LiliBlog）是立里可（LiliCould）的个人博客，分享前端开发、后端开发等技术内容，以及生活记录与思考。',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'preconnect', href: 'https://oss.lilicould.cn', crossorigin: '' },
        { rel: 'dns-prefetch', href: '//oss.lilicould.cn' },
      ],
      script: [
        {
          key: 'theme-bootstrap',
          tagPosition: 'head',
          innerHTML: `(function(){try{var t=localStorage.getItem('liliblog-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'cyber-dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`,
        },
      ],
    },
  },

  runtimeConfig: {
    // 本地开发默认直连本地后端；服务器上用 NUXT_API_BASE 覆盖
    apiBase: process.env.NUXT_API_BASE
      || (isDev ? 'http://localhost:8080' : 'https://api.lilicould.cn'),
    public: {
      // 浏览器始终走同源 /api，由 Nitro 或 Nginx 转发，避免 CORS 与 Cookie 跨域问题
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://lilicould.cn',
      // direct=前端直传七牛，proxy=回退到后端中转 /file/upload
      uploadMode: process.env.NUXT_PUBLIC_UPLOAD_MODE || 'direct',
    },
  },

  // 同源代理统一由 server/middleware/api-proxy.ts 处理，
  // 避免 devProxy 与 Nitro 中间件重复转发导致请求头被改写。

  routeRules: {
    '/admin/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/write/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/profile/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/user/me': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/login': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/register': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/search': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
