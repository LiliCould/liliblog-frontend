<template>
  <AppLayout :show-hero="false">
    <div class="min-w-0">
      <ReadingProgress :target="articleRef" />

    <article ref="articleRef" class="card-glass p-4 md:p-8">
      <header class="mb-8">
        <div class="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <NuxtLink
            v-if="article.category"
            :to="`/category/${encodeURIComponent(article.category.slug)}`"
            class="chip-glass px-3 py-1 font-medium no-underline"
          >
            <FolderOpen class="w-3.5 h-3.5 text-t-primary" />
            {{ article.category.name }}
          </NuxtLink>
          <span class="chip-glass px-3 py-1 font-medium">
            <Clock class="w-3.5 h-3.5 text-t-primary" />
            {{ readingMinutes }} 分钟阅读
          </span>
        </div>

        <h1 class="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight text-t-title">
          {{ article.title }}
        </h1>

        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-t-muted">
          <NuxtLink
            v-if="article.creator"
            :to="`/user/${article.creator.id}`"
            class="group flex items-center gap-2 text-t-muted no-underline transition-colors duration-300 hover:text-t-primary"
          >
            <img
              :src="resolveAvatar(article.creator.avatar)"
              :alt="article.creator.nickname"
              class="h-8 w-8 rounded-full border border-[rgba(var(--color-primary-rgb),0.2)] object-cover transition-all duration-300 group-hover:border-t-primary"
              @error="handleAvatarError"
            />
            <span class="font-medium">{{ article.creator.nickname }}</span>
          </NuxtLink>

          <span class="flex items-center gap-1.5">
            <Calendar class="h-4 w-4 text-t-primary opacity-70" />
            <time :datetime="article.createTime">{{ formatDateTime(article.createTime) }}</time>
          </span>

          <span v-if="article.updateTime && article.updateTime !== article.createTime" class="flex items-center gap-1.5">
            <Clock class="h-4 w-4 text-t-primary opacity-70" />
            <time :datetime="article.updateTime">{{ formatDateTime(article.updateTime) }}</time>
          </span>

          <span class="flex items-center gap-1.5">
            <Eye class="h-4 w-4 text-t-primary opacity-70" />
            {{ formatNumber(article.viewCount) }}
          </span>

          <div class="ml-auto">
            <DropdownMenuRoot>
              <DropdownMenuTrigger as-child>
                <button class="btn-glass flex items-center gap-1.5 px-3 py-1.5 text-xs text-t-muted">
                  <Palette class="h-4 w-4 text-t-primary" />
                  <span>{{ currentCodeThemeName }}</span>
                  <ChevronDown class="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuPortal>
                <DropdownMenuContent
                  align="end"
                  :side-offset="8"
                  class="panel-glass z-[var(--z-popover)] w-60 p-1.5 outline-none"
                >
                  <DropdownMenuLabel class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-t-muted">
                    代码块主题
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator class="h-px bg-[rgba(var(--color-primary-rgb),0.1)]" />
                  <DropdownMenuRadioGroup
                    :model-value="currentCodeTheme"
                    @update:model-value="onCodeThemeChange"
                  >
                    <DropdownMenuRadioItem
                      v-for="theme in codeThemes"
                      :key="theme.id"
                      :value="theme.id"
                      class="flex cursor-pointer items-center gap-2.5 rounded-control px-3 py-2 text-sm text-t-body outline-none transition-colors duration-150 data-[highlighted]:bg-[rgba(var(--color-primary-rgb),0.08)] data-[highlighted]:text-t-primary data-[state=checked]:text-t-primary"
                    >
                      <span
                        class="h-4 w-4 shrink-0 rounded-sm border border-t-border"
                        :style="{ backgroundColor: theme.preview.bg }"
                      />
                      <span class="flex-1">{{ theme.name }}</span>
                      <DropdownMenuItemIndicator>
                        <Check class="h-4 w-4" />
                      </DropdownMenuItemIndicator>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </div>
        </div>

        <div v-if="article.tags && article.tags.length > 0" class="mt-3 flex flex-wrap gap-2">
          <NuxtLink
            v-for="tag in article.tags"
            :key="tag.id"
            :to="`/tag/${encodeURIComponent(tag.name)}`"
            class="chip-glass px-3 py-1 text-xs font-semibold no-underline hover:-translate-y-px"
            :style="tagStyle(tag.color)"
          >
            <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: tag.color || 'var(--color-primary)' }" />
            {{ tag.name }}
          </NuxtLink>
        </div>
      </header>

      <div v-if="article.coverImage" class="mb-8 overflow-hidden rounded-2xl border border-[var(--glass-border)]">
        <img
          :src="article.coverImage"
          :alt="article.title"
          class="aspect-[16/9] w-full object-cover"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
      </div>

      <MarkdownViewer :content-html="article.contentHtml || ''" />

      <div class="mt-10 flex items-center gap-4 border-t border-[var(--glass-border)] pt-6">
        <button
          class="flex min-h-11 items-center gap-1.5 rounded-control px-2 text-sm transition-all duration-300"
          :class="isLiked ? 'text-t-secondary hover:text-t-secondary/80' : 'text-t-muted hover:text-t-secondary'"
          :aria-pressed="isLiked"
          @click="toggleLike"
        >
          <Heart class="h-4 w-4 transition-transform duration-200" :class="{ 'fill-current scale-110': isLiked }" />
          {{ likeCount }}
        </button>
      </div>

      <div class="mt-10">
        <h3 class="mb-4 inline-block border-b-2 border-t-primary pb-2 text-lg font-semibold text-t-title">
          评论区
        </h3>
        <CommentSection :article-id="article.id" />
      </div>
    </article>
    </div>

    <template #rightSidebarTop>
      <ArticleToc :html-content="article.contentHtml || ''" />
    </template>

    <ClientOnly>
      <MobileTocPanel :html-content="article.contentHtml || ''" />
    </ClientOnly>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Calendar, Check, ChevronDown, Clock, Eye, FolderOpen, Heart, Palette } from 'lucide-vue-next'
import {
  DropdownMenuContent,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import type { ArticleDetail } from '~/types'
import { withAlpha } from '~/utils/color'
import { formatDateTime, formatNumber, handleAvatarError, resolveAvatar } from '~/utils/format'
import { getReadingMinutes } from '~/utils/reading'

const props = defineProps<{
  article: ArticleDetail
}>()

const authApi = useAuthApi()
const userStore = useUserStore()
const toast = useToast()
const { currentCodeTheme, codeThemes, setCodeTheme } = useCodeTheme()

const articleRef = ref<HTMLElement | null>(null)
const isLiked = ref(false)
const likeCount = ref(props.article.likeCount)

const readingMinutes = computed(() => getReadingMinutes(props.article.contentHtml || ''))

const currentCodeThemeName = computed(
  () => codeThemes.find(theme => theme.id === currentCodeTheme.value)?.name || '代码主题',
)

function onCodeThemeChange(value: unknown): void {
  if (typeof value === 'string') {
    setCodeTheme(value)
  }
}

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

onMounted(async () => {
  if (!userStore.isLoggedIn) return
  try {
    isLiked.value = (await authApi.get<boolean>(`/api/article/${props.article.id}/like`)) === true
  } catch {
    isLiked.value = false
  }
})

async function toggleLike(): Promise<void> {
  if (!userStore.isLoggedIn) {
    useAuthModal().open('login')
    return
  }

  try {
    if (isLiked.value) {
      await authApi.put(`/api/article/${props.article.id}/unlike`)
      isLiked.value = false
      likeCount.value--
    } else {
      await authApi.put(`/api/article/${props.article.id}/like`)
      isLiked.value = true
      likeCount.value++
    }
  } catch (error) {
    toast.error(error)
  }
}
</script>
