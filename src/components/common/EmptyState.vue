<template>
  <div class="empty-state">
    <div class="empty-icon">
      <el-icon :size="48"><DocumentRemove /></el-icon>
    </div>
    <p class="empty-text">{{ text }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { DocumentRemove } from '@element-plus/icons-vue'

withDefaults(defineProps<{
  text?: string
}>(), {
  text: '暂无数据',
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
}

.empty-icon {
  color: var(--color-border);
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: var(--color-muted);
}
</style>
