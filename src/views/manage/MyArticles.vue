<template>
  <div class="my-articles-page page-container">
    <div class="page-header">
      <h1 class="page-title">我的文章</h1>
      <el-button type="primary" @click="router.push('/manage/editor')">
        <el-icon>
          <Plus />
        </el-icon>
        写文章
      </el-button>
    </div>

    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="已发布" name="PUBLISHED" />
      <el-tab-pane label="草稿" name="DRAFT" />
    </el-tabs>

    <div class="articles-list">
      <template v-if="loading">
        <div v-for="i in 3" :key="i" class="skeleton-card">
          <el-skeleton :rows="2" animated />
        </div>
      </template>

      <template v-else-if="filteredArticles.length > 0">
        <div v-for="article in filteredArticles" :key="article.id" class="article-item">
          <div class="item-content">
            <h3 class="item-title" @click="viewArticle(article)">{{ article.title }}</h3>
            <p class="item-summary">{{ article.summary || '暂无摘要' }}</p>
            <div class="item-meta">
              <span class="meta-status" :class="article.status.toLowerCase()">
                {{ statusText(article.status) }}
              </span>
              <span class="meta-date">{{ formatRelativeTime(article.updateTime || article.createTime) }}</span>
              <span class="meta-view">{{ article.viewCount }} 阅读</span>
            </div>
          </div>
          <div class="item-actions">
            <el-button text type="primary" @click="editArticle(article.id)">
              <el-icon>
                <Edit />
              </el-icon>
              编辑
            </el-button>
            <el-button text type="danger" @click="confirmDelete(article)">
              <el-icon>
                <Delete />
              </el-icon>
              删除
            </el-button>
          </div>
        </div>
      </template>

      <template v-else>
        <EmptyState :text="activeTab === 'PUBLISHED' ? '还没有发布的文章' : '还没有草稿'">
          <el-button type="primary" style="margin-top: 16px;" @click="router.push('/manage/editor')">
            开始写作
          </el-button>
        </EmptyState>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useArticleStore } from '@/stores/article'
import { useUserStore } from '@/stores/user'
import { deleteArticle } from '@/api/article'
import EmptyState from '@/components/common/EmptyState.vue'
import { formatRelativeTime } from '@/utils/format'
import type { Article } from '@/types/article.d'

const router = useRouter()
const articleStore = useArticleStore()
const userStore = useUserStore()
const activeTab = ref('PUBLISHED')
const loading = ref(false)

const filteredArticles = computed(() => {
  return articleStore.myList.filter(a => a.status === activeTab.value)
})

function statusText(status: string) {
  const map: Record<string, string> = {
    DRAFT: '草稿',
    PUBLISHED: '已发布',
    HIDDEN: '隐藏',
  }
  return map[status] || status
}

async function loadArticles() {
  loading.value = true
  try {
    await articleStore.fetchMyArticles()
  } finally {
    loading.value = false
  }
}

function handleTabChange() {
  // filteredArticles is computed, no need to reload
}

function viewArticle(article: Article) {
  if (article.slug) {
    router.push(`/article/s/${article.slug}`)
  } else {
    router.push(`/article/${article.id}`)
  }
}

function editArticle(id: number) {
  router.push(`/manage/editor/${id}`)
}

async function confirmDelete(article: Article) {
  try {
    await ElMessageBox.confirm(
      `确定要删除文章「${article.title}」吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )
    await deleteArticle(article.id, userStore.username)
    ElMessage.success({ message: '删除成功', duration: 1500 })
    await loadArticles()
  } catch {
    // cancelled or error
  }
}

onMounted(loadArticles)
</script>

<style scoped>
.my-articles-page {
  padding-top: 24px;
  padding-bottom: 40px;
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-title);
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.skeleton-card {
  background: var(--color-card);
  padding: 20px 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: 8px;
}

.article-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: 8px;
  transition: all 0.2s;
}

.article-item:hover {
  box-shadow: var(--shadow-sm), var(--neon-glow-sm);
  border-color: var(--color-border-hover);
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-title);
  margin-bottom: 6px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color var(--transition-fast);
}

.item-title:hover {
  color: var(--color-primary);
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.3);
}

.item-summary {
  font-size: 13px;
  color: var(--color-muted);
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--color-muted);
}

.meta-status {
  padding: 1px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 500;
}

.meta-status.published {
  background: rgba(0, 240, 255, 0.1);
  color: var(--color-primary);
  border: 1px solid var(--color-primary-light-2);
}

.meta-status.draft {
  background: rgba(255, 170, 0, 0.1);
  color: var(--color-warning);
  border: 1px solid rgba(255, 170, 0, 0.2);
}

.meta-status.hidden {
  background: var(--color-bg-warm);
  color: var(--color-muted);
  border: 1px solid var(--color-border);
}

.item-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

:deep(.el-tabs__item) {
  color: var(--color-body);
  font-weight: 500;
}

:deep(.el-tabs__item.is-active) {
  color: var(--color-primary);
}

:deep(.el-tabs__active-bar) {
  background-color: var(--color-primary);
  box-shadow: var(--neon-glow-sm);
}

:deep(.el-tabs__item:hover) {
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .article-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-actions {
    align-self: flex-end;
  }
}
</style>
