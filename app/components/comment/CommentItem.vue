<template>
  <div class="card-glass p-4">
    <div class="flex gap-3">
      <NuxtLink v-if="comment.creator" :to="`/user/${comment.creator.id}`" class="shrink-0">
        <img
          :src="resolveAvatar(comment.creator.avatar)"
          :alt="comment.creator.nickname"
          class="w-9 h-9 rounded-full border border-[rgba(var(--color-primary-rgb),0.2)] object-cover transition-all duration-300 hover:border-t-primary hover:shadow-[0_0_6px_rgba(var(--color-primary-rgb),0.3)]"
          loading="lazy"
          @error="handleAvatarError"
        />
      </NuxtLink>
      <div v-else class="shrink-0">
        <img :src="resolveAvatar()" alt="匿名" class="w-9 h-9 rounded-full border border-[rgba(var(--color-primary-rgb),0.2)] object-cover" loading="lazy" @error="handleAvatarError" />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <NuxtLink
            v-if="comment.creator"
            :to="`/user/${comment.creator.id}`"
            class="text-sm font-semibold text-t-primary no-underline transition-colors duration-300 hover:text-t-primary/80"
          >
            {{ comment.creator.nickname || '匿名' }}
          </NuxtLink>
          <span v-else class="text-sm font-semibold text-t-primary">匿名</span>
          <span v-if="comment.ipAddressLocation" class="inline-flex items-center gap-0.5 text-[11px] text-t-muted bg-[rgba(var(--color-primary-rgb),0.06)] px-1.5 py-0.5 rounded">
            <MapPin class="w-3 h-3" />
            {{ comment.ipAddressLocation }}
          </span>
          <span class="text-xs text-t-muted">{{ formatRelativeTime(comment.createTime) }}</span>
        </div>

        <p class="text-sm text-t-body leading-relaxed mb-2 break-words">{{ comment.content }}</p>

        <div class="flex items-center gap-4">
          <button class="flex min-h-11 items-center gap-1 px-1 text-xs text-t-muted transition-colors duration-300 hover:text-t-secondary" @click="emit('reply', comment)">
            <MessageSquare class="w-3.5 h-3.5" />
            回复
          </button>
          <button
            class="flex min-h-11 items-center gap-1 px-1 text-xs transition-all duration-300"
            :class="isLiked ? 'text-t-secondary hover:text-t-secondary/80' : 'text-t-muted hover:text-t-secondary'"
            :disabled="likeLoading"
            :aria-pressed="isLiked"
            @click="toggleLike"
          >
            <Heart class="w-3.5 h-3.5 transition-transform duration-200" :class="{ 'fill-current scale-110': isLiked, 'scale-100': !isLiked }" />
            {{ likeCount }}
          </button>

          <button v-if="comment.childCount > 0 && !expanded" class="flex min-h-11 items-center gap-1 px-1 text-xs text-t-primary transition-all duration-300 hover:text-t-secondary" @click="toggleChildren">
            <ChevronDown class="w-3.5 h-3.5 transition-transform duration-300" :class="{ 'rotate-180': expanded }" />
            展开 {{ comment.childCount }} 条回复
          </button>

          <button v-if="expanded" class="flex min-h-11 items-center gap-1 px-1 text-xs text-t-muted transition-all duration-300 hover:text-t-primary" @click="toggleChildren">
            <ChevronUp class="w-3.5 h-3.5" />
            收起回复
          </button>
        </div>

        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-[2000px]"
          leave-from-class="opacity-100 max-h-[2000px]"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="expanded && children.length > 0" class="mt-3 pl-4 border-l-2 border-t-border space-y-3 overflow-hidden">
            <div v-for="child in children" :key="child.id" class="flex gap-2.5 py-1">
              <NuxtLink v-if="child.creator" :to="`/user/${child.creator.id}`" class="shrink-0">
                <img :src="resolveAvatar(child.creator.avatar)" :alt="child.creator.nickname" class="w-7 h-7 rounded-full border border-t-border object-cover transition-all duration-300 hover:border-t-primary hover:shadow-[0_0_6px_rgba(var(--color-primary-rgb),0.3)]" loading="lazy" @error="handleAvatarError" />
              </NuxtLink>
              <div v-else class="shrink-0">
                <img :src="resolveAvatar()" alt="匿名" class="w-7 h-7 rounded-full border border-t-border object-cover" loading="lazy" @error="handleAvatarError" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <NuxtLink v-if="child.creator" :to="`/user/${child.creator.id}`" class="text-xs font-semibold text-t-primary no-underline transition-colors duration-300 hover:text-t-primary/80">
                    {{ child.creator.nickname || '匿名' }}
                  </NuxtLink>
                  <span v-else class="text-xs font-semibold text-t-primary">匿名</span>
                  <span v-if="child.ipAddressLocation" class="inline-flex items-center gap-0.5 text-[10px] text-t-muted bg-[rgba(var(--color-primary-rgb),0.06)] px-1 py-0.5 rounded">
                    <MapPin class="w-2.5 h-2.5" />
                    {{ child.ipAddressLocation }}
                  </span>
                  <span class="text-[10px] text-t-muted">{{ formatRelativeTime(child.createTime) }}</span>
                </div>
                <p class="text-xs text-t-body leading-relaxed break-words">{{ child.content }}</p>
                <div class="flex items-center gap-3 mt-1">
                  <button class="flex items-center gap-1 text-[10px] text-t-muted transition-colors duration-300 hover:text-t-secondary" @click="emit('reply', child)">
                    <MessageSquare class="w-3 h-3" />
                    回复
                  </button>
                  <ChildLikeButton :comment-id="child.id" :initial-count="child.likeCount" />
                </div>
              </div>
            </div>

            <div v-if="childrenLoading" class="flex justify-center py-2">
              <div class="w-5 h-5 border-2 border-[rgba(var(--color-primary-rgb),0.3)] border-t-t-primary rounded-full animate-spin" />
            </div>

            <button v-if="hasMoreChildren && !childrenLoading" class="flex items-center gap-1 text-xs text-t-primary transition-colors duration-300 hover:text-t-secondary py-1" @click="loadMoreChildren">
              <ChevronDown class="w-3.5 h-3.5" />
              加载更多回复
            </button>
          </div>
        </Transition>

        <div v-if="expanded && childrenLoading && children.length === 0" class="mt-3 pl-4 border-l-2 border-t-border flex justify-center py-3">
          <div class="w-5 h-5 border-2 border-[rgba(var(--color-primary-rgb),0.3)] border-t-t-primary rounded-full animate-spin" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import { ChevronDown, ChevronUp, Heart, MapPin, MessageSquare } from 'lucide-vue-next'
import type { Comment, PageResult } from '~/types'
import { formatRelativeTime, handleAvatarError, resolveAvatar } from '~/utils/format'

const props = defineProps<{
  comment: Comment
  articleId: number
}>()

const emit = defineEmits<{
  reply: [comment: Comment]
}>()

const api = useApi()
const userStore = useUserStore()

const children = ref<Comment[]>([])
const expanded = ref(false)
const childrenLoading = ref(false)
const childrenPage = ref(1)
const hasMoreChildren = ref(false)

const isLiked = ref(false)
const likeCount = ref(props.comment.likeCount || 0)
const likeLoading = ref(false)

const ChildLikeButton = {
  props: {
    commentId: { type: Number, required: true },
    initialCount: { type: Number, default: 0 },
  },
  setup(childProps: { commentId: number; initialCount: number }) {
    const childApi = useApi()
    const childUserStore = useUserStore()
    const liked = ref(false)
    const count = ref(childProps.initialCount)
    const loading = ref(false)

    onMounted(async () => {
      if (!childUserStore.isLoggedIn) return
      try {
        liked.value = (await childApi.get<boolean>(`/api/comment/${childProps.commentId}/like`)) === true
      } catch {
        liked.value = false
      }
    })

    async function toggleChildLike(): Promise<void> {
      if (!childUserStore.isLoggedIn || loading.value) return
      loading.value = true
      try {
        if (liked.value) {
          await childApi.put(`/api/comment/${childProps.commentId}/unlike`)
          liked.value = false
          count.value--
        } else {
          await childApi.put(`/api/comment/${childProps.commentId}/like`)
          liked.value = true
          count.value++
        }
      } catch {
        try {
          liked.value = (await childApi.get<boolean>(`/api/comment/${childProps.commentId}/like`)) === true
        } catch {
          // ignore
        }
      } finally {
        loading.value = false
      }
    }

    return () => h('button', {
      class: [
        'flex items-center gap-1 text-[10px] transition-all duration-300',
        liked.value ? 'text-t-secondary hover:text-t-secondary/80' : 'text-t-muted hover:text-t-secondary',
      ],
      disabled: loading.value,
      onClick: toggleChildLike,
    }, [
      h(Heart, {
        class: ['w-3 h-3 transition-transform duration-200', liked.value ? 'fill-current scale-110' : 'scale-100'],
      }),
      String(count.value),
    ])
  },
}

onMounted(async () => {
  if (!userStore.isLoggedIn) return
  try {
    isLiked.value = (await api.get<boolean>(`/api/comment/${props.comment.id}/like`)) === true
  } catch {
    isLiked.value = false
  }
})

async function toggleLike(): Promise<void> {
  if (!userStore.isLoggedIn) {
    useAuthModal().open('login')
    return
  }
  if (likeLoading.value) return
  likeLoading.value = true
  try {
    if (isLiked.value) {
      await api.put(`/api/comment/${props.comment.id}/unlike`)
      isLiked.value = false
      likeCount.value--
    } else {
      await api.put(`/api/comment/${props.comment.id}/like`)
      isLiked.value = true
      likeCount.value++
    }
  } catch {
    try {
      isLiked.value = (await api.get<boolean>(`/api/comment/${props.comment.id}/like`)) === true
    } catch {
      // ignore
    }
  } finally {
    likeLoading.value = false
  }
}

async function toggleChildren(): Promise<void> {
  if (expanded.value) {
    expanded.value = false
    return
  }
  expanded.value = true
  if (children.value.length === 0) await loadChildren()
}

async function loadChildren(): Promise<void> {
  childrenLoading.value = true
  try {
    const page = await api.get<PageResult<Comment>>('/api/comment/child', {
      id: props.comment.id,
      current: childrenPage.value,
      size: 10,
    })
    children.value = [...children.value, ...(page.records || [])]
    hasMoreChildren.value = page.hasNext === true
  } catch {
    // ignore
  } finally {
    childrenLoading.value = false
  }
}

async function loadMoreChildren(): Promise<void> {
  childrenPage.value++
  await loadChildren()
}
</script>
