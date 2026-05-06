import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

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
    
    // 启用CSS代码分割
    cssCodeSplit: true,
    
    // chunk 分包策略 - 减少首屏加载体积
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue核心库
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          
          // UI框架
          'element-plus': ['element-plus'],
          
          // 动画库
          'animejs': ['animejs'],
          
          // 工具库
          'utils': ['axios', 'dayjs'],
        },
        
        // 文件命名规则（带hash缓存）
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          let extType = info[info.length - 1]
          
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(assetInfo.name)) {
            return `assets/media/[name].[hash][extname]`
          }
          
          if (/\.(png|jpe?g|gif|svg|ico|webp|avif)$/.test(assetInfo.name)) {
            return `assets/img/[name].[hash][extname]`
          }
          
          if (/\.css$/.test(assetInfo.name)) {
            return `assets/css/[name].[hash][extname]`
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `assets/fonts/[name].[hash][extname]`
          }
          
          return `assets/[extType]/[name].[hash][extname]`
        },
      },
    },
    
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // 生产环境可改为true
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'], // 移除调试日志
      },
      format: {
        comments: false,
      },
    },
    
    // chunk大小警告阈值
    chunkSizeWarningLimit: 1000,
  },
  
  // ========== 开发服务器优化 ==========
  server: {
    port: 3000,
    open: true,
    
    // 预热文件（减少首次启动等待）
    warmup: {
      clientFiles: ['./src/main.ts', './src/App.vue'],
    },
    
    // 强制依赖预构建
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        'axios',
        'animejs',
        '@vueuse/core',
      ],
    },
    
    // 代理配置（如果需要API代理）
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  // ========== 性能优化 ==========
  
  // 预构建依赖
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
  
  // CSS优化
  css: {
    preprocessorOptions: {},
    
    // PostCSS配置
    postcss: {},
  },
})
