<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  text: string
  speed?: number
}

const props = withDefaults(defineProps<Props>(), {
  speed: 100,
})

const displayedText = ref('')
const showCursor = ref(true)

onMounted(() => {
  let index = 0
  const interval = setInterval(() => {
    if (index < props.text.length) {
      displayedText.value += props.text[index]
      index++
    } else {
      clearInterval(interval)
    }
  }, props.speed)
})
</script>

<template>
  <span>
    {{ displayedText }}
    <span v-if="showCursor" class="typewriter-cursor" />
  </span>
</template>
