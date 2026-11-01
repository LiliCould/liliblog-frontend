<template>
  <div class="panel-glass overflow-hidden">
    <div class="relative overflow-hidden">
      <img :src="avatarSrc" :alt="displayProfile.nickname" class="w-full h-36 object-cover" width="640" height="351" loading="lazy" decoding="async" @error="handleAvatarError" />
      <div class="absolute top-3 right-3 bg-t-primary-fill text-t-on-primary px-3 py-1 rounded-full text-xs font-bold shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.3)]">
        {{ displayProfile.badge }}
      </div>
    </div>

    <div class="p-5">
      <div class="text-center mb-5">
        <h3 class="text-xl font-bold text-t-title">{{ displayProfile.nickname }}</h3>
        <div class="flex items-center justify-center gap-2 mt-1.5">
          <span class="text-xs text-t-muted">@{{ displayProfile.handle }}</span>
          <span class="w-0.5 h-0.5 rounded-full bg-t-border" />
          <span class="text-xs text-t-muted">{{ displayProfile.email }}</span>
        </div>
        <p v-if="displayProfile.signature" class="text-xs text-t-muted mt-2 opacity-70">{{ displayProfile.signature }}</p>
      </div>

      <div class="flex justify-center gap-3 mb-5 pb-5 border-b border-t-border">
        <a
          v-for="social in socialLinks"
          :key="social.name"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          :class="[
            'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200',
            'border border-[rgba(var(--color-primary-rgb),0.15)] bg-[rgba(var(--color-primary-rgb),0.06)]',
            'hover:scale-110 hover:[box-shadow:0_0_12px_rgba(var(--color-primary-rgb),0.3)] hover:border-[rgba(var(--color-primary-rgb),0.4)]',
            social.iconColor,
          ]"
          :title="social.name"
        >
          <component :is="social.icon" class="w-5 h-5" />
        </a>
      </div>

      <div class="space-y-1">
        <div v-for="link in infoLinks" :key="link.text" class="group/link">
          <div class="relative flex items-center justify-between px-3 py-3 rounded-md text-sm text-t-body transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] cursor-pointer">
            <span class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-gradient-to-b from-t-primary to-t-secondary rounded-full transition-[height] duration-200 [box-shadow:0_0_6px_rgba(var(--color-primary-rgb),0.4)] group-hover/link:h-3/5" />
            <span class="flex items-center gap-2">
              {{ link.text }}
              <span>{{ link.emoji }}</span>
            </span>
            <ChevronDown class="w-4 h-4 text-t-muted transition-transform duration-200 group-hover/link:rotate-180" />
          </div>
          <div class="grid grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover/link:grid-rows-[1fr] group-hover/link:opacity-100">
            <div class="overflow-hidden">
              <div class="px-3 pt-1 pb-3 text-xs text-t-body leading-relaxed">
                <template v-for="(item, idx) in link.items" :key="item">
                  <span class="text-t-primary font-medium">{{ item }}</span>
                  <span v-if="idx < link.items.length - 1" class="text-t-muted mx-1">·</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { ChevronDown, Mail, Music, Tv } from 'lucide-vue-next'
import type { AuthorInfoGroup } from '~/types'
import { defaultBlogConfig } from '~/utils/blogConfigDefaults'
import myAvatar from '~/assets/my-avatar.webp'

const GithubIcon = {
  name: 'GithubIcon',
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: '20',
        height: '20',
        viewBox: '0 0 24 24',
        fill: 'currentColor',
      },
      [
        h('path', {
          d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
        }),
      ],
    )
  },
}

const { data: blogConfig } = useBlogConfig()

const fallbackProfile = defaultBlogConfig.author!.profile!
const author = computed(() => blogConfig.value?.author ?? defaultBlogConfig.author!)
const profile = computed(() => author.value.profile ?? fallbackProfile)

const displayProfile = computed(() => ({
  nickname: profile.value.nickname || fallbackProfile.nickname!,
  handle: profile.value.handle || fallbackProfile.handle!,
  email: profile.value.email || fallbackProfile.email!,
  signature: profile.value.signature || fallbackProfile.signature!,
  badge: profile.value.badge || fallbackProfile.badge!,
}))

const avatarSrc = ref(profile.value.avatar || myAvatar)

watch(
  () => profile.value.avatar,
  (avatar) => {
    avatarSrc.value = avatar || myAvatar
  },
)

function handleAvatarError(): void {
  avatarSrc.value = myAvatar
}

const iconMap = {
  github: { icon: GithubIcon, color: 'text-t-muted hover:text-t-primary' },
  bilibili: { icon: Tv, color: 'text-cyan-400 hover:text-cyan-300' },
  music: { icon: Music, color: 'text-red-400 hover:text-red-300' },
  mail: { icon: Mail, color: 'text-t-muted hover:text-t-primary' },
}

type IconKey = keyof typeof iconMap
type IconPreset = (typeof iconMap)[IconKey]

function resolveIcon(icon: string): IconPreset | null {
  if (!(icon in iconMap)) return null
  return iconMap[icon as IconKey] ?? null
}

const socialLinks = computed(() =>
  (author.value.socialLinks ?? []).flatMap((link) => {
    if (link.enabled === false) return []
    const preset = resolveIcon(link.icon)
    if (!preset) return []
    return [{
      name: link.name,
      url: link.url,
      icon: preset.icon,
      iconColor: preset.color,
    }]
  }),
)

type InfoGroupWithEnabled = AuthorInfoGroup & { enabled?: boolean }

const infoLinks = computed(() =>
  (author.value.infoGroups ?? [])
    .filter(group => (group as InfoGroupWithEnabled).enabled !== false)
    .map(group => ({
      text: group.text,
      emoji: group.emoji ?? '',
      items: group.items ?? [],
    }))
    .filter(group => group.items.length > 0),
)
</script>
