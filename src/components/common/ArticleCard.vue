<template>
  <article
    class="group relative cursor-pointer rounded-xl bg-t-surface border border-t-border overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-t-primary hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.15)]"
    @click="goDetail" ref="cardRef">
    <div
      class="absolute inset-0 bg-gradient-to-br from-transparent to-[rgba(var(--color-primary-rgb),0.03)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[1]">
    </div>
    <div
      class="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-[rgba(var(--color-primary-rgb),0.08)] to-transparent pointer-events-none z-[1] group-hover:animate-[flow-light_0.8s_ease-out]">
    </div>

    <div class="flex gap-6 p-6 relative z-[2] max-md:flex-col-reverse max-md:gap-4 max-md:p-4">
      <div class="flex-1 min-w-0 flex flex-col">


        <h2
          class="text-lg font-bold text-t-title leading-snug mb-2 line-clamp-2 transition-colors duration-500 group-hover:text-t-primary group-hover:[text-shadow:0_0_12px_rgba(var(--color-primary-rgb),0.3)]">
          {{ article.title }}
        </h2>

        <p v-if="article.summary" ref="summaryRef"
          class="text-sm text-t-body leading-relaxed mb-4 line-clamp-2"
          @mouseenter="checkTruncation" @mouseleave="onSummaryLeave">
          {{ article.summary }}
        </p>

        <div class="flex flex-wrap gap-4 mb-4 pt-2 border-t border-t-border">
          <router-link v-if="article.creator"
            :to="`/user/${article.creator.id}`"
            class="flex items-center gap-1.5 text-xs text-t-muted no-underline transition-colors duration-500 group-hover:text-t-primary"
            @click.stop>
            <img :src="resolveAvatar(article.creator.avatar)" :alt="article.creator.nickname"
              class="w-4 h-4 rounded-full border border-[rgba(var(--color-primary-rgb),0.2)] object-cover"
              @error="handleAvatarError" />
            {{ article.creator.nickname }}
          </router-link>
          <span
            class="flex items-center gap-1.5 text-xs text-t-muted transition-colors duration-500 group-hover:text-t-primary">
            <FolderOpen
              class="w-3.5 h-3.5 text-t-primary opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            {{ article.category?.name || '未分类' }}
          </span>
          <span
            class="flex items-center gap-1.5 text-xs text-t-muted transition-colors duration-500 group-hover:text-t-primary">
            <Calendar
              class="w-3.5 h-3.5 text-t-primary opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <time :datetime="article.createTime">{{ formatRelativeTime(article.createTime) }}</time>
          </span>
          <span
            class="flex items-center gap-1.5 text-xs text-t-muted transition-colors duration-500 group-hover:text-t-primary">
            <Clock
              class="w-3.5 h-3.5 text-t-primary opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <time :datetime="article.updateTime">{{ formatRelativeTime(article.updateTime) }}</time>
          </span>
          <span
            class="flex items-center gap-1.5 text-xs text-t-muted transition-colors duration-500 group-hover:text-t-primary">
            <Eye
              class="w-3.5 h-3.5 text-t-primary opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            {{ formatNumber(article.viewCount) }}
          </span>
          <span
            class="flex items-center gap-1.5 text-xs text-t-muted transition-colors duration-500 group-hover:text-t-primary">
            <MessageSquare
              class="w-3.5 h-3.5 text-t-primary opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            {{ article.commentCount }}
          </span>
          <span
            class="flex items-center gap-1.5 text-xs text-t-muted transition-colors duration-500 group-hover:text-t-primary">
            <Heart
              class="w-3.5 h-3.5 text-t-primary opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            {{ article.likeCount }}
          </span>
        </div>

        <div v-if="displayTags.length > 0" class="flex flex-wrap gap-2 items-center">
          <TagBadge v-for="tag in displayTags" :key="tag.id" :tag="tag" />
          <span v-if="hiddenTagsCount > 0"
            class="inline-flex items-center justify-center min-w-[28px] h-[26px] px-2.5 text-[11px] font-semibold text-t-muted bg-[rgba(var(--color-primary-rgb),0.05)] border border-t-border rounded-full transition-all duration-500 hover:text-t-primary hover:border-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.1)] hover:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.15)]">
            +{{ hiddenTagsCount }}
          </span>
        </div>
      </div>

      <div v-if="article.coverImage"
        class="shrink-0 w-[200px] h-[140px] rounded-xl overflow-hidden max-md:w-full max-md:h-[180px]">
        <div class="relative w-full h-full rounded-xl overflow-hidden">
          <img :src="article.coverImage" :alt="article.title" loading="lazy"
            class="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" />
          <div
            class="absolute inset-0 bg-gradient-to-t from-[rgba(var(--color-primary-rgb),0.08)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          </div>
        </div>
      </div>
    </div>
  </article>

  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showTooltip"
        class="fixed z-tooltip pointer-events-none max-w-[320px]"
        :style="tooltipStyle">
        <div
          class="bg-[rgba(var(--color-surface-rgb),0.95)] border border-[rgba(var(--color-primary-rgb),0.2)] rounded-lg px-3 py-2 shadow-lg backdrop-blur-sm text-xs text-t-body leading-relaxed">
          {{ article.summary }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, type CSSProperties } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, MessageSquare, Heart, Clock, Calendar, FolderOpen } from 'lucide-vue-next'
import type { Article } from '@/types/article.d'
import { formatRelativeTime, formatNumber, resolveAvatar, handleAvatarError } from '@/utils/format'
import TagBadge from './TagBadge.vue'

const props = defineProps<{
  article: Article
}>()

const router = useRouter()
const cardRef = ref<HTMLElement | null>(null)
const summaryRef = ref<HTMLElement | null>(null)
const showTooltip = ref(false)
const tooltipStyle = ref<CSSProperties>({})
const MAX_TAGS = 10

const displayTags = computed(() => {
  if (!props.article.tags) return []
  return props.article.tags.slice(0, MAX_TAGS)
})

const hiddenTagsCount = computed(() => {
  if (!props.article.tags) return 0
  return Math.max(0, props.article.tags.length - MAX_TAGS)
})

function goDetail() {
  router.push(`/article/${props.article.slug}`)
}

function checkTruncation() {
  if (!summaryRef.value) return
  const el = summaryRef.value
  if (el.scrollHeight > el.clientHeight) {
    const rect = el.getBoundingClientRect()
    tooltipStyle.value = {
      left: `${rect.left}px`,
      top: `${rect.top - 8}px`,
      transform: 'translateY(-100%)',
    }
    showTooltip.value = true
  }
}

function onSummaryLeave() {
  showTooltip.value = false
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target === cardRef.value) {
        (entry.target as HTMLElement).style.opacity = '1'
          ; (entry.target as HTMLElement).style.transform = 'translateY(0)'
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '50px' })

  if (cardRef.value) {
    cardRef.value.style.opacity = '0'
    cardRef.value.style.transform = 'translateY(40px)'
    cardRef.value.style.transition = 'opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)'
    observer.observe(cardRef.value)
  }
})
</script>
