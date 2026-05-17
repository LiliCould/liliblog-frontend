<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCategoryList, getArticleList } from '@/api'
import { useAuthStore } from '@/stores/auth'
import type { Category, UserInfo } from '@/types'
import { Github, Mail, Youtube, GitBranch, FileText, FolderOpen, Tag } from 'lucide-vue-next'

/**
 * 左侧边栏组件
 * 显示作者信息、分类目录、统计信息
 */
const route = useRoute()
const authStore = useAuthStore()

const categories = ref<Category[]>([])
const articleCount = ref(0)
const tagCount = ref(0)
const authorInfo = ref<UserInfo | null>(null)

// 判断当前页面类型，决定显示哪个作者的信息
const isArticlePage = computed(() => route.name === 'ArticleDetail')

const loadData = async () => {
  try {
    // 加载分类列表
    const catRes = await getCategoryList({ size: 100 })
    if (catRes.code === 0) {
      categories.value = catRes.data.records
    }

    // 加载文章统计
    const artRes = await getArticleList({ status: 1, size: 1 })
    if (artRes.code === 0) {
      articleCount.value = artRes.data.total
    }

    // 加载作者信息
    if (isArticlePage.value && route.params.slug) {
      // 文章详情页：显示文章作者信息（需要先从文章获取作者ID）
      // 这里简化处理，显示当前登录用户或默认信息
      authorInfo.value = authStore.userInfo
    } else {
      // 其他页面：显示当前登录用户或默认信息
      authorInfo.value = authStore.userInfo
    }
  } catch (error) {
    console.error('加载侧边栏数据失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <aside class="space-y-6">
    <!-- 作者信息卡片 -->
    <div
      class="border-2 border-black p-4 dark:border-[var(--neutral-800)]"
    >
      <div class="flex flex-col items-center text-center">
        <img
          :src="authorInfo?.avatar || '/default-avatar.png'"
          alt="avatar"
          class="h-20 w-20 rounded-full border-2 border-black object-cover dark:border-white"
        />
        <h3 class="mt-3 text-lg font-bold">
          {{ authorInfo?.nickname || 'LiliCould' }}
        </h3>
        <p class="mt-1 text-sm text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
          技术与生活的分享空间
        </p>

        <!-- 社交链接 -->
        <div class="mt-3 flex gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener"
            class="p-1"
          >
            <Github class="h-5 w-5" />
          </a>
          <a
            href="mailto:example@qq.com"
            class="p-1"
          >
            <Mail class="h-5 w-5" />
          </a>
          <a
            href="https://bilibili.com"
            target="_blank"
            rel="noopener"
            class="p-1"
          >
            <Youtube class="h-5 w-5" />
          </a>
          <a
            href="https://gitee.com"
            target="_blank"
            rel="noopener"
            class="p-1"
          >
            <GitBranch class="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>

    <!-- 分类目录 -->
    <div
      class="border-2 border-black p-4 dark:border-[var(--neutral-800)]"
    >
      <h3 class="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
        <FolderOpen class="h-4 w-4" />
        分类目录
      </h3>
      <ul class="space-y-1">
        <li
          v-for="cat in categories"
          :key="cat.id"
        >
          <router-link
            :to="`/category/${cat.slug}`"
            class="flex items-center justify-between text-sm"
          >
            <span>{{ cat.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- 统计信息 -->
    <div
      class="border-2 border-black p-4 dark:border-[var(--neutral-800)]"
    >
      <h3 class="mb-3 text-sm font-bold uppercase tracking-wide">
        统计信息
      </h3>
      <div class="space-y-2 font-mono text-sm">
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-2">
            <FileText class="h-4 w-4" />
            文章
          </span>
          <span class="font-bold">{{ articleCount }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-2">
            <FolderOpen class="h-4 w-4" />
            分类
          </span>
          <span class="font-bold">{{ categories.length }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-2">
            <Tag class="h-4 w-4" />
            标签
          </span>
          <span class="font-bold">{{ tagCount }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>
