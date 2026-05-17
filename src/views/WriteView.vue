<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { createArticle, updateArticle, getArticleById, getAllCategories, getAllTags } from '@/api'
import type { Category, Tag } from '@/types'
import { FileImage, Send } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()

const articleId = computed(() => route.params.id ? Number(route.params.id) : null)
const isEdit = computed(() => !!articleId.value)

const vditorRef = ref<HTMLDivElement | null>(null)
let vditorInstance: any = null

const form = ref({
  title: '',
  summary: '',
  content: '',
  coverImage: '',
  categoryId: null as number | null,
  tagIds: [] as number[],
  status: 1,
})

const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])
const loading = ref(false)
const saveLoading = ref(false)

const fetchCategoriesAndTags = async () => {
  try {
    const [catRes, tagRes] = await Promise.all([
      getAllCategories(),
      getAllTags(),
    ])
    categories.value = catRes.data
    tags.value = tagRes.data
  } catch (error) {
    console.error('获取分类/标签失败', error)
  }
}

const fetchArticle = async () => {
  if (!articleId.value) return
  loading.value = true
  try {
    const res = await getArticleById(articleId.value)
    const article = res.data
    form.value = {
      title: article.title,
      summary: article.summary,
      content: article.content,
      coverImage: article.coverImage || '',
      categoryId: article.category?.id || null,
      tagIds: article.tags.map((t: Tag) => t.id),
      status: article.status,
    }
    if (vditorInstance) {
      vditorInstance.setValue(article.content)
    }
  } catch (error) {
    console.error('获取文章失败', error)
  } finally {
    loading.value = false
  }
}

const initVditor = async () => {
  const Vditor = (await import('vditor')).default
  vditorInstance = new Vditor(vditorRef.value!, {
    height: 500,
    placeholder: '开始写作...',
    theme: themeStore.isDark ? 'dark' : 'classic',
    mode: 'wysiwyg',
    toolbar: [
      'emoji', 'headings', 'bold', 'italic', 'strike', 'link',
      '|', 'list', 'ordered-list', 'check', 'outdent', 'indent',
      '|', 'quote', 'line', 'code', 'inline-code', 'insert-before', 'insert-after',
      '|', 'upload', 'table',
      '|', 'undo', 'redo',
      '|', 'fullscreen', 'preview',
    ],
    upload: {
      url: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/file/upload`,
      fieldName: 'file',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
      },
      success: (_editor: unknown, msg: string) => {
        const data = JSON.parse(msg)
        vditorInstance.insertValue(`![${data.data.originalName}](${data.data.url})`)
      },
    },
    after: () => {
      if (form.value.content) {
        vditorInstance.setValue(form.value.content)
      }
    },
    input: (value: string) => {
      form.value.content = value
    },
  })
}

const handleCoverUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const { uploadFile } = await import('@/api')
    const res = await uploadFile(file, 'cover')
    const data = res.data as { url: string }
    form.value.coverImage = data.url
  } catch (error) {
    console.error('上传封面失败', error)
  }
}

const handleSubmit = async () => {
  if (!form.value.title || !form.value.content) return
  saveLoading.value = true
  try {
    const payload = {
      title: form.value.title,
      summary: form.value.summary,
      content: form.value.content,
      coverImage: form.value.coverImage,
      status: form.value.status,
      categoryId: form.value.categoryId ?? undefined,
      tagIds: form.value.tagIds.length > 0 ? form.value.tagIds : undefined,
    }
    if (isEdit.value && articleId.value) {
      await updateArticle(articleId.value, payload)
    } else {
      await createArticle(payload)
    }
    router.push('/')
  } catch (error) {
    console.error('保存文章失败', error)
  } finally {
    saveLoading.value = false
  }
}

watch(() => themeStore.isDark, (dark) => {
  if (vditorInstance) {
    vditorInstance.setTheme(dark ? 'dark' : 'classic')
  }
})

onMounted(() => {
  fetchCategoriesAndTags()
  nextTick(() => {
    initVditor()
    if (isEdit.value) {
      fetchArticle()
    }
  })
})
</script>

<template>
  <div class="min-h-screen bg-bg-canvas">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <!-- 头部 -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold text-text-title">
          {{ isEdit ? '编辑文章' : '写文章' }}
        </h1>
        <button
          class="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-none disabled:opacity-50 flex items-center gap-2"
          :disabled="saveLoading"
          @click="handleSubmit"
        >
          <Send class="w-4 h-4" />
          {{ saveLoading ? '保存中...' : '发布' }}
        </button>
      </div>

      <!-- 表单 -->
      <div class="space-y-4 mb-6">
        <input
          v-model="form.title"
          type="text"
          placeholder="文章标题"
          class="w-full px-4 py-3 bg-bg-surface border border-border rounded-xl text-lg font-bold text-text-title placeholder:text-text-meta focus:outline-none focus:border-primary"
        />
        <textarea
          v-model="form.summary"
          rows="2"
          placeholder="文章摘要（可选）"
          class="w-full px-4 py-3 bg-bg-surface border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary resize-none"
        />

        <div class="flex flex-wrap items-center gap-3">
          <!-- 分类选择 -->
          <select
            v-model="form.categoryId"
            class="px-4 py-2.5 bg-bg-surface border border-border rounded-xl text-sm text-text-body focus:outline-none focus:border-primary"
          >
            <option :value="null">选择分类</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>

          <!-- 标签选择 -->
          <div class="flex items-center gap-2 flex-wrap">
            <label
              v-for="tag in tags"
              :key="tag.id"
              :class="[
                'px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-none',
                form.tagIds.includes(tag.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-bg-surface border border-border text-text-meta hover:text-text-body',
              ]"
            >
              <input
                v-model="form.tagIds"
                type="checkbox"
                :value="tag.id"
                class="hidden"
              />
              {{ tag.name }}
            </label>
          </div>

          <!-- 封面上传 -->
          <div class="flex items-center gap-2">
            <label class="flex items-center gap-2 px-4 py-2.5 bg-bg-surface border border-border rounded-xl text-sm text-text-body cursor-pointer hover:bg-bg-canvas transition-none">
              <FileImage class="w-4 h-4" />
              {{ form.coverImage ? '更换封面' : '上传封面' }}
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleCoverUpload"
              />
            </label>
            <img
              v-if="form.coverImage"
              :src="form.coverImage"
              alt="封面"
              class="w-10 h-10 rounded-lg object-cover"
            />
          </div>

          <!-- 状态选择 -->
          <select
            v-model="form.status"
            class="px-4 py-2.5 bg-bg-surface border border-border rounded-xl text-sm text-text-body focus:outline-none focus:border-primary"
          >
            <option :value="1">已发布</option>
            <option :value="0">审核中</option>
            <option :value="2">草稿</option>
          </select>
        </div>
      </div>

      <!-- 编辑器 -->
      <div ref="vditorRef" class="bg-bg-surface rounded-2xl overflow-hidden border border-border" />
    </div>
  </div>
</template>
