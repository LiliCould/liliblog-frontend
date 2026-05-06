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
  if (imageCache.has(src)) {
    el.src = src
    el.classList.add('loaded')
    return
  }

  if (options.loading) {
    el.src = options.loading
  }

  const img = new Image()
  
  img.onload = () => {
    el.src = src
    el.classList.add('loaded')
    imageCache.set(src, true)
    
    const event = new CustomEvent('image-loaded', { detail: { src } })
    el.dispatchEvent(event)
  }
  
  img.onerror = () => {
    if (options.error) {
      el.src = options.error
    }
    el.classList.add('error')
  }

  img.fetchPriority = 'low'
  img.src = src
}

// 定义指令生命周期钩子
function mounted(el: HTMLImageElement, binding: DirectiveBinding<string | LazyLoadOptions>) {
  const options = typeof binding.value === 'string' 
    ? { ...defaultOptions, src: binding.value }
    : { ...defaultOptions, ...binding.value }

  const src = typeof binding.value === 'string' ? binding.value : (binding.value as any).src

  if (!src) return

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
    ;(el as any)._lazyObserver = observer
  } else {
    loadImage(el, src, options)
  }
}

function updated(el: HTMLImageElement, binding: DirectiveBinding<string | LazyLoadOptions>) {
  const src = typeof binding.value === 'string' ? binding.value : (binding.value as any).src
  
  if (src && src !== el.dataset.src) {
    el.dataset.src = src
    
    if ((el as any)._lazyObserver) {
      ;(el as any)._lazyObserver.unobserve(el)
    }
    
    mounted(el, binding)
  }
}

function unmounted(el: HTMLImageElement) {
  if ((el as any)._lazyObserver) {
    ;(el as any)._lazyObserver.disconnect()
    delete (el as any)._lazyObserver
  }
}

export const vLazy: Directive<HTMLImageElement, string | LazyLoadOptions> = {
  mounted,
  updated,
  unmounted,
}

export default vLazy