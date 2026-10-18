export default defineNuxtConfig({
  compatibilityDate: '2026-10-18',
  srcDir: 'app/',

  devtools: { enabled: true },

  css: [
    '~/assets/styles/variables.css',
    '~/assets/styles/reset.css',
    '~/assets/styles/transitions.css',
    'vue-sonner/style.css',
  ],

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
  ],

  imports: {
    dirs: ['stores'],
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  tailwindcss: {
    cssPath: '~/assets/styles/tailwind.css',
    configPath: 'tailwind.config.js',
  },

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
    apiBase: process.env.NUXT_API_BASE || 'https://api.lilicould.cn',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.lilicould.cn',
    },
  },

  nitro: {
    devProxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
      '/auth': { target: 'http://localhost:8080', changeOrigin: true },
      '/file': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },

  routeRules: {
    '/admin/**': { ssr: false },
    '/write/**': { ssr: false },
    '/profile/**': { ssr: false },
    '/user/me': { ssr: false },
    '/login': { ssr: false },
    '/register': { ssr: false },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
