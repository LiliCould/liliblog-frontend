import type { AuthorInfoGroup, AuthorSocialLink, BlogConfig, HeroSlide } from '~/types'
import { heroCodeTemplates, heroPhrases } from '~/utils/heroPhrases'

/**
 * 站点配置默认值（本地兜底）。
 * 与历史硬编码内容保持一致：接口不可用时前台表现不变。
 */
const defaultSlides: HeroSlide[] = [
  { key: 'hero-1', src: 'https://oss.lilicould.cn/file/hero-1.png', alt: 'Hero 1', enabled: true },
  { key: 'hero-2', src: 'https://oss.lilicould.cn/file/hero-2.png', alt: 'Hero 2', enabled: true },
  { key: 'hero-3', src: 'https://oss.lilicould.cn/file/hero-3.png', alt: 'Hero 3', enabled: true },
  { key: 'hero-4', src: 'https://oss.lilicould.cn/file/hero-4.jpg', alt: 'Hero 4', enabled: true },
]

const defaultSocialLinks: AuthorSocialLink[] = [
  { key: 'github', name: 'GitHub', icon: 'github', url: 'https://github.com/liliCould', enabled: true },
  { key: 'bilibili', name: 'Bilibili', icon: 'bilibili', url: 'https://space.bilibili.com/360583544', enabled: true },
  { key: 'music', name: '网易云音乐', icon: 'music', url: 'https://music.163.com/#/user/home?id=1410136194', enabled: true },
  { key: 'mail', name: '邮箱', icon: 'mail', url: 'mailto:lilicould@qq.com', enabled: true },
]

const defaultInfoGroups: AuthorInfoGroup[] = [
  { key: 'anime', text: '喜欢的动漫', emoji: '📺', items: ['海贼王', '鬼灭之刃', '凡人修仙传', '剑来', '间谍过家家', '龙与虎'] },
  { key: 'food', text: '喜欢的美食', emoji: '🍦', items: ['菠萝', '炒粉', '酸菜鱼', '臭豆腐', '烤面筋'] },
  { key: 'game', text: '喜欢的游戏', emoji: '🎮', items: ['Minecraft', '星露谷物语', '荒野大镖客2', '巫师3', 'GTA5'] },
]

export const defaultBlogConfig: BlogConfig = {
  version: 1,
  updatedAt: '',
  hero: {
    typewriter: {
      enabled: true,
      phrases: heroPhrases,
      templates: heroCodeTemplates,
    },
    slides: defaultSlides,
  },
  author: {
    profile: {
      avatar: '',
      nickname: '立里可',
      handle: 'LiliCould',
      email: 'lilicould@qq.com',
      signature: '热爱技术，追求卓越',
      badge: '关于作者',
    },
    socialLinks: defaultSocialLinks,
    infoGroups: defaultInfoGroups,
  },
  extensions: {},
}

/** 远端数组为空或未提供时回退默认值 */
function pickList<T>(remote: T[] | undefined | null, fallback: T[] | undefined): T[] {
  return Array.isArray(remote) && remote.length > 0 ? remote : (fallback ?? [])
}

/**
 * 合并远端配置与默认值：
 * 顶层浅合并，hero / typewriter / author / profile 逐层合并，
 * 列表型字段为空时回退默认值。
 */
export function mergeBlogConfig(base: BlogConfig, remote?: BlogConfig | null): BlogConfig {
  if (!remote) return base

  const remoteHero = remote.hero
  const remoteTypewriter = remoteHero?.typewriter
  const remoteAuthor = remote.author

  return {
    version: remote.version ?? base.version,
    updatedAt: remote.updatedAt ?? base.updatedAt,
    hero: {
      ...(base.hero ?? {}),
      ...(remoteHero ?? {}),
      typewriter: {
        ...(base.hero?.typewriter ?? {}),
        ...(remoteTypewriter ?? {}),
        phrases: pickList(remoteTypewriter?.phrases, base.hero?.typewriter?.phrases),
        templates: pickList(remoteTypewriter?.templates, base.hero?.typewriter?.templates),
      },
      slides: pickList(remoteHero?.slides, base.hero?.slides),
    },
    author: {
      ...(base.author ?? {}),
      ...(remoteAuthor ?? {}),
      profile: {
        ...(base.author?.profile ?? {}),
        ...(remoteAuthor?.profile ?? {}),
      },
      socialLinks: pickList(remoteAuthor?.socialLinks, base.author?.socialLinks),
      infoGroups: pickList(remoteAuthor?.infoGroups, base.author?.infoGroups),
    },
    extensions: remote.extensions ?? {},
  }
}
