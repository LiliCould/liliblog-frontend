<template>
  <aside class="app-sidebar">
    <div class="sidebar-section">
      <h3 class="sidebar-title">分类</h3>
      <div class="category-list">
        <div
          v-for="cat in appStore.categories"
          :key="cat.id"
          class="category-item"
        >
          <span class="category-name">{{ cat.name }}</span>
        </div>
        <div v-if="appStore.categories.length === 0" class="empty-hint">暂无分类</div>
      </div>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-title">标签</h3>
      <div class="tag-cloud">
        <TagBadge v-for="tag in appStore.tags" :key="tag.id" :tag="tag" />
        <div v-if="appStore.tags.length === 0" class="empty-hint">暂无标签</div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import TagBadge from '@/components/common/TagBadge.vue'

const appStore = useAppStore()
</script>

<style scoped>
.app-sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
}

.sidebar-section {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.sidebar-section:hover {
  box-shadow: 0 4px 16px rgba(232, 97, 60, 0.08);
}

.sidebar-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-title);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-primary);
  display: inline-block;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary-light) var(--color-bg);
}

.category-list::-webkit-scrollbar {
  width: 6px;
}

.category-list::-webkit-scrollbar-track {
  background: var(--color-bg);
  border-radius: 3px;
}

.category-list::-webkit-scrollbar-thumb {
  background: var(--color-primary-light);
  border-radius: 3px;
}

.category-list::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.category-item:hover {
  background: var(--color-primary-light);
}

.category-name {
  font-size: 13px;
  color: var(--color-body);
}

.category-item:hover .category-name {
  color: var(--color-primary);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary-light) var(--color-bg);
}

.tag-cloud::-webkit-scrollbar {
  width: 6px;
}

.tag-cloud::-webkit-scrollbar-track {
  background: var(--color-bg);
  border-radius: 3px;
}

.tag-cloud::-webkit-scrollbar-thumb {
  background: var(--color-primary-light);
  border-radius: 3px;
}

.tag-cloud::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

.empty-hint {
  font-size: 13px;
  color: var(--color-muted);
  text-align: center;
  padding: 8px 0;
}

@media (max-width: 1024px) {
  .app-sidebar {
    display: none;
  }
}
</style>