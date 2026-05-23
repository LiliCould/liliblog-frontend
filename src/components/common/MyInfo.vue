<template>
  <div
    class="bg-[rgba(var(--color-card-rgb),0.85)] border border-t-border rounded-lg overflow-hidden transition-all duration-250 relative hover:[box-shadow:0_8px_32px_rgba(var(--color-primary-rgb),0.1),0_0_1px_rgba(var(--color-primary-rgb),0.3)] hover:-translate-y-0.5 hover:border-[rgba(var(--color-primary-rgb),0.3)] group"
    style="backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
    <div
      class="absolute top-0 left-0 h-[3px] w-0 bg-gradient-to-r from-t-primary to-t-secondary transition-[width] duration-400 [box-shadow:0_0_8px_rgba(var(--color-primary-rgb),0.4)] group-hover:w-full">
    </div>

    <div class="relative">
      <img :src="userInfo.avatar" :alt="userInfo.nickname" class="w-full h-48 object-cover" />
      <div
        class="absolute top-3 right-3 bg-[rgba(var(--color-primary-rgb),0.85)] text-white px-3 py-1 rounded-full text-xs font-bold shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.3)]">
        {{ userInfo.badge }}
      </div>
    </div>

    <div class="p-5">
      <div class="text-center mb-5">
        <h3 class="text-xl font-bold text-t-title">
          {{ userInfo.nickname }}
        </h3>
        <div class="flex items-center justify-center gap-2 mt-1.5">
          <span class="text-xs text-t-muted">@LiliCould</span>
          <span class="w-0.5 h-0.5 rounded-full bg-t-border"></span>
          <span class="text-xs text-t-muted">lilicould@qq.com</span>
        </div>
        <p v-if="userInfo.signature" class="text-xs text-t-muted mt-2 opacity-70">{{ userInfo.signature }}</p>
      </div>

      <div class="flex justify-center gap-3 mb-5 pb-5 border-b border-t-border">
        <a v-for="social in socialLinks" :key="social.name" :href="social.url" target="_blank" rel="noopener noreferrer"
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
            'border border-[rgba(var(--color-primary-rgb),0.15)] bg-[rgba(var(--color-primary-rgb),0.06)]',
            'hover:scale-110 hover:[box-shadow:0_0_12px_rgba(var(--color-primary-rgb),0.3)] hover:border-[rgba(var(--color-primary-rgb),0.4)]',
            social.iconColor
          ]" :title="social.name">
          <component :is="social.icon" class="w-5 h-5" />
        </a>
      </div>

      <div class="space-y-1">
        <a v-for="link in infoLinks" :key="link.text" :href="link.url"
          class="flex items-center justify-between px-3 py-3 rounded-md text-sm text-t-body no-underline transition-all duration-200 relative hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] group/link">
          <span
            class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-gradient-to-b from-t-primary to-t-secondary rounded-full transition-[height] duration-250 [box-shadow:0_0_6px_rgba(var(--color-primary-rgb),0.4)] group-hover/link:h-3/5"></span>
          <span class="flex items-center gap-2">
            {{ link.text }}
            <span>{{ link.emoji }}</span>
          </span>
          <ChevronRight
            class="w-4 h-4 text-t-muted opacity-0 -translate-x-1 transition-all duration-250 group-hover/link:opacity-100 group-hover/link:translate-x-0" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { Tv, Music, Mail, ChevronRight } from 'lucide-vue-next'

const GithubIcon = {
  name: 'GithubIcon',
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '20',
      height: '20',
      viewBox: '0 0 24 24',
      fill: 'currentColor',
    }, [
      h('path', {
        d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
      }),
    ])
  },
}

const userInfo = {
  avatar: new URL('@/assets/my.png', import.meta.url).href,
  nickname: '立里可',
  signature: '一个没有追求但不想摆烂的人',
  badge: '关于作者'
}

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/liliCould',
    icon: GithubIcon,
    iconColor: 'text-gray-300 hover:text-white'
  },
  {
    name: 'Bilibili',
    url: 'https://space.bilibili.com/360583544',
    icon: Tv,
    iconColor: 'text-cyan-400 hover:text-cyan-300'
  },
  {
    name: '网易云音乐',
    url: 'https://music.163.com/#/user/home?id=1410136194',
    icon: Music,
    iconColor: 'text-red-400 hover:text-red-300'
  },
  {
    name: '邮箱',
    url: 'lilicould@qq.com',
    icon: Mail,
    iconColor: 'text-gray-300 hover:text-white'
  }
]

const infoLinks = [
  { text: '最喜欢的动漫', emoji: '📺', url: '/favorite/anime' },
  { text: '最喜欢的美食', emoji: '🍦', url: '/favorite/delivery' },
  { text: '最喜欢玩的游戏', emoji: '🎮', url: '/favorite/games' }
]
</script>
