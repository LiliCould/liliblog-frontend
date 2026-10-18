<template>
  <aside class="hidden lg:flex flex-col gap-6 sticky top-24 self-start">
    <slot name="top" />

    <div class="panel-glass p-5">
      <div class="widget-title mb-3 pb-2 border-b border-[var(--glass-border)]">
        <Shuffle class="w-5 h-5 text-t-primary" />
        <h3 class="text-base font-semibold text-t-title m-0">随机文章</h3>
      </div>

      <div v-if="loading" class="flex flex-col gap-3">
        <div v-for="i in 5" :key="i" class="h-4 bg-[rgba(var(--color-primary-rgb),0.06)] rounded animate-pulse" />
      </div>

      <div v-else class="flex flex-col gap-1">
        <NuxtLink
          v-for="article in articles"
          :key="article.id"
          :to="`/article/${article.slug}`"
          class="flex items-start gap-2 px-3 py-2.5 rounded-md text-sm text-t-body no-underline transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] group/article"
        >
          <ChevronRight class="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-t-muted transition-colors duration-200 group-hover/article:text-t-primary" />
          <span class="line-clamp-2 leading-snug">{{ article.title }}</span>
        </NuxtLink>
        <div v-if="articles.length === 0" class="flex flex-col items-center gap-2 py-6 text-t-muted text-sm">
          <FileText class="w-8 h-8 opacity-40" />
          <span>暂无文章</span>
        </div>
      </div>
    </div>

    <div class="panel-glass p-5">
      <div class="widget-title mb-3 pb-2 border-b border-[var(--glass-border)]">
        <TagIcon class="w-5 h-5 text-t-primary" />
        <h3 class="text-base font-semibold text-t-title m-0">标签云</h3>
      </div>

      <div class="flex flex-wrap gap-2.5 max-h-[26rem] overflow-y-auto p-1 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(var(--color-primary-rgb),0.15)] [&::-webkit-scrollbar-thumb]:rounded-full">
        <NuxtLink
          v-for="tag in tagList"
          :key="tag.id"
          :to="`/tag/${encodeURIComponent(tag.name)}`"
          class="chip-glass px-3 py-1 text-xs font-semibold no-underline hover:-translate-y-px"
          :style="tagStyle(tag.color)"
        >
          <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: tag.color || 'var(--color-primary)' }" />
          {{ tag.name }}
        </NuxtLink>
        <div v-if="tagList.length === 0" class="flex flex-col items-center gap-2 py-8 text-t-muted text-sm w-full">
          <AlertCircle class="w-10 h-10 opacity-40" />
          <span>暂无标签</span>
        </div>
      </div>
    </div>

    <slot />
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle, ChevronRight, FileText, Shuffle, Tag as TagIcon } from 'lucide-vue-next'
import { withAlpha } from '~/utils/color'

const { data: tags } = await useTags()

function tagStyle(color?: string) {
  return {
    backgroundColor: color
      ? withAlpha(color, 0.10)
      : 'rgba(var(--color-primary-rgb), 0.08)',
    borderColor: color
      ? withAlpha(color, 0.32)
      : 'rgba(var(--color-primary-rgb), 0.20)',
  }
}
const { data: randomArticles, pending: loading } = await useRandomArticles(5)

const tagList = computed(() => tags.value || [])
const articles = computed(() => randomArticles.value || [])
</script>
