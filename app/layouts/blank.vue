<template>
  <div class="min-h-screen bg-t-bg text-t-body">
    <slot />
    <ClientOnly>
      <Toaster position="top-center" :duration="2200" :rich-colors="true" class="liliblog-toaster" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>
