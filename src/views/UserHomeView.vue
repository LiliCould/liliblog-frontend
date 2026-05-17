<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getUserById, getArticleList } from '@/api'
import { useAuthStore } from '@/stores/auth'
import type { UserInfo, Article, PageResult } from '@/types'
import ArticleCard from '@/components/article/ArticleCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingBlock from '@/components/common/LoadingBlock.vue'
import { FileText, Heart } from 'lucide-vue-next'

/**
 * 用户主页
 * 展示用户信息及其发布的文章
 */
const route = useRoute()
const authStore = useAuthStore()

const user = ref<UserInfo | null>(null)
const articles = ref<Article[]>([])
const pageResult = ref<PageResult<Article> | null>(null)
const loading = ref(false)

// 判断是否为当前登录用户的主页
const isMe = computed(() => {
  return route.path === '/user/me' || (route.params.id && String(route.params.id) === String(authStore.userInfo?.id))
})

// 获取用户 ID
const userId = computed(() => {
  if (route.path === '/user/me') {
    return authStore.userInfo?.id
  }
  return parseInt(route.params.id as string) || 0
})

const loadData = async (page = 1) => {
  if (!userId.value) return

  loading.value = true
  try {
    // 加载用户信息
    const userRes = await getUserById(userId.value)
    if (userRes.code === 0) {
      user.value = userRes.data
    }

    // 加载用户文章
    const artRes = await getArticleList({
      createBy: userId.value,
      status: 1,
      current: page,
      size: 10,
    })
    if (artRes.code === 0) {
      articles.value = artRes.data.records
      pageResult.value = artRes.data
    }
  } catch (error) {
    console.error('加载用户主页失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  loadData(page)
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div>
    <!-- 用户信息卡片 -->
    <div
      v-if="user"
      class="mb-6 border-2 border-black p-6 dark:border-[var(--neutral-800)]"
    >
      <div class="flex items-center gap-4">
        <img
          :src="user.avatar || '/default-avatar.png'"
          :alt="user.nickname"
          class="h-16 w-16 rounded-full border-2 border-black object-cover dark:border-white"
        />
        <div>
          <h1 class="text-xl font-black">
            {{ user.nickname }}
            <span
              v-if="user.role === 0"
              class="ml-2 border px-2 py-0.5 text-xs"
              :style="{ borderColor: 'var(--accent-toxic)', color: 'var(--accent-toxic)' }"
            >
              管理员
            </span>
          </h1>
          <p class="mt-1 font-mono text-sm text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
            @{{ user.username }}
          </p>
          <div class="mt-2 flex gap-4 font-mono text-xs">
            <span class="flex items-center gap-1">
              <FileText class="h-3 w-3" />
              {{ articles.length }} 篇文章
            </span>
            <span class="flex items-center gap-1">
              <Heart class="h-3 w-3" />
              0 获赞
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="mb-4 border-b-2 border-black pb-2 dark:border-[var(--neutral-800)]">
      <h2 class="text-lg font-bold">
        {{ isMe ? '我的文章' : 'TA 的文章' }}
      </h2>
    </div>

    <LoadingBlock v-if="loading" />

    <div
      v-else-if="articles.length > 0"
      class="space-y-6"
    >
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />

      <div
        v-if="pageResult && pageResult.totalPage > 1"
        class="pt-4"
      >
        <Pagination
          :current="pageResult.current"
          :total-page="pageResult.totalPage"
          :has-previous="pageResult.hasPrevious"
          :has-next="pageResult.hasNext"
          @change="handlePageChange"
        />
      </div>
    </div>

    <EmptyState
      v-else
      :message="isMe ? '您还没有发布文章' : '该用户暂无文章'"
    />
  </div>
</template>
