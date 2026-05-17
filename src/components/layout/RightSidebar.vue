<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllCategories } from '@/api'
import { getAllTags } from '@/api'
import type { Category } from '@/types'
import type { Tag } from '@/types'

const router = useRouter()

const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])

const fetchCategories = async () => {
  try {
    const res = await getAllCategories()
    categories.value = res.data
  } catch (error) {
    console.error('获取分类失败', error)
  }
}

const fetchTags = async () => {
  try {
    const res = await getAllTags()
    tags.value = res.data
  } catch (error) {
    console.error('获取标签失败', error)
  }
}

onMounted(() => {
  fetchCategories()
  fetchTags()
})
</script>

<template>
  <div class="space-y-6">
    <!-- 分类列表 -->
    <div class="bg-bg-surface rounded-2xl p-5 card-shadow">
      <h3 class="text-sm font-bold text-text-title mb-4 uppercase tracking-wide">分类</h3>
      <div class="space-y-2">
        <button
          v-for="category in categories"
          :key="category.id"
          class="w-full text-left px-3 py-2 rounded-lg text-sm text-text-body hover:bg-bg-canvas hover:text-text-title transition-none flex items-center justify-between group"
          @click="router.push(`/category/${category.slug}`)"
        >
          <span>{{ category.name }}</span>
          <span class="text-xs text-text-meta group-hover:text-accent-toxic">{{ category.articleCount }}</span>
        </button>
      </div>
    </div>

    <!-- 标签云 -->
    <div class="bg-bg-surface rounded-2xl p-5 card-shadow">
      <h3 class="text-sm font-bold text-text-title mb-4 uppercase tracking-wide">标签</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in tags"
          :key="tag.id"
          class="pill-badge bg-bg-canvas text-text-meta hover:text-text-title hover:bg-accent-toxic hover:text-black transition-none"
          @click="router.push(`/tag/${tag.slug}`)"
        >
          {{ tag.name }}
        </button>
      </div>
    </div>
  </div>
</template>
