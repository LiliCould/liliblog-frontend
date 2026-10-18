import * as piniaModule from 'pinia'
import type { Pinia } from 'pinia'

/**
 * Pinia 4 的 setActivePinia 是一个无返回值的箭头函数，生产构建的摇树优化
 * 会把 @pinia/nuxt 插件里的调用移除，导致 SSR 报 “no active Pinia”。
 * 这里用动态属性访问保留副作用，并在所有插件之后显式激活实例。
 */
export default defineNuxtPlugin({
  name: 'app:pinia-active',
  enforce: 'post',
  setup(nuxtApp) {
    const pinia = (nuxtApp as unknown as { $pinia?: Pinia }).$pinia
    if (!pinia) return

    const setActive = (piniaModule as unknown as Record<string, unknown>)['set' + 'ActivePinia']
    if (typeof setActive === 'function') {
      ;(setActive as (instance: Pinia) => void)(pinia)
    }
  },
})
