<script setup lang="ts">
interface Props {
  text: string
}

defineProps<Props>()
</script>

<template>
  <span class="glitch-text" :data-text="text">{{ text }}</span>
</template>
