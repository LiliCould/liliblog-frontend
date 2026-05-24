<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthModal } from '@/composables/useAuthModal'

const router = useRouter()
const { open } = useAuthModal()

onMounted(() => {
  open('register')
  router.replace('/')
})
</script>
