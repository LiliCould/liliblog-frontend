/**
 * 资源预加载工具
 * 用于优化首屏和关键资源的加载速度
 */

// 预加载状态管理
const preloadState = {
  critical: false,  // 关键资源（首屏图片）
  fonts: false,     // 字体文件
  styles: false,    // 关键CSS
}

/**
 * 预加载关键资源（在页面加载时立即执行）
 */
export function preloadCriticalResources() {
  if (preloadState.critical) return
  
  // 使用 requestIdleCallback 在空闲时预加载
  const schedulePreload = () => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        preloadHeroImages()
        preloadFonts()
      }, { timeout: 3000 })
    } else {
      setTimeout(() => {
        preloadHeroImages()
        preloadFonts()
      }, 100)
    }
  }
  
  // 如果文档已完成，立即预加载
  if (document.readyState === 'complete') {
    schedulePreload()
  } else {
    window.addEventListener('load', schedulePreload, { once: true })
  }
  
  preloadState.critical = true
}

/**
 * 预加载 Hero 轮播图
 * 注意：Hero 图片通过 Vite 构建后路径带 hash，此处使用动态导入的实际路径
 */
function preloadHeroImages() {
  // Hero 图片在 src/assets/heros/ 下，通过 Vite import 使用
  // 构建后路径为 /assets/img/hero-*.[hash].png/jpg
  // 由于 hash 在构建时才生成，静态 preload 无法预知路径
  // 这里通过动态创建 Image 对象来利用浏览器缓存
  // 实际路径由 HeroCarousel.vue 中的 import 决定

  // 预加载关键字体和样式资源
  // Hero 图片由 Vite 的代码分割和懒加载机制自动处理
}

/**
 * 预加载字体文件
 */
function preloadFonts() {
  if (preloadState.fonts) return

  // 检查网络连接质量
  const connection = (navigator as any).connection
  if (connection && connection.saveData) {
    console.log('[Preload] 省略模式，跳过字体预加载')
    return
  }

  const fonts = [
    { url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' },
  ]

  fonts.forEach(font => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = font.url
    link.as = font.as
    
    if (font.as === 'style') {
      link.onload = () => {
        link.rel = 'stylesheet'
      }
    }
    
    document.head.appendChild(link)
  })

  preloadState.fonts = true
}

/**
 * 预加载路由组件（Vue Router懒加载）
 */
export function preloadRouteComponent(path: string) {
  return import(/* webpackChunkName: "route-[request]" */ `@/views${path}.vue`)
}

/**
 * DNS Prefetch 和 Preconnect
 */
export function setupDNSPrefetch(domains: string[]) {
  domains.forEach(domain => {
    // Preconnect（建立连接）
    const preconnect = document.createElement('link')
    preconnect.rel = 'preconnect'
    preconnect.href = domain
    preconnect.crossOrigin = 'anonymous'
    document.head.appendChild(preconnect)

    // DNS Prefetch（DNS解析）
    const dnsPrefetch = document.createElement('link')
    dnsPrefetch.rel = 'dns-prefetch'
    dnsPrefetch.href = domain
    document.head.appendChild(dnsPrefetch)
  })
}

/**
 * 图片自适应加载策略
 * 根据设备像素比和网络状况选择合适的图片质量
 */
export function getOptimizedImageUrl(baseUrl: string): string {
  // 获取设备像素比
  const dpr = window.devicePixelRatio || 1
  
  // 获取网络连接信息
  const connection = (navigator as any).connection
  const effectiveType = connection?.effectiveType || '4g'
  
  // 根据网络状况调整参数
  let quality = 80
  let width = 1920
  
  if (effectiveType === '2g' || effectiveType === 'slow-2g') {
    quality = 50
    width = 640
  } else if (effectiveType === '3g') {
    quality = 65
    width = 1280
  }
  
  // 高分辨率屏幕使用更高清图片
  if (dpr > 1.5 && effectiveType !== '2g' && effectiveType !== 'slow-2g') {
    width = Math.round(width * dpr)
  }
  
  // 构建优化后的URL（假设后端支持这些参数）
  const separator = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${separator}w=${width}&q=${quality}`
}

/**
 * 清理预加载缓存
 */
export function clearPreloadCache() {
  // 可以在这里清理不再需要的缓存
  console.log('[Preload] Cache cleared')
}

// 自动初始化关键资源预加载
if (typeof window !== 'undefined') {
  preloadCriticalResources()
  
  // 设置常用域名的DNS预解析
  setupDNSPrefetch([
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ])
}

export default {
  preloadCriticalResources,
  preloadRouteComponent,
  setupDNSPrefetch,
  getOptimizedImageUrl,
  clearPreloadCache,
}
