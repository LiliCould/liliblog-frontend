<template>
  <div class="article-meta">
    <span class="meta-item" v-if="article.authorNickname">
      <el-icon>
        <User />
      </el-icon>
      {{ article.authorNickname }}
    </span>
    <span class="meta-item" v-if="article.categoryName">
      <el-icon>
        <Folder />
      </el-icon>
      {{ article.categoryName }}
    </span>
    <span class="meta-item">
      <el-icon>
        <Calendar />
      </el-icon>
      {{ formatDateTime(article.publishTime || article.createTime) }}
    </span>
    <span class="meta-item">
      <el-icon>
        <View />
      </el-icon>
      {{ formatNumber(article.viewCount) }} 阅读
    </span>
    <span class="meta-item">
      <el-icon>
        <ChatDotRound />
      </el-icon>
      {{ article.commentCount }} 评论
    </span>
  </div>
</template>

<script setup lang="ts">
import { User, Folder, Calendar, View, ChatDotRound } from '@element-plus/icons-vue'
import type { Article } from '@/types/article.d'
import { formatDateTime, formatNumber } from '@/utils/format'

defineProps<{
  article: Article
}>()
</script>

<style scoped>
.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--color-body);
  transition: color 0.3s ease;
}

.meta-item :deep(.el-icon) {
  color: var(--color-primary);
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.meta-item:hover {
  color: var(--color-primary);
}

.meta-item:hover :deep(.el-icon) {
  opacity: 1;
}
</style>
