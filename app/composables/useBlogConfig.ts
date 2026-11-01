import type { BlogConfig } from '~/types'
import { defaultBlogConfig, mergeBlogConfig } from '~/utils/blogConfigDefaults'

/**
 * 站点配置：接口失败或无数据时回退到本地默认值。
 */
export function useBlogConfig() {
  const api = useApi()
  return useAsyncData<BlogConfig>(
    'blog-config',
    async () => {
      try {
        const remote = await api.get<BlogConfig>('/api/blog-config')
        return mergeBlogConfig(defaultBlogConfig, remote)
      } catch {
        return defaultBlogConfig
      }
    },
    { default: () => defaultBlogConfig },
  )
}
