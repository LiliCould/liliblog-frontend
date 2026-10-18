<template>
  <article ref="cardRef" class="card-glass card-interactive group relative overflow-hidden">
    <NuxtLink
      :to="detailPath"
      class="absolute inset-0 z-[1]"
      :aria-label="`阅读文章：${article.title}`"
    />

    <div class="pointer-events-none relative z-[2] flex flex-col-reverse gap-5 p-5 md:grid md:grid-cols-[minmax(0,1fr)_28%] md:items-stretch md:gap-6 md:p-6">
      <div class="flex min-w-0 flex-col">
        <h2 class="relative mb-2.5 pl-4 text-lg font-bold leading-snug text-t-title transition-colors duration-300 group-hover:text-t-primary md:text-xl">
          <span class="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-t-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.4)] transition-transform duration-300 group-hover:scale-y-110" />
          <span class="line-clamp-2">{{ article.title }}</span>
        </h2>

        <p v-if="article.summary" class="mb-4 pl-4 text-sm leading-relaxed text-t-body line-clamp-2">
          {{ article.summary }}
        </p>

        <div class="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--glass-border)] pt-3 text-xs text-t-muted">
          <NuxtLink
            v-if="article.creator"
            :to="`/user/${article.creator.id}`"
            class="pointer-events-auto relative z-[3] flex items-center gap-1.5 no-underline transition-colors duration-200 hover:text-t-primary"
          >
            <img
              :src="resolveAvatar(article.creator.avatar)"
              :alt="article.creator.nickname"
              class="h-5 w-5 rounded-full border border-[rgba(var(--color-primary-rgb),0.2)] object-cover"
              loading="lazy"
              @error="handleAvatarError"
            />
            {{ article.creator.nickname }}
          </NuxtLink>

          <span class="flex items-center gap-1.5">
            <Calendar class="h-3.5 w-3.5 text-t-primary opacity-70" />
            <time :datetime="article.createTime">{{ formatRelativeTime(article.createTime) }}</time>
          </span>

          <span class="flex items-center gap-1.5">
            <FolderOpen class="h-3.5 w-3.5 text-t-primary opacity-70" />
            {{ article.category?.name || '未分类' }}
          </span>

          <span class="flex items-center gap-1.5">
            <Eye class="h-3.5 w-3.5 text-t-primary opacity-70" />
            {{ formatNumber(article.viewCount) }}
          </span>

          <span class="ml-auto hidden items-center gap-1 text-t-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:flex">
            阅读全文
            <ChevronRight class="h-4 w-4" />
          </span>
        </div>

        <div v-if="displayTags.length > 0" class="mt-3 flex flex-wrap items-center gap-2 pl-4">
          <TagBadge
            v-for="tag in displayTags"
            :key="tag.id"
            :tag="tag"
            class="pointer-events-auto relative z-[3]"
          />
          <span
            v-if="hiddenTagsCount > 0"
            class="inline-flex h-[26px] min-w-[28px] items-center justify-center rounded-full border border-[var(--glass-border)] bg-[rgba(var(--color-primary-rgb),0.05)] px-2.5 text-[11px] font-semibold text-t-muted"
          >
            +{{ hiddenTagsCount }}
          </span>
        </div>
      </div>

      <div
        v-if="article.coverImage"
        ref="coverRef"
        class="tilt-card relative aspect-[16/9] overflow-hidden rounded-xl bg-t-elevated md:aspect-[4/3]"
      >
        <img
          :src="article.coverImage"
          :alt="article.title"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div
        v-else
        class="hidden items-center justify-center rounded-xl border border-dashed border-[var(--glass-border)] text-t-muted md:flex"
      >
        <ImageIcon class="h-8 w-8 opacity-30" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Calendar, ChevronRight, Eye, FolderOpen, Image as ImageIcon } from 'lucide-vue-next'
import type { Article } from '~/types'
import { useCardTilt } from '~/composables/useCardTilt'
import { formatNumber, formatRelativeTime, handleAvatarError, resolveAvatar } from '~/utils/format'

const props = defineProps<{
  article: Article
}>()

const MAX_TAGS = 3

const cardRef = ref<HTMLElement | null>(null)
const coverRef = ref<HTMLElement | null>(null)
useCardTilt(cardRef, coverRef)

const detailPath = computed(() => `/article/${encodeURIComponent(props.article.slug)}`)
const displayTags = computed(() => (props.article.tags || []).slice(0, MAX_TAGS))
const hiddenTagsCount = computed(() => Math.max(0, (props.article.tags || []).length - MAX_TAGS))
</script>
