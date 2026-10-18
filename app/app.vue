<template>
  <NuxtLayout>
    <NuxtPage :transition="{ name: 'fade', mode: 'out-in' }" />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { initTheme } = useTheme()
const userStore = useUserStore()

onMounted(() => {
  initTheme()
  userStore.init()
})
</script>
