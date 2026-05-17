<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createArticle, updateArticle, getArticleById, getCategoryList } from '@/api'
import { uploadFile } from '@/api'
import type { Category } from '@/types'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

/**
 * 写文章/编辑文章页面
 * 使用 Vditor Markdown 编辑器
 */
const route = useRoute()
const router = useRouter()

const articleId = ref<number | null>(null)
const isEdit = ref(false)
const vditor = ref<Vditor | null>(null)
const categories = ref<Category[]>([])

const form = ref({
  title: '',
  slug: '',
  summary: '',
  coverImage: '',
  status: 1,
  content: '',
  categoryId: 0,
  tags: [] as number[],
})

const loading = ref(false)
const errorMsg = ref('')

// 加载分类列表
const loadCategories = async () => {
  try {
    const res = await getCategoryList({ size: 100 })
    if (res.code === 0) {
      categories.value = res.data.records
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

// 加载文章详情（编辑模式）
const loadArticle = async () => {
  const id = parseInt(route.params.id as string)
  if (!id) return

  articleId.value = id
  isEdit.value = true

  try {
    const res = await getArticleById(id)
    if (res.code === 0) {
      const article = res.data
      form.value.title = article.title
      form.value.slug = article.slug
      form.value.summary = article.summary
      form.value.coverImage = article.coverImage
      form.value.status = article.status
      form.value.categoryId = article.category?.id || 0

      // 设置编辑器内容
      if (vditor.value) {
        vditor.value.setValue(article.content)
      }
    }
  } catch (error) {
    console.error('加载文章失败:', error)
  }
}

// 初始化 Vditor 编辑器
const initVditor = () => {
  vditor.value = new Vditor('vditor', {
    height: 'calc(100vh - 300px)',
    placeholder: '开始写作...',
    mode: 'sv',
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'classic',
    preview: {
      theme: {
        current: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      },
    },
    toolbar: [
      'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      'link',
      '|',
      'list',
      'ordered-list',
      'check',
      'outdent',
      'indent',
      '|',
      'quote',
      'line',
      'code',
      'inline-code',
      'insert-before',
      'insert-after',
      '|',
      'upload',
      'record',
      'table',
      '|',
      'undo',
      'redo',
      '|',
      'fullscreen',
      'edit-mode',
      {
        name: 'more',
        toolbar: [
          'both',
          'code-theme',
          'content-theme',
          'export',
          'outline',
          'preview',
        ],
      },
    ],
    upload: {
      url: '/file/upload?type=image',
      linkToImgUrl: '/file/upload?type=image',
      fieldName: 'file',
      success: (_editor: HTMLPreElement, msg: string) => {
        const data = JSON.parse(msg)
        if (data.code === 0) {
          vditor.value?.insertValue(`![图片](${data.data})`)
        }
      },
    },
    after: () => {
      // 编辑器初始化完成后，如果是编辑模式则加载内容
      if (isEdit.value && form.value.content) {
        vditor.value?.setValue(form.value.content)
      }
    },
  })
}

// 上传封面图
const handleCoverUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const res = await uploadFile(file, 'cover')
    if (res.code === 0) {
      form.value.coverImage = res.data
    }
  } catch (error) {
    console.error('封面上传失败:', error)
  }
}

// 保存文章
const handleSave = async () => {
  errorMsg.value = ''

  // 表单验证
  if (!form.value.title.trim()) {
    errorMsg.value = '请输入文章标题'
    return
  }
  if (!form.value.slug.trim()) {
    errorMsg.value = '请输入文章别名'
    return
  }
  if (!form.value.categoryId) {
    errorMsg.value = '请选择分类'
    return
  }

  const content = vditor.value?.getValue() || ''
  if (!content.trim()) {
    errorMsg.value = '请输入文章内容'
    return
  }

  loading.value = true
  try {
    const data = {
      ...form.value,
      content,
    }

    let res
    if (isEdit.value && articleId.value) {
      res = await updateArticle(articleId.value, data)
    } else {
      res = await createArticle(data)
    }

    if (res.code === 0) {
      router.push('/')
    } else {
      errorMsg.value = res.msg || '保存失败'
    }
  } catch (error: unknown) {
    const err = error as { response?: { data?: { msg?: string } } }
    errorMsg.value = err.response?.data?.msg || '保存失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadCategories()
  await nextTick()
  initVditor()
  await loadArticle()
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- 顶部工具栏 -->
    <header
      class="flex h-14 items-center justify-between border-b-2 border-black px-4 dark:border-[var(--neutral-800)]"
    >
      <div class="flex items-center gap-4">
        <router-link
          to="/"
          class="text-lg font-black"
          :style="{ color: 'var(--accent-toxic)' }"
        >
          LiliBlog
        </router-link>
        <span class="font-mono text-sm">
          {{ isEdit ? '编辑文章' : '写文章' }}
        </span>
      </div>
      <div class="flex items-center gap-3">
        <!-- 保存为草稿 -->
        <button
          class="border-2 border-black px-3 py-1 text-sm font-bold dark:border-white"
          :disabled="loading"
          @click="form.status = 2; handleSave()"
        >
          存草稿
        </button>
        <!-- 发布 -->
        <button
          class="border-2 border-black bg-[var(--accent-toxic)] px-3 py-1 text-sm font-bold text-black dark:border-white"
          :disabled="loading"
          @click="form.status = 1; handleSave()"
        >
          {{ loading ? '保存中...' : '发布' }}
        </button>
      </div>
    </header>

    <!-- 文章设置 -->
    <div class="border-b-2 border-black p-4 dark:border-[var(--neutral-800)]">
      <div class="mx-auto max-w-4xl space-y-4">
        <!-- 标题 -->
        <input
          v-model="form.title"
          type="text"
          class="w-full border-2 border-black bg-transparent px-3 py-2 text-xl font-bold outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
          placeholder="文章标题"
        />

        <!-- 别名和分类 -->
        <div class="flex gap-4">
          <input
            v-model="form.slug"
            type="text"
            class="flex-1 border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
            placeholder="文章别名（用于URL）"
          />
          <select
            v-model="form.categoryId"
            class="border-2 border-black bg-transparent px-3 py-2 text-sm outline-none dark:border-[var(--neutral-800)]"
          >
            <option :value="0">选择分类</option>
            <option
              v-for="cat in categories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- 摘要 -->
        <textarea
          v-model="form.summary"
          rows="2"
          class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
          placeholder="文章摘要"
        />

        <!-- 封面图 -->
        <div class="flex items-center gap-4">
          <img
            v-if="form.coverImage"
            :src="form.coverImage"
            alt="cover"
            class="h-20 w-32 border-2 border-black object-cover dark:border-[var(--neutral-800)]"
          />
          <label class="cursor-pointer border-2 border-black px-3 py-1 text-sm font-bold dark:border-white">
            <input
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleCoverUpload"
            />
            {{ form.coverImage ? '更换封面' : '上传封面' }}
          </label>
        </div>

        <!-- 错误提示 -->
        <p
          v-if="errorMsg"
          class="text-sm font-bold"
          :style="{ color: 'var(--accent-magenta)' }"
        >
          {{ errorMsg }}
        </p>
      </div>
    </div>

    <!-- 编辑器 -->
    <div class="flex-1 p-4">
      <div class="mx-auto max-w-4xl">
        <div id="vditor" />
      </div>
    </div>
  </div>
</template>
