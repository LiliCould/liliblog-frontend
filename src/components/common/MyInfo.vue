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
        class="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-orange-500/30">
        {{ userInfo.badge }}
      </div>
    </div>

    <div class="p-5">
      <h3 class="text-xl font-bold text-center text-t-title mb-2">
        {{ userInfo.nickname }}
      </h3>
      <p class="text-sm text-center text-t-body mb-4 leading-relaxed opacity-80">
        {{ userInfo.signature }}
      </p>

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
import { Github, Tv, Music, Mail, ChevronRight } from 'lucide-vue-next'

const userInfo = {
  avatar: new URL('@/assets/my.png', import.meta.url).href,
  nickname: 'LiliCould',
  signature: '',
  badge: '我的信息'
}

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/liliCould',
    icon: Github,
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
  { text: '最喜欢的美食', emoji: '🍦', url: '/favorite/girls' },
  { text: '最喜欢玩的游戏', emoji: '🎮', url: '/favorite/games' }
]
</script>
