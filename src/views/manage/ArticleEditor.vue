<template>
  <div class="h-screen flex flex-col bg-t-bg overflow-hidden">
    <header class="flex-shrink-0 h-16 flex items-center justify-between px-4 sm:px-6 z-50 border-b border-t-border"
      style="background:rgba(var(--color-bg-rgb),0.95);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);">
      <div class="flex items-center gap-3">
        <router-link to="/" class="flex items-center gap-2 no-underline group">
          <img :src="logoSvg" alt="LiliBlog"
            class="w-[100px] h-auto object-contain transition-[filter] duration-400 group-hover:[filter:drop-shadow(0_0_8px_rgba(var(--color-primary-rgb),0.6))]" />
        </router-link>
        <span class="text-t-muted text-xs hidden sm:inline">/</span>
        <span class="text-t-body text-sm font-medium hidden sm:inline">{{ isEdit ? '编辑文章' : '写文章' }}</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5 mr-2 text-xs">
          <div v-if="saveState.status === 'saving'" class="flex items-center gap-1 text-t-primary">
            <div
              class="w-3 h-3 border-2 border-[rgba(var(--color-primary-rgb),0.3)] border-t-t-primary rounded-full animate-spin">
            </div>
            <span class="hidden sm:inline">保存中</span>
          </div>
          <div v-else-if="saveState.status === 'saved'" class="flex items-center gap-1 text-[#4ade80]">
            <CheckCircle class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">已保存</span>
          </div>
          <div v-else-if="saveState.status === 'error'" class="flex items-center gap-1 text-t-secondary">
            <AlertCircle class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">保存失败</span>
            <button class="underline hover:no-underline" @click="manualSave">重试</button>
          </div>
        </div>
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[rgba(var(--color-primary-rgb),0.08)] border border-[rgba(var(--color-primary-rgb),0.2)] text-t-muted hover:text-t-primary hover:border-t-primary transition-all duration-300"
          @click="manualSave">
          <Save class="w-4 h-4" />
          <span class="hidden sm:inline">本地保存</span>
        </button>
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[rgba(var(--color-primary-rgb),0.06)] border border-t-border text-t-muted hover:text-t-primary transition-all duration-300"
          @click="handleSubmit(2)">
          <FileText class="w-4 h-4" />
          <span class="hidden sm:inline">存草稿</span>
        </button>
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.2)] hover:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.15)] transition-all duration-300"
          :disabled="saving" @click="handleSubmit(1)">
          <Send class="w-4 h-4" />
          <span class="hidden sm:inline">发布</span>
        </button>
      </div>
    </header>

    <div class="flex flex-1 min-h-0">
      <div class="flex-1 min-w-0 flex flex-col bg-t-bg">
        <div class="flex-1 min-h-0 p-4">
          <div class="h-full rounded-xl overflow-hidden border border-[rgba(var(--color-primary-rgb),0.06)]"
            style="background:rgba(var(--color-bg-rgb),0.8)">
            <MarkdownEditor v-model="form.content" @input="onContentChange" />
          </div>
        </div>
      </div>

      <aside
        class="flex-shrink-0 overflow-y-auto transition-all duration-300 border-l border-[rgba(var(--color-primary-rgb),0.08)]"
        :class="metaOpen ? 'w-80' : 'w-0 border-l-0'" style="background:rgba(var(--color-bg-rgb),0.6)">
        <div v-if="metaOpen" class="w-80 p-4 space-y-4">
          <div>
            <label class="flex items-center gap-1.5 text-xs font-semibold text-t-body mb-1.5 uppercase tracking-wider">
              <Type class="w-3.5 h-3.5 text-t-primary" />
              标题 <span class="text-t-secondary">*</span>
            </label>
            <input v-model="form.title" type="text" placeholder="输入文章标题"
              class="w-full h-9 px-3 rounded-lg bg-[rgba(var(--color-bg-rgb),0.5)] border text-t-body text-sm outline-none transition-all duration-300 focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)]"
              :class="errors.title ? 'border-t-secondary' : 'border-t-border focus:border-t-primary'"
              @input="clearError('title'); onContentChange()" />
            <p v-if="errors.title" class="mt-1 text-xs text-t-secondary">{{ errors.title }}</p>
          </div>

          <div>
            <label class="flex items-center gap-1.5 text-xs font-semibold text-t-body mb-1.5 uppercase tracking-wider">
              <Link class="w-3.5 h-3.5 text-t-primary" />
              别名 <span class="text-t-secondary">*</span>
            </label>
            <input v-model="form.slug" type="text" placeholder="仅支持字母、数字和连字符"
              class="w-full h-9 px-3 rounded-lg bg-[rgba(var(--color-bg-rgb),0.5)] border text-t-body text-sm outline-none transition-all duration-300 focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)]"
              :class="errors.slug ? 'border-t-secondary' : 'border-t-border focus:border-t-primary'"
              @input="validateSlug" />
            <p v-if="errors.slug" class="mt-1 text-xs text-t-secondary">{{ errors.slug }}</p>
            <p v-else class="mt-1 text-xs text-t-muted">URL友好标识，如: my-first-article</p>
          </div>

          <div>
            <label class="flex items-center gap-1.5 text-xs font-semibold text-t-body mb-1.5 uppercase tracking-wider">
              <AlignLeft class="w-3.5 h-3.5 text-t-primary" />
              摘要 <span class="text-t-secondary">*</span>
            </label>
            <textarea v-model="form.summary" placeholder="输入文章摘要"
              class="w-full min-h-[100px] p-3 rounded-lg bg-[rgba(var(--color-bg-rgb),0.5)] border text-t-body text-sm leading-relaxed placeholder-t-muted outline-none resize-none transition-all duration-300 focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)]"
              :class="errors.summary ? 'border-t-secondary' : 'border-t-border focus:border-t-primary'"
              @input="clearError('summary'); onContentChange()"></textarea>
            <p v-if="errors.summary" class="mt-1 text-xs text-t-secondary">{{ errors.summary }}</p>
          </div>

          <div>
            <label class="flex items-center gap-1.5 text-xs font-semibold text-t-body mb-1.5 uppercase tracking-wider">
              <FolderOpen class="w-3.5 h-3.5 text-t-primary" />
              分类 <span class="text-t-secondary">*</span>
            </label>
            <button
              class="w-full h-9 px-3 rounded-lg bg-[rgba(var(--color-bg-rgb),0.5)] border text-left text-sm outline-none transition-all duration-300 flex items-center justify-between"
              :class="errors.categoryId ? 'border-t-secondary' : 'border-t-border hover:border-[rgba(var(--color-primary-rgb),0.4)]'"
              @click="showCategoryModal = true">
              <span :class="form.categoryId ? 'text-t-body' : 'text-t-muted'">
                {{ selectedCategoryName || '选择分类' }}
              </span>
              <ChevronRight class="w-3.5 h-3.5 text-t-muted" />
            </button>
            <p v-if="errors.categoryId" class="mt-1 text-xs text-t-secondary">{{ errors.categoryId }}</p>
          </div>

          <div>
            <label class="flex items-center gap-1.5 text-xs font-semibold text-t-body mb-1.5 uppercase tracking-wider">
              <Image class="w-3.5 h-3.5 text-t-primary" />
              封面
            </label>
            <div v-if="form.coverImage"
              class="relative rounded-lg overflow-hidden border border-[rgba(var(--color-primary-rgb),0.1)] mb-2">
              <img :src="form.coverImage" :alt="form.title" class="w-full h-32 object-cover" />
              <button
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-[rgba(var(--color-bg-rgb),0.6)] text-t-secondary flex items-center justify-center text-xs hover:bg-[rgba(var(--color-secondary-rgb),0.2)] transition-colors"
                @click="form.coverImage = ''">✕</button>
            </div>
            <label
              class="flex items-center justify-center gap-1.5 h-9 rounded-lg border border-dashed border-[rgba(var(--color-primary-rgb),0.2)] text-t-muted text-sm cursor-pointer hover:border-t-primary hover:text-t-primary transition-all duration-300">
              <Upload class="w-3.5 h-3.5" />
              {{ form.coverImage ? '更换封面' : '上传封面' }}
              <input type="file" accept="image/*" class="hidden" @change="handleCoverUpload" />
            </label>
          </div>

          <div>
            <label class="flex items-center gap-1.5 text-xs font-semibold text-t-body mb-1.5 uppercase tracking-wider">
              <TagIcon class="w-3.5 h-3.5 text-t-primary" />
              标签
            </label>
            <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2 mb-3 pb-3 border-b border-t-border">
              <span v-for="tagId in form.tags" :key="tagId"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-all duration-200 hover:-translate-y-px"
                :style="{
                  color: getTagColor(tagId) || 'var(--color-primary)',
                  backgroundColor: (getTagColor(tagId) || 'var(--color-primary)') + '15',
                  borderColor: (getTagColor(tagId) || 'var(--color-primary)') + '40',
                }" @click="toggleTag(tagId)">
                <span class="w-1.5 h-1.5 rounded-full opacity-70"
                  :style="{ backgroundColor: getTagColor(tagId) || 'var(--color-primary)' }"></span>
                {{ getTagName(tagId) }}
                <span class="text-[10px] opacity-60">✕</span>
              </span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button v-for="tag in availableTags" :key="tag.id"
                class="px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:-translate-y-px"
                :style="{
                  color: (tag.color || 'var(--color-primary)') + 'aa',
                  borderColor: (tag.color || 'var(--color-primary)') + '30',
                }" @click="toggleTag(tag.id)">
                + {{ tag.name }}
              </button>
              <button v-if="tagCurrentPage < tagTotalPages"
                class="px-2.5 py-1 rounded-full text-xs font-medium text-t-muted border border-t-border hover:text-t-primary hover:border-[rgba(var(--color-primary-rgb),0.3)] transition-all duration-200"
                @click="loadMoreTags">
                加载更多...
              </button>
            </div>
          </div>
        </div>
      </aside>

      <button
        class="flex-shrink-0 w-8 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[rgba(var(--color-primary-rgb),0.06)]"
        style="background:rgba(var(--color-bg-rgb),0.4);border-left:1px solid rgba(var(--color-primary-rgb),0.08)"
        @click="metaOpen = !metaOpen">
        <ChevronLeft v-if="metaOpen" class="w-4 h-4 text-t-primary" />
        <ChevronRight v-else class="w-4 h-4 text-t-muted" />
      </button>
    </div>

    <Teleport to="body">
      <div v-if="showRestoreDialog" class="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.7)]"
        style="backdrop-filter:blur(4px)">
        <div class="rounded-xl p-6 max-w-md w-full mx-4 border border-[rgba(var(--color-primary-rgb),0.2)]"
          style="background:rgba(var(--color-surface-rgb),0.95)">
          <h3 class="text-lg font-semibold text-t-title mb-3">发现未保存的草稿</h3>
          <p class="text-sm text-t-muted mb-5">检测到上次编辑的未保存内容，是否恢复？</p>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 rounded-lg text-sm text-t-muted border border-t-border hover:text-t-body transition-colors"
              @click="discardRestore">放弃</button>
            <button
              class="px-4 py-2 rounded-lg text-sm font-semibold text-t-primary bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.2)] transition-all"
              @click="confirmRestore">恢复草稿</button>
          </div>
        </div>
      </div>

      <div v-if="showCategoryModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.6)]"
        style="backdrop-filter:blur(4px)" @click.self="showCategoryModal = false">
        <div class="rounded-xl w-full max-w-sm mx-4 border border-[rgba(var(--color-primary-rgb),0.2)] overflow-hidden"
          style="background:rgba(var(--color-surface-rgb),0.98)">
          <div class="flex items-center justify-between px-5 py-4 border-b border-t-border">
            <h3 class="text-base font-semibold text-t-title m-0">选择分类</h3>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-md text-t-muted hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-colors"
              @click="showCategoryModal = false">
              <X class="w-4 h-4" />
            </button>
          </div>

          <div v-if="categoryLoading" class="p-5 space-y-3">
            <div v-for="i in 4" :key="i" class="h-8 bg-[rgba(var(--color-primary-rgb),0.06)] rounded-lg animate-pulse">
            </div>
          </div>

          <div v-else class="max-h-[320px] overflow-y-auto p-3">
            <button v-for="cat in categoryList" :key="cat.id"
              class="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all duration-200"
              :class="form.categoryId === cat.id ? 'text-t-primary bg-[rgba(var(--color-primary-rgb),0.1)] font-medium' : 'text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:text-t-primary'"
              @click="selectCategory(cat.id)">
              <span>{{ cat.name }}</span>
              <Check v-if="form.categoryId === cat.id" class="w-4 h-4 text-t-primary" />
            </button>
            <div v-if="categoryList.length === 0" class="flex flex-col items-center gap-2 py-8 text-t-muted text-sm">
              <FolderOpen class="w-8 h-8 opacity-40" />
              <span>暂无分类</span>
            </div>
          </div>

          <div v-if="categoryTotalPages > 1"
            class="flex items-center justify-between px-5 py-3 border-t border-t-border">
            <button
              class="px-3 py-1.5 rounded-md text-xs text-t-muted border border-t-border hover:text-t-primary hover:border-[rgba(var(--color-primary-rgb),0.3)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="categoryCurrentPage <= 1" @click="loadCategories(categoryCurrentPage - 1)">
              上一页
            </button>
            <span class="text-xs text-t-muted">{{ categoryCurrentPage }} / {{ categoryTotalPages }}</span>
            <button
              class="px-3 py-1.5 rounded-md text-xs text-t-muted border border-t-border hover:text-t-primary hover:border-[rgba(var(--color-primary-rgb),0.3)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="categoryCurrentPage >= categoryTotalPages" @click="loadCategories(categoryCurrentPage + 1)">
              下一页
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Save, Send, Image, FolderOpen, Tag as TagIcon, Link, FileText, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Type, AlignLeft, Upload, Check, X } from 'lucide-vue-next'
import { createArticle, updateArticle, getArticleById } from '@/api/article'
import { uploadFile } from '@/api/file'
import { getCategories } from '@/api/category'
import { getTags } from '@/api/tag'
import { useAutoSave } from '@/composables/useAutoSave'
import { useToast } from '@/composables/useToast'
import MarkdownEditor from '@/components/article/MarkdownEditor.vue'
import type { Category } from '@/types/category'
import type { Tag as TagType } from '@/types/tag'
import logoSvg from '@/assets/logo.svg'

const router = useRouter()
const route = useRoute()
const saving = ref(false)
const metaOpen = ref(true)
const showRestoreDialog = ref(false)
const showCategoryModal = ref(false)
const categories = ref<Category[]>([])
const tags = ref<TagType[]>([])

const categoryList = ref<Category[]>([])
const categoryCurrentPage = ref(1)
const categoryTotalPages = ref(1)
const categoryLoading = ref(false)

const tagCurrentPage = ref(1)
const tagTotalPages = ref(1)

const isEdit = computed(() => !!route.params.id)
const draftKey = computed(() => `article_${isEdit.value ? route.params.id : 'new'}`)

const form = reactive({
  title: '',
  slug: '',
  summary: '',
  content: '',
  coverImage: '',
  categoryId: undefined as number | undefined,
  tags: [] as number[],
})

const errors = reactive<Record<string, string>>({
  title: '',
  slug: '',
  summary: '',
  categoryId: '',
})

const selectedCategoryName = computed(() => {
  if (!form.categoryId) return ''
  const allCats = [...categories.value, ...categoryList.value]
  return allCats.find(c => c.id === form.categoryId)?.name || ''
})

const availableTags = computed(() => tags.value.filter(t => !form.tags.includes(t.id)))

function getDraftData() {
  return JSON.stringify({
    title: form.title,
    slug: form.slug,
    summary: form.summary,
    content: form.content,
    coverImage: form.coverImage,
    categoryId: form.categoryId,
    tags: form.tags,
  })
}

const { state: saveState, save: autoSave, notifyChange, checkAndRestore, restore, markClean, clearDraft } = useAutoSave(draftKey.value, getDraftData)
const toast = useToast()

function onContentChange() {
  notifyChange()
}

async function manualSave() {
  await autoSave()
}

function clearError(field: string) {
  errors[field] = ''
}

function validateSlug() {
  const slug = form.slug
  if (!slug) {
    errors.slug = ''
    onContentChange()
    return
  }
  if (/[^a-zA-Z0-9-]/.test(slug)) {
    errors.slug = '仅支持字母、数字和连字符'
    return
  }
  if (slug.startsWith('-') || slug.endsWith('-')) {
    errors.slug = '不能以连字符开头或结尾'
    return
  }
  errors.slug = ''
  onContentChange()
}

function validate(): boolean {
  let valid = true
  if (!form.title.trim()) { errors.title = '请输入标题'; valid = false } else { errors.title = '' }
  if (!form.slug.trim()) { errors.slug = '请输入别名'; valid = false }
  else if (/[^a-zA-Z0-9-]/.test(form.slug) || form.slug.startsWith('-') || form.slug.endsWith('-')) { errors.slug = '别名格式不正确'; valid = false } else { errors.slug = '' }
  if (!form.summary.trim()) { errors.summary = '请输入摘要'; valid = false } else { errors.summary = '' }
  if (!form.categoryId) { errors.categoryId = '请选择分类'; valid = false } else { errors.categoryId = '' }
  if (!form.content.trim()) { valid = false }
  return valid
}

function getTagName(tagId: number) {
  return tags.value.find(t => t.id === tagId)?.name || ''
}

function getTagColor(tagId: number) {
  return tags.value.find(t => t.id === tagId)?.color || ''
}

function toggleTag(tagId: number) {
  const idx = form.tags.indexOf(tagId)
  if (idx > -1) form.tags.splice(idx, 1)
  else form.tags.push(tagId)
  onContentChange()
}

function selectCategory(id: number) {
  form.categoryId = id
  clearError('categoryId')
  onContentChange()
  showCategoryModal.value = false
}

async function loadCategories(page: number = 1) {
  categoryLoading.value = true
  try {
    const res = await getCategories({ current: page, size: 20 }) as any
    categoryList.value = res.data?.records || []
    categoryCurrentPage.value = res.data?.current || 1
    categoryTotalPages.value = res.data?.totalPage || 1
  } catch {
    categoryList.value = []
  } finally {
    categoryLoading.value = false
  }
}

async function loadMoreTags() {
  if (tagCurrentPage.value >= tagTotalPages.value) return
  const nextPage = tagCurrentPage.value + 1
  try {
    const res = await getTags({ current: nextPage, size: 50 }) as any
    const newTags = res.data?.records || []
    const existingIds = new Set(tags.value.map(t => t.id))
    for (const t of newTags) {
      if (!existingIds.has(t.id)) tags.value.push(t)
    }
    tagCurrentPage.value = res.data?.current || nextPage
    tagTotalPages.value = res.data?.totalPage || 1
  } catch {
    // skip
  }
}

async function handleCoverUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  try {
    const res = await uploadFile(file, 'cover') as any
    form.coverImage = res.message?.trim() || res.data
    onContentChange()
    toast.success('封面上传成功')
  } catch {
    // handled by interceptor
  }
  target.value = ''
}

async function handleSubmit(status: number) {
  if (!validate()) return
  saving.value = true
  try {
    const data = {
      title: form.title,
      slug: form.slug || undefined,
      summary: form.summary || undefined,
      content: form.content,
      coverImage: form.coverImage || undefined,
      status,
      categoryId: form.categoryId || 0,
      tags: form.tags,
    }
    if (isEdit.value) {
      const id = Number(route.params.id)
      await updateArticle(id, data)
      toast.success(status === 1 ? '文章已发布' : '草稿已保存')
    } else {
      await createArticle(data)
      toast.success(status === 1 ? '文章发布成功' : '草稿保存成功')
    }
    await clearDraft()
    router.push('/user/me')
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
    form.slug = article.slug || ''
    form.summary = article.summary || ''
    form.content = article.content
    form.coverImage = article.coverImage
    form.categoryId = article.category?.id || undefined
    form.tags = article.tags?.map((t: any) => t.id) || []
    markClean()
  } catch {
    router.push('/user/me')
  }
}

async function confirmRestore() {
  showRestoreDialog.value = false
  const data = await restore()
  if (data) {
    try {
      const parsed = JSON.parse(data)
      form.title = parsed.title || ''
      form.slug = parsed.slug || ''
      form.summary = parsed.summary || ''
      form.content = parsed.content || ''
      form.coverImage = parsed.coverImage || ''
      form.categoryId = parsed.categoryId
      form.tags = parsed.tags || []
    } catch {
      // skip
    }
  }
}

function discardRestore() {
  showRestoreDialog.value = false
  markClean()
}

onMounted(async () => {
  const [catRes, tagRes] = await Promise.allSettled([
    getCategories({ size: 100 }) as any,
    getTags({ current: 1, size: 50 }) as any,
  ])
  if (catRes.status === 'fulfilled') {
    categories.value = catRes.value.data?.records || []
  }
  if (tagRes.status === 'fulfilled') {
    tags.value = tagRes.value.data?.records || []
    tagCurrentPage.value = tagRes.value.data?.current || 1
    tagTotalPages.value = tagRes.value.data?.totalPage || 1
  }

  await loadArticleForEdit()

  const hasDraft = await checkAndRestore()
  if (hasDraft) {
    showRestoreDialog.value = true
  }
})

watch(showCategoryModal, (val) => {
  if (val) loadCategories(1)
})
</script>
