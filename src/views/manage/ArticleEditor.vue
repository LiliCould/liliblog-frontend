<template>
  <div class="editor-page page-container">
    <div class="page-header">
      <h1 class="page-title">{{ isEdit ? '编辑文章' : '写文章' }}</h1>
    </div>

    <div class="editor-layout">
      <div class="editor-main">
        <el-form ref="formRef" :model="form" :rules="formRules" label-position="top">
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入文章标题"
              size="large"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="Slug" prop="slug">
            <el-input v-model="form.slug" placeholder="文章URL标识（选填，如 my-first-post）" />
          </el-form-item>

          <el-form-item label="摘要" prop="summary">
            <el-input
              v-model="form.summary"
              type="textarea"
              placeholder="请输入文章摘要"
              :rows="3"
              maxlength="300"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="正文" prop="content">
            <MarkdownEditor
              v-model="form.content"
            />
          </el-form-item>
        </el-form>
      </div>

      <div class="editor-sidebar">
        <div class="sidebar-card">
          <h3 class="card-title">发布设置</h3>

          <div class="setting-item">
            <label class="setting-label">分类</label>
            <div class="selector-trigger" @click="showCategoryDialog = true">
              <span v-if="selectedCategoryName" class="selected-value">
                {{ selectedCategoryName }}
              </span>
              <span v-else class="placeholder">选择分类</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>

          <div class="setting-item">
            <label class="setting-label">标签</label>
            <div class="selector-trigger" @click="showTagDialog = true">
              <div class="tag-selected-list">
                <template v-if="selectedTagNames.length > 0">
                  <span v-for="name in selectedTagNames.slice(0, 3)" :key="name" class="tag-selected-item">
                    {{ name }}
                  </span>
                  <span v-if="selectedTagNames.length > 3" class="more-count">
                    +{{ selectedTagNames.length - 3 }}
                  </span>
                </template>
                <span v-else class="placeholder">选择标签</span>
              </div>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>

          <div class="setting-item">
            <label class="setting-label">封面图片</label>
            <div v-if="form.coverImage" class="cover-preview">
              <img :src="form.coverImage" :alt="form.title" class="cover-image" />
              <el-button size="small" type="danger" @click="form.coverImage = ''">
                移除
              </el-button>
            </div>
            <el-upload
              :auto-upload="true"
              :show-file-list="false"
              :http-request="handleCoverUpload"
              accept="image/*"
              style="margin-top: 8px;"
            >
              <el-button size="small" type="primary">
                {{ form.coverImage ? '更换封面' : '上传封面' }}
              </el-button>
            </el-upload>
          </div>

          <div class="setting-actions">
            <el-button @click="handleSave('DRAFT')" :loading="saving">
              保存草稿
            </el-button>
            <el-button type="primary" @click="handleSave('PUBLISHED')" :loading="saving">
              发布文章
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类选择弹窗 -->
    <el-dialog
      v-model="showCategoryDialog"
      title="选择分类"
      width="480px"
      :close-on-click-modal="true"
      append-to-body
    >
      <div class="category-grid">
        <div
          v-for="cat in appStore.categories"
          :key="cat.id"
          class="category-option"
          :class="{ active: form.categoryId === cat.id }"
          @click="form.categoryId = cat.id"
        >
          <el-icon><Folder /></el-icon>
          <span>{{ cat.name }}</span>
          <el-icon v-if="form.categoryId === cat.id" class="check-icon"><Check /></el-icon>
        </div>
        <div
          v-if="!appStore.categories || appStore.categories.length === 0"
          class="empty-hint"
        >
          暂无分类
        </div>
      </div>
    </el-dialog>

    <!-- 标签选择弹窗 -->
    <el-dialog
      v-model="showTagDialog"
      title="选择标签（可多选）"
      width="520px"
      :close-on-click-modal="true"
      append-to-body
    >
      <div class="tag-search">
        <el-input
          v-model="tagSearchKey"
          placeholder="搜索标签..."
          prefix-icon="Search"
          clearable
          size="default"
        />
      </div>
      <div class="tag-grid">
        <div
          v-for="tag in filteredTags"
          :key="tag.id"
          class="tag-option"
          :class="{ active: form.tagIds.includes(tag.id) }"
          :style="{ '--tag-color': tag.color }"
          @click="toggleTag(tag.id)"
        >
          <span class="tag-dot" :style="{ backgroundColor: tag.color || undefined }"></span>
          <span>{{ tag.name }}</span>
          <el-icon v-if="form.tagIds.includes(tag.id)" class="check-icon"><Check /></el-icon>
        </div>
        <div
          v-if="filteredTags.length === 0"
          class="empty-hint"
        >
          没有匹配的标签
        </div>
      </div>
      <div class="tag-dialog-footer">
        <span class="selected-info">已选 {{ form.tagIds.length }} 个标签</span>
        <el-button size="small" @click="form.tagIds = []">清空</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowRight, Folder, Check } from '@element-plus/icons-vue'
import type { FormInstance, UploadRequestOptions } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { getArticleById, createArticle, updateArticle } from '@/api/article'
import { uploadFile } from '@/api/file'
import MarkdownEditor from '@/components/article/MarkdownEditor.vue'
import { titleRules } from '@/utils/validate'
import type { ApiResponse } from '@/types/api.d'
import type { Article } from '@/types/article.d'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()
const formRef = ref<FormInstance>()
const saving = ref(false)

const showCategoryDialog = ref(false)
const showTagDialog = ref(false)
const tagSearchKey = ref('')

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  slug: '',
  summary: '',
  content: '',
  coverImage: '',
  categoryId: undefined as number | undefined,
  tagIds: [] as number[],
})

const formRules = {
  title: titleRules,
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
}

const selectedCategoryName = computed(() => {
  if (!form.categoryId) return ''
  const cat = appStore.categories.find(c => c.id === form.categoryId)
  return cat?.name || ''
})

const selectedTagNames = computed(() => {
  return appStore.tags
    .filter(t => form.tagIds.includes(t.id))
    .map(t => t.name)
})

const filteredTags = computed(() => {
  if (!tagSearchKey.value.trim()) {
    return appStore.tags
  }
  const key = tagSearchKey.value.toLowerCase().trim()
  return appStore.tags.filter(t =>
    t.name.toLowerCase().includes(key)
  )
})

function toggleTag(tagId: number) {
  const index = form.tagIds.indexOf(tagId)
  if (index > -1) {
    form.tagIds.splice(index, 1)
  } else {
    form.tagIds.push(tagId)
  }
}

async function handleCoverUpload(options: UploadRequestOptions) {
  try {
    const res = await uploadFile(options.file as File, 'cover') as unknown as ApiResponse<string>
    form.coverImage = res.message?.trim() || res.data
    ElMessage.success({ message: '封面上传成功', duration: 1500 })
  } catch {
    ElMessage.error({ message: '封面上传失败', duration: 1500 })
  }
}

async function handleSave(status: string) {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    ElMessage.warning({ message: '请完善必填项', duration: 1500 })
    return
  }

  saving.value = true
  try {
    const data = {
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      content: form.content,
      coverImage: form.coverImage || undefined,
      status,
      categoryId: form.categoryId || 0,
      tagIds: form.tagIds,
    }

    if (isEdit.value) {
      const id = Number(route.params.id)
      await updateArticle(id, userStore.username, { ...data, id })
      ElMessage.success({ message: '更新成功', duration: 1500 })
    } else {
      await createArticle(userStore.username, data)
      ElMessage.success({ message: status === 'PUBLISHED' ? '发布成功' : '草稿已保存', duration: 1500 })
    }
    router.push('/manage/articles')
  } catch {
    // error handled by interceptor
  } finally {
    saving.value = false
  }
}

async function loadArticleForEdit() {
  if (!isEdit.value) return
  const id = Number(route.params.id)
  try {
    const res = await getArticleById(id) as unknown as ApiResponse<Article>
    const article = res.data
    form.title = article.title
    form.slug = article.slug
    form.summary = article.summary
    form.content = article.content
    form.coverImage = article.coverImage
    form.categoryId = article.categoryId || undefined
    form.tagIds = article.tags?.map(t => t.id) || []
  } catch {
    ElMessage.error({ message: '加载文章失败', duration: 1500 })
    router.push('/manage/articles')
  }
}

onMounted(() => {
  loadArticleForEdit()
})
</script>

<style scoped>
.editor-page {
  padding-top: 24px;
  padding-bottom: 40px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-title);
}

.editor-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.editor-main {
  flex: 1;
  min-width: 0;
}

.editor-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.sidebar-card {
  background: var(--color-card);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 20px;
  position: sticky;
  top: calc(var(--header-height) + 20px);
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-title);
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.setting-item {
  margin-bottom: 16px;
}

.setting-label {
  display: block;
  font-size: 13px;
  color: var(--color-body);
  margin-bottom: 6px;
  font-weight: 500;
}

.selector-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--color-bg-warm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  min-height: 36px;
}

.selector-trigger:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-deep);
  box-shadow: var(--neon-glow-sm);
}

.selected-value {
  font-size: 14px;
  color: var(--color-title);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.placeholder {
  font-size: 14px;
  color: var(--color-muted);
}

.tag-selected-list {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.tag-selected-item {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 12px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: 1px solid var(--color-primary-light-2);
}

.more-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: var(--radius-full);
  font-size: 11px;
  background: var(--color-bg-warm);
  color: var(--color-muted);
  border: 1px solid var(--color-border);
}

.setting-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.setting-actions .el-button {
  flex: 1;
}

.cover-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: var(--color-bg-warm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.cover-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
}

.category-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  font-size: 13px;
  color: var(--color-body);
}

.category-option:hover {
  border-color: var(--color-primary-light-2);
  background: var(--color-primary-light);
}

.category-option.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
  box-shadow: var(--neon-glow-sm);
}

.category-option .check-icon {
  margin-left: auto;
  font-size: 14px;
}

.tag-search {
  margin-bottom: 14px;
}

.tag-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.tag-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  font-size: 13px;
  color: var(--color-body);
}

.tag-option:hover {
  border-color: var(--color-primary-light-2);
  background: var(--color-primary-light);
}

.tag-option.active {
  border-color: var(--tag-color, var(--color-primary));
  background: color-mix(in srgb, var(--tag-color, var(--color-primary)) 12%, var(--color-card-solid));
  color: var(--tag-color, var(--color-primary));
  box-shadow: 0 0 8px color-mix(in srgb, var(--tag-color, var(--color-primary)) 25%, transparent);
}

.tag-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tag-option .check-icon {
  margin-left: auto;
  font-size: 14px;
}

.tag-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.selected-info {
  font-size: 13px;
  color: var(--color-muted);
}

.empty-hint {
  grid-column: 1 / -1;
  text-align: center;
  padding: 32px 0;
  color: var(--color-muted);
  font-size: 14px;
}

@media (max-width: 1024px) {
  .editor-layout {
    flex-direction: column;
  }

  .editor-sidebar {
    width: 100%;
  }

  .sidebar-card {
    position: static;
  }

  .cover-image {
    width: 100px;
    height: 60px;
  }

  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>