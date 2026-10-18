<template>
  <AppLayout :show-hero="false">
    <article class="rounded-xl bg-t-surface border border-t-border p-4 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
      <header class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-t-title leading-snug mb-4" style="text-shadow:0 0 20px rgba(0,240,255,0.15)">
          {{ article.title }}
        </h1>

        <div class="flex flex-wrap items-center gap-4 text-sm text-t-muted">
          <NuxtLink
            v-if="article.creator"
            :to="`/user/${article.creator.id}`"
            class="flex items-center gap-2 text-t-muted no-underline transition-colors duration-300 hover:text-t-primary group"
          >
            <img
              :src="resolveAvatar(article.creator.avatar)"
              :alt="article.creator.nickname"
              class="w-6 h-6 rounded-full border border-[rgba(var(--color-primary-rgb),0.2)] object-cover transition-all duration-300 group-hover:border-t-primary group-hover:shadow-[0_0_6px_rgba(var(--color-primary-rgb),0.3)]"
              @error="handleAvatarError"
            />
            <span class="transition-colors duration-300 group-hover:text-t-primary">{{ article.creator.nickname }}</span>
          </NuxtLink>
          <span class="flex items-center gap-1.5">
            <Calendar class="w-4 h-4 text-t-primary" />
            发布于 <time :datetime="article.createTime">{{ formatDateTime(article.createTime) }}</time>
          </span>
          <span v-if="article.updateTime && article.updateTime !== article.createTime" class="flex items-center gap-1.5">
            <Clock class="w-4 h-4 text-t-primary" />
            更新于 <time :datetime="article.updateTime">{{ formatDateTime(article.updateTime) }}</time>
          </span>
          <span class="flex items-center gap-1.5">
            <Eye class="w-4 h-4 text-t-primary" />
            {{ article.viewCount }}
          </span>
          <span class="flex items-center gap-1.5">
            <FolderOpen class="w-4 h-4 text-t-primary" />
            {{ article.category?.name || '未分类' }}
          </span>

          <div class="relative ml-auto">
            <button
              class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-t-border text-t-muted transition-all duration-200 hover:text-t-primary hover:border-[rgba(var(--color-primary-rgb),0.4)] cursor-pointer"
              title="代码主题"
              @click="showCodeThemeMenu = !showCodeThemeMenu"
            >
              <Palette class="w-4 h-4 text-t-primary" />
              <span>{{ currentCodeThemeName }}</span>
              <ChevronDown class="w-3.5 h-3.5 transition-transform duration-200" :class="{ 'rotate-180': showCodeThemeMenu }" />
            </button>
            <div v-if="showCodeThemeMenu" class="absolute right-0 top-full mt-2 w-56 rounded-xl bg-t-surface border border-t-border p-2 shadow-[0_0_24px_rgba(var(--color-primary-rgb),0.1)] z-[70]">
              <h4 class="text-xs font-semibold text-t-muted uppercase tracking-wider px-2 py-1.5">代码块主题</h4>
              <button
                v-for="theme in codeThemes"
                :key="theme.id"
                class="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-all duration-200 cursor-pointer"
                :class="currentCodeTheme === theme.id ? 'bg-[rgba(var(--color-primary-rgb),0.08)]' : 'hover:bg-[rgba(var(--color-primary-rgb),0.05)]'"
                @click="setCodeTheme(theme.id)"
              >
                <span class="w-4 h-4 rounded-sm border border-t-border flex-shrink-0" :style="{ backgroundColor: theme.preview.bg }" />
                <span class="text-sm flex-1" :class="currentCodeTheme === theme.id ? 'text-t-primary font-medium' : 'text-t-body'">{{ theme.name }}</span>
                <Check v-if="currentCodeTheme === theme.id" class="w-4 h-4 text-t-primary flex-shrink-0" />
              </button>
            </div>
            <div v-if="showCodeThemeMenu" class="fixed inset-0 z-[60]" @click="showCodeThemeMenu = false" />
          </div>
        </div>

        <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mt-3">
          <NuxtLink
            v-for="tag in article.tags"
            :key="tag.id"
            :to="`/tag/${encodeURIComponent(tag.name)}`"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold no-underline border transition-all duration-200 hover:-translate-y-px"
            :style="{
              color: tag.color || '#00f0ff',
              backgroundColor: (tag.color || '#00f0ff') + '15',
              borderColor: (tag.color || '#00f0ff') + '40',
              boxShadow: `0 0 6px ${(tag.color || '#00f0ff')}20`,
            }"
          >
            <span class="w-1.5 h-1.5 rounded-full opacity-70" :style="{ backgroundColor: tag.color || '#00f0ff', boxShadow: `0 0 4px ${tag.color || '#00f0ff'}` }" />
            {{ tag.name }}
          </NuxtLink>
        </div>
      </header>

      <div v-if="article.coverImage" class="mb-8 rounded-lg overflow-hidden border border-[rgba(var(--color-primary-rgb),0.1)]">
        <img :src="article.coverImage" :alt="article.title" class="w-full max-h-[200px] md:max-h-[400px] object-cover" loading="lazy" />
      </div>

      <MarkdownViewer :content-html="article.contentHtml || ''" />

      <div class="flex items-center gap-4 mt-10 pt-6 border-t border-t-border">
        <button
          class="flex items-center gap-1.5 text-sm transition-all duration-300 px-2 py-1 md:px-0 md:py-0"
          :class="isLiked ? 'text-t-secondary hover:text-t-secondary/80' : 'text-t-muted hover:text-t-secondary'"
          @click="toggleLike"
        >
          <Heart class="w-4 h-4 transition-transform duration-200" :class="{ 'fill-current scale-110': isLiked, 'scale-100': !isLiked }" />
          {{ likeCount }}
        </button>
      </div>

      <div class="mt-10">
        <h3 class="text-lg font-semibold text-t-title mb-4 pb-2 border-b-2 border-t-primary inline-block shadow-[0_2px_8px_rgba(var(--color-primary-rgb),0.2)]">
          评论区
        </h3>
        <CommentSection :article-id="article.id" />
      </div>
    </article>

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
import type { ArticleDetail } from '~/types'
import { formatDateTime, handleAvatarError, resolveAvatar } from '~/utils/format'

const props = defineProps<{
  article: ArticleDetail
}>()

const api = useApi()
const userStore = useUserStore()
const toast = useToast()
const { currentCodeTheme, codeThemes, setCodeTheme } = useCodeTheme()

const isLiked = ref(false)
const likeCount = ref(props.article.likeCount)
const showCodeThemeMenu = ref(false)

const currentCodeThemeName = computed(
  () => codeThemes.find(theme => theme.id === currentCodeTheme.value)?.name || '代码主题',
)

onMounted(async () => {
  if (!userStore.isLoggedIn) return
  try {
    isLiked.value = (await api.get<boolean>(`/api/article/${props.article.id}/like`)) === true
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
      await api.put(`/api/article/${props.article.id}/unlike`)
      isLiked.value = false
      likeCount.value--
    } else {
      await api.put(`/api/article/${props.article.id}/like`)
      isLiked.value = true
      likeCount.value++
    }
  } catch (error) {
    toast.error(error)
  }
}
</script>
