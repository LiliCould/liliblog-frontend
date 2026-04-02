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
              @html-changed="handleHtmlChanged"
            />
          </el-form-item>
        </el-form>
      </div>

      <div class="editor-sidebar">
        <div class="sidebar-card">
          <h3 class="card-title">发布设置</h3>

          <div class="setting-item">
            <label class="setting-label">分类</label>
            <el-select v-model="form.categoryId" placeholder="选择分类" style="width: 100%;">
              <el-option
                v-for="cat in appStore.categories"
                :key="cat.id"
                :label="cat.name"
                :value="cat.id"
              />
            </el-select>
          </div>

          <div class="setting-item">
            <label class="setting-label">标签</label>
            <el-select
              v-model="form.tagIds"
              multiple
              placeholder="选择标签"
              style="width: 100%;"
            >
              <el-option
                v-for="tag in appStore.tags"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id"
              />
            </el-select>
          </div>

          <div class="setting-item">
            <label class="setting-label">封面图片</label>
            <el-input v-model="form.coverImage" placeholder="输入封面图片URL" />
            <el-upload
              :auto-upload="true"
              :show-file-list="false"
              :http-request="handleCoverUpload"
              accept="image/*"
              style="margin-top: 8px;"
            >
              <el-button size="small">上传封面</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
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

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  slug: '',
  summary: '',
  content: '',
  contentHtml: '',
  coverImage: '',
  categoryId: undefined as number | undefined,
  tagIds: [] as number[],
})

const formRules = {
  title: titleRules,
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
}

function handleHtmlChanged(html: string) {
  form.contentHtml = html
}

async function handleCoverUpload(options: UploadRequestOptions) {
  try {
    const res = await uploadFile(options.file as File, 'cover') as unknown as ApiResponse<string>
    form.coverImage = res.data
    ElMessage.success('封面上传成功')
  } catch {
    ElMessage.error('封面上传失败')
  }
}

async function handleSave(status: string) {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    ElMessage.warning('请完善必填项')
    return
  }

  saving.value = true
  try {
    const data = {
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      content: form.content,
      contentHtml: form.contentHtml,
      coverImage: form.coverImage || undefined,
      status,
      categoryId: form.categoryId || 0,
      tagIds: form.tagIds,
    }

    if (isEdit.value) {
      const id = Number(route.params.id)
      await updateArticle(id, userStore.username, { ...data, id })
      ElMessage.success('更新成功')
    } else {
      await createArticle(userStore.username, data)
      ElMessage.success(status === 'PUBLISHED' ? '发布成功' : '草稿已保存')
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
    form.contentHtml = article.contentHtml
    form.coverImage = article.coverImage
    form.categoryId = article.categoryId || undefined
    form.tagIds = article.tags?.map(t => t.id) || []
  } catch {
    ElMessage.error('加载文章失败')
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
}
</style>
