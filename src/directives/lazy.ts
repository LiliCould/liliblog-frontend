import type { Directive, DirectiveBinding } from 'vue'

interface LazyLoadOptions {
  threshold?: number
  rootMargin?: string
  loading?: string
  error?: string
}

const defaultOptions: LazyLoadOptions = {
  threshold: 0.1,
  rootMargin: '50px',
}

const imageCache = new Map<string, boolean>()

const loadImage = (el: HTMLImageElement, src: string, options: LazyLoadOptions) => {
  // 如果已缓存，直接设置
  if (imageCache.has(src)) {
    el.src = src
    el.classList.add('loaded')
    return
  }

  // 显示loading占位图
  if (options.loading) {
    el.src = options.loading
  }

  const img = new Image()
  
  img.onload = () => {
    el.src = src
    el.classList.add('loaded')
    imageCache.set(src, true)
    
    // 触发加载完成事件
    const event = new CustomEvent('image-loaded', { detail: { src } })
    el.dispatchEvent(event)
  }
  
  img.onerror = () => {
    if (options.error) {
      el.src = options.error
    }
    el.classList.add('error')
  }

  // 使用 fetchPriority 控制优先级
  img.fetchPriority = 'low'
  img.src = src
}

export const vLazy: Directive<HTMLImageElement, string | LazyLoadOptions> = {
  mounted(el: HTMLImageElement, binding: DirectiveBinding<string | LazyLoadOptions>) {
    const options = typeof binding.value === 'string' 
      ? { ...defaultOptions, src: binding.value }
      : { ...defaultOptions, ...binding.value }

    const src = typeof binding.value === 'string' ? binding.value : (binding.value as any).src

    if (!src) return

    // 检查是否支持 IntersectionObserver
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage(el, src, options)
              observer.unobserve(el)
            }
          })
        },
        {
          threshold: options.threshold,
          rootMargin: options.rootMargin,
        }
      )

      observer.observe(el)

      // 存储observer以便卸载时清理
      ;(el as any)._lazyObserver = observer
    } else {
      // 降级：直接加载
      loadImage(el, src, options)
    }
  },

  updated(el: HTMLImageElement, binding: DirectiveBinding<string | LazyLoadOptions>) {
    const src = typeof binding.value === 'string' ? binding.value : (binding.value as any).src
    
    if (src && src !== el.dataset.src) {
      el.dataset.src = src
      
      // 清理旧的observer
      if ((el as any)._lazyObserver) {
        ;(el as any)._lazyObserver.unobserve(el)
      }
      
      // 重新绑定
      vLazy.mounted!(el, binding)
    }
  },

  unmounted(el: HTMLImageElement) {
    if ((el as any)._lazyObserver) {
      ;(el as any)._lazyObserver.disconnect()
      delete (el as any)._lazyObserver
    }
  },
}

export default vLazy