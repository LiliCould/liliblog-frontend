<template>
  <aside class="hidden lg:flex flex-col gap-6 w-64 flex-shrink-0">
    <div class="bg-[rgba(20,20,35,0.85)] border border-[rgba(0,240,255,0.15)] rounded-lg p-5 transition-all duration-250 relative overflow-hidden hover:[box-shadow:0_8px_32px_rgba(0,240,255,0.1),0_0_1px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 hover:border-[rgba(0,240,255,0.3)] group"
      style="backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
    >
      <div class="absolute top-0 left-0 h-[3px] w-0 bg-gradient-to-r from-cyber-primary to-cyber-green transition-[width] duration-400 [box-shadow:0_0_8px_rgba(0,240,255,0.4)] group-hover:w-full"></div>
      <div class="flex items-center gap-2.5 mb-3 pb-2 border-b border-[rgba(0,240,255,0.15)]">
        <Shuffle class="w-5 h-5 text-cyber-primary [filter:drop-shadow(0_0_3px_rgba(0,240,255,0.3))]" />
        <h3 class="text-base font-semibold text-cyber-title m-0">随机文章</h3>
      </div>

      <div v-if="loading" class="flex flex-col gap-3">
        <div v-for="i in 5" :key="i" class="h-4 bg-[rgba(0,240,255,0.06)] rounded animate-pulse"></div>
      </div>

      <div v-else class="flex flex-col gap-1">
        <router-link
          v-for="article in articles"
          :key="article.id"
          :to="`/article/${article.id}`"
          class="flex items-start gap-2 px-3 py-2.5 rounded-md text-sm text-cyber-body no-underline transition-all duration-200 hover:text-cyber-primary hover:bg-[rgba(0,240,255,0.06)] group/article"
        >
          <ChevronRight class="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyber-muted transition-colors duration-200 group-hover/article:text-cyber-primary" />
          <span class="line-clamp-2 leading-snug">{{ article.title }}</span>
        </router-link>
        <div v-if="articles.length === 0" class="flex flex-col items-center gap-2 py-6 text-cyber-muted text-sm">
          <FileText class="w-8 h-8 opacity-40" />
          <span>暂无文章</span>
        </div>
      </div>
    </div>

    <div class="bg-[rgba(20,20,35,0.85)] border border-[rgba(0,240,255,0.15)] rounded-lg p-5 transition-all duration-250 relative overflow-hidden hover:[box-shadow:0_8px_32px_rgba(0,240,255,0.1),0_0_1px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 hover:border-[rgba(0,240,255,0.3)] group"
      style="backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
    >
      <div class="absolute top-0 left-0 h-[3px] w-0 bg-gradient-to-r from-cyber-primary to-cyber-pink transition-[width] duration-400 [box-shadow:0_0_8px_rgba(0,240,255,0.4)] group-hover:w-full"></div>
      <div class="flex items-center gap-2.5 mb-3 pb-2 border-b border-[rgba(0,240,255,0.15)]">
        <TagIcon class="w-5 h-5 text-cyber-primary [filter:drop-shadow(0_0_3px_rgba(0,240,255,0.3))]" />
        <h3 class="text-base font-semibold text-cyber-title m-0">标签云</h3>
      </div>

      <div class="flex flex-wrap gap-2.5 max-h-80 overflow-y-auto p-1 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(0,240,255,0.15)] [&::-webkit-scrollbar-thumb]:rounded-full">
        <router-link
          v-for="tag in appStore.tags"
          :key="tag.id"
          :to="`/tag/${tag.name}`"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold no-underline border border-[rgba(0,240,255,0.15)] bg-[rgba(0,240,255,0.06)] transition-all duration-200 hover:-translate-y-px hover:[box-shadow:0_0_8px_rgba(0,240,255,0.15)] hover:border-[rgba(0,240,255,0.4)]"
          :style="{ color: tag.color || '#00f0ff', backgroundColor: tag.color ? tag.color + '15' : 'rgba(0,240,255,0.06)' }"
        >
          <span class="w-1.5 h-1.5 rounded-full opacity-70 [box-shadow:0_0_6px_currentColor]" :style="{ backgroundColor: tag.color || '#00f0ff' }"></span>
          {{ tag.name }}
        </router-link>
        <div v-if="appStore.tags.length === 0" class="flex flex-col items-center gap-2 py-8 text-cyber-muted text-sm w-full">
          <AlertCircle class="w-10 h-10 opacity-40" />
          <span>暂无标签</span>
        </div>
      </div>
    </div>

    <slot></slot>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { getArticles } from '@/api/article'
import { Shuffle, Tag as TagIcon, ChevronRight, FileText, AlertCircle } from 'lucide-vue-next'
import type { Article } from '@/types/article.d'

const appStore = useAppStore()
const articles = ref<Article[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getArticles({ size: 5, status: 1 }) as any
    articles.value = res.data?.records || res.data || []
  } catch {
    articles.value = []
  } finally {
    loading.value = false
  }
})
</script>
