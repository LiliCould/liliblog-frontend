import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (['vue', 'vue-router', 'pinia'].some(m => id.includes(m))) {
              return 'vue-vendor'
            }
            if (['axios', 'dayjs', 'dompurify', 'nprogress'].some(m => id.includes(m))) {
              return 'utils'
            }
          }
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || ''
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(name)) {
            return `assets/media/[name]-[hash][extname]`
          }
          if (/\.(png|jpe?g|gif|svg|ico|webp|avif)$/.test(name)) {
            return `assets/img/[name]-[hash][extname]`
          }
          if (/\.css$/.test(name)) {
            return `assets/css/[name]-[hash][extname]`
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(name)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[extType]/[name]-[hash][extname]`
        },
        ...(isProduction && {
          minify: {
            compress: {
              dropConsole: true,
              dropDebugger: true,
            },
          },
        }),
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/file': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
    ],
  },
})
