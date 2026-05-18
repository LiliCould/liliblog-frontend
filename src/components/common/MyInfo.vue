<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
    <div class="relative">
      <img
        :src="userInfo.avatar"
        :alt="userInfo.nickname"
        class="w-full h-48 object-cover"
      />
      <div class="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
        {{ userInfo.badge }}
      </div>
    </div>

    <div class="p-5">
      <h3 class="text-xl font-bold text-center text-gray-800 mb-2">
        {{ userInfo.nickname }}
      </h3>
      <p class="text-sm text-center text-gray-600 mb-4 leading-relaxed">
        {{ userInfo.signature }}
      </p>

      <div class="flex justify-center gap-3 mb-5 pb-5 border-b border-gray-100">
        <a
          v-for="social in socialLinks"
          :key="social.name"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
            'hover:scale-110 hover:shadow-md',
            social.bgColor,
            social.hoverColor
          ]"
          :title="social.name"
        >
          <component :is="social.icon" class="w-5 h-5" :class="social.iconColor" />
        </a>
      </div>

      <div class="space-y-1">
        <a
          v-for="link in infoLinks"
          :key="link.text"
          :href="link.url"
          class="flex items-center justify-between px-3 py-3 rounded-lg text-sm text-gray-700 no-underline transition-all duration-200 hover:bg-gray-50 group"
        >
          <span class="flex items-center gap-2">
            {{ link.text }}
            <span>{{ link.emoji }}</span>
          </span>
          <ChevronRight class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Github, Send, Tv, Music, Mail, ChevronRight } from 'lucide-vue-next'

const userInfo = {
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20girl%20with%20blonde%20hair%20blue%20eyes%20red%20beret%20red%20plaid%20shirt%20winking%20cute%20expression%20portrait&image_size=portrait_4_3',
  nickname: 'Naccl',
  signature: '云鹤当归天，天不迎我妙木仙；',
  badge: '博主'
}

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/naccl',
    icon: Github,
    bgColor: 'bg-gray-100',
    hoverColor: 'hover:bg-gray-200',
    iconColor: 'text-gray-700'
  },
  {
    name: 'Telegram',
    url: 'https://t.me/naccl',
    icon: Send,
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
    iconColor: 'text-blue-500'
  },
  {
    name: 'Bilibili',
    url: 'https://space.bilibili.com/naccl',
    icon: Tv,
    bgColor: 'bg-cyan-50',
    hoverColor: 'hover:bg-cyan-100',
    iconColor: 'text-cyan-500'
  },
  {
    name: '网易云音乐',
    url: 'https://music.163.com/#/user/home?id=naccl',
    icon: Music,
    bgColor: 'bg-red-50',
    hoverColor: 'hover:bg-red-100',
    iconColor: 'text-red-500'
  },
  {
    name: '邮箱',
    url: 'mailto:naccl@example.com',
    icon: Mail,
    bgColor: 'bg-gray-100',
    hoverColor: 'hover:bg-gray-200',
    iconColor: 'text-gray-700'
  }
]

const infoLinks = [
  { text: '最喜欢的动漫', emoji: '📺', url: '/favorite/anime' },
  { text: '最喜欢我的女孩子们', emoji: '😊', url: '/favorite/girls' },
  { text: '最喜欢玩的游戏', emoji: '🎮', url: '/favorite/games' }
]
</script>