<template>
  <aside class="app-sidebar">
    <div class="sidebar-section category-section">
      <div class="section-header">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        <h3 class="section-title">分类</h3>
      </div>
      <div class="category-list">
        <router-link v-for="cat in appStore.categories" :key="cat.id" :to="`/category/${cat.id}`" class="category-item">
          <span class="category-name">{{ cat.name }}</span>
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </router-link>
        <div v-if="appStore.categories.length === 0" class="empty-hint">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>暂无分类</span>
        </div>
      </div>
    </div>

    <div class="sidebar-section tag-section">
      <div class="section-header">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
        <h3 class="section-title">标签</h3>
      </div>
      <div class="tag-cloud">
        <TagBadge v-for="tag in appStore.tags" :key="tag.id" :tag="tag" />
        <div v-if="appStore.tags.length === 0" class="empty-hint">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>暂无标签</span>
        </div>
      </div>
    </div>

    <div class="sidebar-section stats-section">
      <div class="section-header">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        <h3 class="section-title">统计</h3>
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">{{ appStore.categories.length }}</span>
          <span class="stat-label">分类</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ appStore.tags.length }}</span>
          <span class="stat-label">标签</span>
        </div>
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.sidebar-section {
  background: var(--color-card);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.sidebar-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  opacity: 0;
  transition: opacity var(--transition-base);
}

.sidebar-section:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
  border-color: var(--color-border-hover);
}

.sidebar-section:hover::before {
  opacity: 1;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.section-title {
  font-family: var(--font-body);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-title);
  margin: 0;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.category-list::-webkit-scrollbar {
  width: 5px;
}

.category-list::-webkit-scrollbar-track {
  background: transparent;
}

.category-list::-webkit-scrollbar-thumb {
  background: var(--color-primary-light-2);
  border-radius: var(--radius-full);
}

.category-list::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-glow);
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  color: var(--color-body-light);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  position: relative;
}

.category-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: linear-gradient(180deg, var(--color-primary), var(--color-accent));
  border-radius: var(--radius-full);
  transition: height var(--transition-base);
}

.category-item .arrow-icon {
  width: 14px;
  height: 14px;
  opacity: 0;
  transform: translateX(-4px);
  transition: all var(--transition-fast);
}

.category-item:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding-left: 18px;
}

.category-item:hover::before {
  height: 60%;
}

.category-item:hover .arrow-icon {
  opacity: 1;
  transform: translateX(0);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
  padding: 4px;
}

.tag-cloud::-webkit-scrollbar {
  width: 5px;
}

.tag-cloud::-webkit-scrollbar-track {
  background: transparent;
}

.tag-cloud::-webkit-scrollbar-thumb {
  background: var(--color-primary-light-2);
  border-radius: var(--radius-full);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--spacing-md) var(--spacing-sm);
  background: var(--color-bg-warm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.stat-item:hover {
  background: var(--color-primary-light);
  transform: scale(1.05);
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-display);
  color: var(--color-primary);
  line-height: 1;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: var(--font-weight-medium);
}

.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xl) 0;
  color: var(--color-muted);
  font-size: var(--font-size-sm);
}

.empty-hint svg {
  width: 40px;
  height: 40px;
  opacity: 0.4;
}

@media (max-width: 1024px) {
  .app-sidebar {
    display: none;
  }
}
</style>
