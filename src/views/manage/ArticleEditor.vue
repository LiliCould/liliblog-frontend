<template>
  <div class="min-h-screen bg-[#0a0a0f] flex flex-col">
    <header class="sticky top-0 z-50 flex items-center justify-between px-4 h-14 bg-[#111118] border-b border-[rgba(0,240,255,0.15)] shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
      <div class="flex items-center gap-3">
        <button class="text-[#6b7280] hover:text-[#00f0ff] transition-colors duration-200" @click="router.back()">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <input
          v-model="form.title"
          type="text"
          placeholder="输入文章标题..."
          class="bg-transparent text-white text-lg font-semibold placeholder-[#6b7280] outline-none w-60 md:w-96"
        />
      </div>
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[rgba(0,240,255,0.08)] border border-[rgba(0,240,255,0.2)] text-[#6b7280] hover:text-[#00f0ff] hover:border-[#00f0ff] transition-all duration-300"
          :disabled="saving"
          @click="handleSave(0)"
        >
          <Save class="w-4 h-4" />
          保存草稿
        </button>
        <button
          class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[rgba(0,240,255,0.12)] border border-[#00f0ff] text-[#00f0ff] hover:bg-[rgba(0,240,255,0.2)] hover:shadow-[0_0_10px_rgba(0,240,255,0.15)] transition-all duration-300"
          :disabled="saving"
          @click="handleSave(1)"
        >
          <Send class="w-4 h-4" />
          发布
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <div class="flex-1 min-w-0 overflow-y-auto p-4">
        <MarkdownEditor v-model="form.content" />
      </div>

      <aside class="hidden md:block w-72 flex-shrink-0 border-l border-[rgba(0,240,255,0.15)] bg-[#111118] overflow-y-auto p-4">
        <div class="flex flex-col gap-5">
          <div>
            <label class="flex items-center gap-1.5 text-sm font-medium text-[#e0e0e8] mb-2">
              <Image class="w-4 h-4 text-[#00f0ff]" />
              封面图片
            </label>
            <div v-if="form.coverImage" class="relative rounded-lg overflow-hidden border border-[rgba(0,240,255,0.1)] mb-2">
              <img :src="form.coverImage" :alt="form.title" class="w-full h-36 object-cover" />
              <button
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-[rgba(0,0,0,0.6)] text-[#ff2d78] flex items-center justify-center text-xs hover:bg-[rgba(255,45,120,0.2)] transition-colors"
                @click="form.coverImage = ''"
              >✕</button>
            </div>
            <label class="flex items-center justify-center gap-1.5 h-10 rounded-lg border border-dashed border-[rgba(0,240,255,0.2)] text-[#6b7280] text-sm cursor-pointer hover:border-[#00f0ff] hover:text-[#00f0ff] transition-all duration-300">
              <Image class="w-4 h-4" />
              {{ form.coverImage ? '更换封面' : '上传封面' }}
              <input type="file" accept="image/*" class="hidden" @change="handleCoverUpload" />
            </label>
          </div>

          <div>
            <label class="flex items-center gap-1.5 text-sm font-medium text-[#e0e0e8] mb-2">
              <FolderOpen class="w-4 h-4 text-[#00f0ff]" />
              分类
            </label>
            <select
              v-model="form.categoryId"
              class="w-full h-10 px-3 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.1)] appearance-none cursor-pointer"
            >
              <option :value="undefined" disabled class="bg-[#0a0a0f]">选择分类</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="bg-[#0a0a0f]">{{ cat.name }}</option>
            </select>
          </div>

          <div>
            <label class="flex items-center gap-1.5 text-sm font-medium text-[#e0e0e8] mb-2">
              <Tag class="w-4 h-4 text-[#00f0ff]" />
              标签
            </label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="tagId in form.tags"
                :key="tagId"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[rgba(0,240,255,0.1)] text-[#00f0ff] border border-[rgba(0,240,255,0.25)] cursor-pointer hover:bg-[rgba(255,45,120,0.1)] hover:text-[#ff2d78] hover:border-[#ff2d78] transition-all duration-200"
                @click="toggleTag(tagId)"
              >
                {{ getTagName(tagId) }}
                <span class="text-[10px]">✕</span>
              </span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="tag in availableTags"
                :key="tag.id"
                class="px-2.5 py-1 rounded-full text-xs border border-[rgba(0,240,255,0.1)] text-[#6b7280] hover:border-[rgba(0,240,255,0.3)] hover:text-[#00f0ff] transition-all duration-200"
                @click="toggleTag(tag.id)"
              >
                + {{ tag.name }}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Save, Send, Image, FolderOpen, Tag, ArrowLeft } from 'lucide-vue-next'
import { createArticle, updateArticle, getArticleById } from '@/api/article'
import { uploadFile } from '@/api/file'
import { getCategories } from '@/api/category'
import { getTags } from '@/api/tag'
import MarkdownEditor from '@/components/article/MarkdownEditor.vue'
import type { Category } from '@/types/category'
import type { Tag as TagType } from '@/types/tag'

const router = useRouter()
const route = useRoute()
const saving = ref(false)
const categories = ref<Category[]>([])
const tags = ref<TagType[]>([])

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  content: '',
  coverImage: '',
  categoryId: undefined as number | undefined,
  tags: [] as number[],
})

const availableTags = computed(() => tags.value.filter(t => !form.tags.includes(t.id)))

function getTagName(tagId: number) {
  return tags.value.find(t => t.id === tagId)?.name || ''
}

function toggleTag(tagId: number) {
  const idx = form.tags.indexOf(tagId)
  if (idx > -1) form.tags.splice(idx, 1)
  else form.tags.push(tagId)
}

async function handleCoverUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  try {
    const res = await uploadFile(file, 'cover') as any
    form.coverImage = res.message?.trim() || res.data
  } catch {
    // handled by interceptor
  }
  target.value = ''
}

async function handleSave(status: number) {
  if (!form.title.trim() || !form.content.trim()) return
  saving.value = true
  try {
    const data = {
      title: form.title,
      content: form.content,
      coverImage: form.coverImage || undefined,
      status,
      categoryId: form.categoryId || 0,
      tags: form.tags,
    }
    if (isEdit.value) {
      const id = Number(route.params.id)
      await updateArticle(id, data)
    } else {
      await createArticle(data)
    }
    router.push('/manage/articles')
  } catch {
    // handled by interceptor
  } finally {
    saving.value = false
  }
}

async function loadArticleForEdit() {
  if (!isEdit.value) return
  const id = Number(route.params.id)
  try {
    const res = await getArticleById(id) as any
    const article = res.data
    form.title = article.title
    form.content = article.content
    form.coverImage = article.coverImage
    form.categoryId = article.category?.id || undefined
    form.tags = article.tags?.map((t: any) => t.id) || []
  } catch {
    router.push('/manage/articles')
  }
}

onMounted(async () => {
  const [catRes, tagRes] = await Promise.allSettled([
    getCategories({ size: 100 }) as any,
    getTags({ size: 100 }) as any,
  ])
  if (catRes.status === 'fulfilled') categories.value = catRes.value.data?.records || []
  if (tagRes.status === 'fulfilled') tags.value = tagRes.value.data?.records || []
  loadArticleForEdit()
})
</script>
