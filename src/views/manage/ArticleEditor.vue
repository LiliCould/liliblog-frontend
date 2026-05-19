<template>
  <div class="h-screen flex flex-col bg-[#0e0e14] overflow-hidden">
    <header class="flex-shrink-0 h-16 flex items-center justify-between px-4 sm:px-6 z-50"
      style="background:rgba(10,10,15,0.95);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(0,240,255,0.15)">
      <div class="flex items-center gap-3">
        <router-link to="/" class="flex items-center gap-2 no-underline group">
          <img :src="logoSvg" alt="LiliBlog"
            class="w-[100px] h-auto object-contain transition-[filter] duration-400 group-hover:[filter:drop-shadow(0_0_8px_rgba(0,240,255,0.6))]" />
        </router-link>
        <span class="text-[#6b7280] text-xs hidden sm:inline">/</span>
        <span class="text-[#e0e0e8] text-sm font-medium hidden sm:inline">{{ isEdit ? '编辑文章' : '写文章' }}</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5 mr-2 text-xs">
          <div v-if="saveState.status === 'saving'" class="flex items-center gap-1 text-[#00f0ff]">
            <div class="w-3 h-3 border-2 border-[rgba(0,240,255,0.3)] border-t-[#00f0ff] rounded-full animate-spin">
            </div>
            <span class="hidden sm:inline">保存中</span>
          </div>
          <div v-else-if="saveState.status === 'saved'" class="flex items-center gap-1 text-[#4ade80]">
            <CheckCircle class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">已保存</span>
          </div>
          <div v-else-if="saveState.status === 'error'" class="flex items-center gap-1 text-[#ff2d78]">
            <AlertCircle class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">保存失败</span>
            <button class="underline hover:no-underline" @click="manualSave">重试</button>
          </div>
        </div>
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[rgba(0,240,255,0.08)] border border-[rgba(0,240,255,0.2)] text-[#6b7280] hover:text-[#00f0ff] hover:border-[#00f0ff] transition-all duration-300"
          @click="manualSave">
          <Save class="w-4 h-4" />
          <span class="hidden sm:inline">本地保存</span>
        </button>
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[rgba(0,240,255,0.06)] border border-[rgba(0,240,255,0.15)] text-[#6b7280] hover:text-[#00f0ff] transition-all duration-300"
          @click="handleSubmit(2)">
          <FileText class="w-4 h-4" />
          <span class="hidden sm:inline">存草稿</span>
        </button>
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-[rgba(0,240,255,0.12)] border border-[#00f0ff] text-[#00f0ff] hover:bg-[rgba(0,240,255,0.2)] hover:shadow-[0_0_10px_rgba(0,240,255,0.15)] transition-all duration-300"
          :disabled="saving" @click="handleSubmit(1)">
          <Send class="w-4 h-4" />
          <span class="hidden sm:inline">发布</span>
        </button>
      </div>
    </header>

    <div class="flex flex-1 min-h-0">
      <div class="flex-1 min-w-0 flex flex-col bg-[#0e0e14]">
        <div class="flex-1 min-h-0 p-4">
          <div class="h-full rounded-xl overflow-hidden border border-[rgba(0,240,255,0.06)]"
            style="background:rgba(14,14,20,0.8)">
            <MarkdownEditor v-model="form.content" @input="onContentChange" />
          </div>
        </div>
      </div>

      <aside class="flex-shrink-0 overflow-y-auto transition-all duration-300 border-l border-[rgba(0,240,255,0.08)]"
        :class="metaOpen ? 'w-80' : 'w-0 border-l-0'" style="background:rgba(14,14,20,0.6)">
        <div v-if="metaOpen" class="w-80 p-4 space-y-4">
          <div>
            <label
              class="flex items-center gap-1.5 text-xs font-semibold text-[#e0e0e8] mb-1.5 uppercase tracking-wider">
              <Type class="w-3.5 h-3.5 text-[#00f0ff]" />
              标题 <span class="text-[#ff2d78]">*</span>
            </label>
            <input v-model="form.title" type="text" placeholder="输入文章标题"
              class="w-full h-9 px-3 rounded-lg bg-[rgba(0,0,0,0.3)] border text-[#e0e0e8] text-sm outline-none transition-all duration-300 focus:shadow-[0_0_8px_rgba(0,240,255,0.1)]"
              :class="errors.title ? 'border-[#ff2d78]' : 'border-[rgba(0,240,255,0.15)] focus:border-[#00f0ff]'"
              @input="clearError('title'); onContentChange()" />
            <p v-if="errors.title" class="mt-1 text-xs text-[#ff2d78]">{{ errors.title }}</p>
          </div>

          <div>
            <label
              class="flex items-center gap-1.5 text-xs font-semibold text-[#e0e0e8] mb-1.5 uppercase tracking-wider">
              <Link class="w-3.5 h-3.5 text-[#00f0ff]" />
              别名 <span class="text-[#ff2d78]">*</span>
            </label>
            <input v-model="form.slug" type="text" placeholder="仅支持字母、数字和连字符"
              class="w-full h-9 px-3 rounded-lg bg-[rgba(0,0,0,0.3)] border text-[#e0e0e8] text-sm outline-none transition-all duration-300 focus:shadow-[0_0_8px_rgba(0,240,255,0.1)]"
              :class="errors.slug ? 'border-[#ff2d78]' : 'border-[rgba(0,240,255,0.15)] focus:border-[#00f0ff]'"
              @input="validateSlug" />
            <p v-if="errors.slug" class="mt-1 text-xs text-[#ff2d78]">{{ errors.slug }}</p>
            <p v-else class="mt-1 text-xs text-[#6b7280]">URL友好标识，如: my-first-article</p>
          </div>

          <div>
            <label
              class="flex items-center gap-1.5 text-xs font-semibold text-[#e0e0e8] mb-1.5 uppercase tracking-wider">
              <AlignLeft class="w-3.5 h-3.5 text-[#00f0ff]" />
              摘要 <span class="text-[#ff2d78]">*</span>
            </label>
            <textarea v-model="form.summary" placeholder="输入文章摘要"
              class="w-full min-h-[100px] p-3 rounded-lg bg-[rgba(0,0,0,0.3)] border text-[#e0e0e8] text-sm leading-relaxed placeholder-[#6b7280] outline-none resize-none transition-all duration-300 focus:shadow-[0_0_8px_rgba(0,240,255,0.1)]"
              :class="errors.summary ? 'border-[#ff2d78]' : 'border-[rgba(0,240,255,0.15)] focus:border-[#00f0ff]'"
              @input="clearError('summary'); onContentChange()"></textarea>
            <p v-if="errors.summary" class="mt-1 text-xs text-[#ff2d78]">{{ errors.summary }}</p>
          </div>

          <div>
            <label
              class="flex items-center gap-1.5 text-xs font-semibold text-[#e0e0e8] mb-1.5 uppercase tracking-wider">
              <FolderOpen class="w-3.5 h-3.5 text-[#00f0ff]" />
              分类 <span class="text-[#ff2d78]">*</span>
            </label>
            <select v-model="form.categoryId"
              class="w-full h-9 px-3 rounded-lg bg-[rgba(0,0,0,0.3)] border text-[#e0e0e8] text-sm outline-none transition-all duration-300 focus:border-[#00f0ff] appearance-none cursor-pointer"
              :class="errors.categoryId ? 'border-[#ff2d78]' : 'border-[rgba(0,240,255,0.15)]'"
              @change="clearError('categoryId'); onContentChange()">
              <option :value="undefined" disabled class="bg-[#0a0a0f]">选择分类</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="bg-[#0a0a0f]">{{ cat.name }}
              </option>
            </select>
            <p v-if="errors.categoryId" class="mt-1 text-xs text-[#ff2d78]">{{ errors.categoryId }}</p>
          </div>

          <div>
            <label
              class="flex items-center gap-1.5 text-xs font-semibold text-[#e0e0e8] mb-1.5 uppercase tracking-wider">
              <Image class="w-3.5 h-3.5 text-[#00f0ff]" />
              封面
            </label>
            <div v-if="form.coverImage"
              class="relative rounded-lg overflow-hidden border border-[rgba(0,240,255,0.1)] mb-2">
              <img :src="form.coverImage" :alt="form.title" class="w-full h-32 object-cover" />
              <button
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-[rgba(0,0,0,0.6)] text-[#ff2d78] flex items-center justify-center text-xs hover:bg-[rgba(255,45,120,0.2)] transition-colors"
                @click="form.coverImage = ''">✕</button>
            </div>
            <label
              class="flex items-center justify-center gap-1.5 h-9 rounded-lg border border-dashed border-[rgba(0,240,255,0.2)] text-[#6b7280] text-sm cursor-pointer hover:border-[#00f0ff] hover:text-[#00f0ff] transition-all duration-300">
              <Upload class="w-3.5 h-3.5" />
              {{ form.coverImage ? '更换封面' : '上传封面' }}
              <input type="file" accept="image/*" class="hidden" @change="handleCoverUpload" />
            </label>
          </div>

          <div>
            <label
              class="flex items-center gap-1.5 text-xs font-semibold text-[#e0e0e8] mb-1.5 uppercase tracking-wider">
              <Tag class="w-3.5 h-3.5 text-[#00f0ff]" />
              标签
            </label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span v-for="tagId in form.tags" :key="tagId"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-all duration-200 hover:-translate-y-px"
                :style="{
                  color: getTagColor(tagId) || '#00f0ff',
                  backgroundColor: (getTagColor(tagId) || '#00f0ff') + '15',
                  borderColor: (getTagColor(tagId) || '#00f0ff') + '40',
                }" @click="toggleTag(tagId)">
                <span class="w-1.5 h-1.5 rounded-full opacity-70"
                  :style="{ backgroundColor: getTagColor(tagId) || '#00f0ff', boxShadow: `0 0 4px ${getTagColor(tagId) || '#00f0ff'}` }"></span>
                {{ getTagName(tagId) }}
                <span class="text-[10px] opacity-60">✕</span>
              </span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <button v-for="tag in availableTags" :key="tag.id"
                class="px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:-translate-y-px"
                :style="{
                  color: (tag.color || '#00f0ff') + 'aa',
                  borderColor: (tag.color || '#00f0ff') + '30',
                }" @click="toggleTag(tag.id)">
                + {{ tag.name }}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <button
        class="flex-shrink-0 w-8 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[rgba(0,240,255,0.06)]"
        style="background:rgba(14,14,20,0.4);border-left:1px solid rgba(0,240,255,0.08)" @click="metaOpen = !metaOpen">
        <ChevronLeft v-if="metaOpen" class="w-4 h-4 text-[#00f0ff]" />
        <ChevronRight v-else class="w-4 h-4 text-[#6b7280]" />
      </button>
    </div>

    <Teleport to="body">
      <div v-if="showRestoreDialog" class="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.7)]"
        style="backdrop-filter:blur(4px)">
        <div class="rounded-xl p-6 max-w-md w-full mx-4 border border-[rgba(0,240,255,0.2)]"
          style="background:rgba(17,17,24,0.95)">
          <h3 class="text-lg font-semibold text-white mb-3">发现未保存的草稿</h3>
          <p class="text-sm text-[#6b7280] mb-5">检测到上次编辑的未保存内容，是否恢复？</p>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 rounded-lg text-sm text-[#6b7280] border border-[rgba(0,240,255,0.15)] hover:text-[#e0e0e8] transition-colors"
              @click="discardRestore">放弃</button>
            <button
              class="px-4 py-2 rounded-lg text-sm font-semibold text-[#00f0ff] bg-[rgba(0,240,255,0.12)] border border-[#00f0ff] hover:bg-[rgba(0,240,255,0.2)] transition-all"
              @click="confirmRestore">恢复草稿</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Save, Send, Image, FolderOpen, Tag, Link, FileText, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Type, AlignLeft, Upload } from 'lucide-vue-next'
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
const categories = ref<Category[]>([])
const tags = ref<TagType[]>([])

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
      getTags({ size: 100 }) as any,
    ])
    if (catRes.status === 'fulfilled') categories.value = catRes.value.data?.records || []
    if (tagRes.status === 'fulfilled') tags.value = tagRes.value.data?.records || []

    await loadArticleForEdit()

    const hasDraft = await checkAndRestore()
    if (hasDraft) {
      showRestoreDialog.value = true
    }
  })
</script>