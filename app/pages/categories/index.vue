<template>
  <AppLayout :show-hero="false">
    <div class="min-h-screen">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-[rgba(var(--color-primary-rgb),0.1)] border border-[rgba(var(--color-primary-rgb),0.3)] flex items-center justify-center">
            <LayoutGrid class="w-5 h-5 text-t-primary" />
          </div>
          <h1 class="text-2xl font-bold text-t-title">全部分类</h1>
        </div>
        <p class="text-t-muted text-sm ml-[52px]">共 {{ categories.length }} 个分类</p>
      </div>

      <div v-if="pending && categories.length === 0" class="flex flex-col gap-3">
        <div v-for="i in 3" :key="i" class="h-20 rounded-xl bg-t-surface border border-t-border animate-pulse" />
      </div>

      <div v-else-if="categories.length === 0" class="text-center py-16">
        <FolderOpen class="w-16 h-16 text-t-muted mx-auto mb-4 opacity-30" />
        <p class="text-t-muted text-lg mb-2">暂无分类</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/category/${encodeURIComponent(category.slug)}`"
          class="group flex items-center gap-4 p-4 rounded-xl bg-t-surface border border-t-border no-underline transition-all duration-200 hover:border-[rgba(var(--color-primary-rgb),0.3)] hover:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.06)] hover:-translate-y-0.5"
        >
          <div class="w-10 h-10 rounded-lg bg-[rgba(var(--color-primary-rgb),0.08)] border border-[rgba(var(--color-primary-rgb),0.15)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(var(--color-primary-rgb),0.12)] transition-colors duration-200">
            <FolderOpen class="w-5 h-5 text-t-primary" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-t-body group-hover:text-t-primary transition-colors duration-200 truncate">{{ category.name }}</h3>
            <p v-if="category.description" class="text-xs text-t-muted mt-0.5 line-clamp-1">{{ category.description }}</p>
          </div>
          <ChevronRight class="w-4 h-4 text-t-muted opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 flex-shrink-0" />
        </NuxtLink>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight, FolderOpen, LayoutGrid } from 'lucide-vue-next'
import { absoluteUrl } from '~/utils/seo'

const { data: categoryData, pending } = await useCategories()
const categories = computed(() => categoryData.value || [])

useSeoMeta({
  title: '全部分类 | 立里博客',
  description: '按分类浏览立里博客的全部文章。',
  ogTitle: '全部分类 | 立里博客',
})

useHead({
  link: [{ rel: 'canonical', href: absoluteUrl('/categories') }],
})
</script>
