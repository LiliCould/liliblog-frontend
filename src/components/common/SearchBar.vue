<template>
  <div class="search-bar">
    <el-input
      v-model="keyword"
      :placeholder="placeholder"
      :prefix-icon="Search"
      size="large"
      clearable
      @keyup.enter="handleSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

withDefaults(defineProps<{
  placeholder?: string
}>(), {
  placeholder: '搜索文章...',
})

const keyword = ref('')
const router = useRouter()

function handleSearch() {
  const kw = keyword.value.trim()
  if (kw) {
    router.push({ path: '/search', query: { keyword: kw } })
  }
}

defineExpose({ keyword })
</script>

<style scoped>
.search-bar {
  width: 100%;
  max-width: 560px;
}

.search-bar :deep(.el-input__wrapper) {
  border-radius: var(--radius-full);
  box-shadow: 0 0 0 1px var(--color-border);
  padding: 4px 16px;
  background: var(--color-card-solid);
  transition: box-shadow 0.3s ease;
}

.search-bar :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--color-border-hover);
}

.search-bar :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--color-primary), var(--neon-glow-sm);
}

.search-bar :deep(.el-input__inner) {
  color: var(--color-title);
}

.search-bar :deep(.el-input__inner::placeholder) {
  color: var(--color-body);
}

.search-bar :deep(.el-input__prefix .el-icon) {
  color: var(--color-body);
  transition: color 0.3s ease;
}

.search-bar :deep(.el-input__wrapper.is-focus .el-input__prefix .el-icon) {
  color: var(--color-primary);
}
</style>
