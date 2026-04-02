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
}

.search-bar :deep(.el-input__wrapper:hover),
.search-bar :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--color-primary);
}
</style>
