import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      const reduce = typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      return {
        el: to.hash,
        top: 80,
        behavior: reduce ? 'auto' : 'smooth',
      }
    }

    return { top: 0 }
  },
}
