<template>
  <div class="article-card" @click="goDetail">
    <div class="card-content">
      <div class="card-header">
        <span v-if="article.isTop" class="badge badge-top">置顶</span>
        <span v-if="article.isRecommend" class="badge badge-recommend">推荐</span>
      </div>

      <h2 class="card-title">{{ article.title }}</h2>

      <p v-if="article.summary" class="card-summary">{{ article.summary }}</p>

      <div class="card-meta">
        <span class="meta-item">
          <el-icon><User /></el-icon>
          {{ article.authorNickname }}
        </span>
        <span v-if="article.categoryName" class="meta-item">
          <el-icon><Folder /></el-icon>
          {{ article.categoryName }}
        </span>
        <span class="meta-item">
          <el-icon><Calendar /></el-icon>
          {{ formatRelativeTime(article.publishTime || article.createTime) }}
        </span>
        <span class="meta-item">
          <el-icon><View /></el-icon>
          {{ formatNumber(article.viewCount) }}
        </span>
      </div>

      <div v-if="article.tags && article.tags.length > 0" class="card-tags">
        <TagBadge v-for="tag in article.tags" :key="tag.id" :tag="tag" />
      </div>
    </div>

    <div v-if="article.coverImage" class="card-cover">
      <img :src="article.coverImage" :alt="article.title" loading="lazy" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { User, Folder, Calendar, View } from '@element-plus/icons-vue'
import type { Article } from '@/types/article.d'
import { formatRelativeTime, formatNumber } from '@/utils/format'
import TagBadge from './TagBadge.vue'

const props = defineProps<{
  article: Article
}>()

const router = useRouter()

function goDetail() {
  if (props.article.slug) {
    router.push(`/article/s/${props.article.slug}`)
  } else {
    router.push(`/article/${props.article.id}`)
  }
}
</script>

<style scoped>
.article-card {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.article-card:hover {
  box-shadow: 0 8px 24px rgba(232, 97, 60, 0.12);
  border-color: rgba(232, 97, 60, 0.2);
  transform: translateY(-4px);
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-header {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.card-header:empty {
  display: none;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.badge-top {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.badge-recommend {
  background: #FEF3E0;
  color: var(--color-accent);
}

.card-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-title);
  line-height: 1.5;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card:hover .card-title {
  color: var(--color-primary);
}

.card-summary {
  font-size: 13px;
  color: var(--color-body);
  line-height: 1.7;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-muted);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.card-cover {
  flex-shrink: 0;
  width: 180px;
  height: 120px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-card:hover .card-cover img {
  transform: scale(1.05);
}

@media (max-width: 640px) {
  .article-card {
    flex-direction: column-reverse;
    padding: 16px;
  }

  .card-cover {
    width: 100%;
    height: 160px;
  }
}
</style>
