import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 检查是否为生产环境
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  
  // ========== 构建优化配置 ==========
  build: {
    target: 'es2020',
    
    cssCodeSplit: true,
    
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'element-plus': ['element-plus'],
          'markdown': ['md-editor-v3'],
          'utils': ['axios', 'dayjs', 'dompurify', 'nprogress'],
          'animejs': ['animejs'],
        },
        
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || ''
          
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(name)) {
            return `assets/media/[name].[hash][extname]`
          }
          
          if (/\.(png|jpe?g|gif|svg|ico|webp|avif)$/.test(name)) {
            return `assets/img/[name].[hash][extname]`
          }
          
          if (/\.css$/.test(name)) {
            return `assets/css/[name].[hash][extname]`
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/.test(name)) {
            return `assets/fonts/[name].[hash][extname]`
          }
          
          return `assets/[extType]/[name].[hash][extname]`
        },
      },
    },
    
    // ========== 智能压缩策略 ==========
    // 生产环境：terser（极致压缩，体积小 2-5%）
    // 开发环境：esbuild（快速构建，速度快 10 倍）
    minify: isProduction ? 'terser' : 'esbuild',
    
    // terser 配置（仅生产环境生效）
    ...(isProduction && {
      terserOptions: {
        compress: {
          drop_console: true,           // 移除 console
          drop_debugger: true,           // 移除 debugger
          pure_funcs: [                 // 移除指定函数
            'console.log',
            'console.debug',
            'console.info',
            'console.warn',
          ],
          passes: 3,                    // 压缩次数（越多越彻底）
        },
        format: {
          comments: false,              // 移除注释
        },
        mangle: {                       // 变量名混淆
          toplevel: true,
          // 注意：不要启用 properties 混淆，Vue/Pinia 内部使用 _ 开头的私有属性
          // 混淆这些属性会破坏响应式系统的正常工作
          // properties: { regex: /^_/ },
        },
      },
    }),
    
    chunkSizeWarningLimit: 1000,
  },
  
  // ========== 开发服务器配置 ==========
  server: {
    port: 3000,
    open: false,
    
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  // ========== 依赖预构建 ==========
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'element-plus/es',
      'axios',
      'animejs',
    ],
  },
})