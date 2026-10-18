<template>
  <AdminLayout>
    <slot />
  </AdminLayout>

  <ClientOnly>
    <Toaster position="top-center" :duration="2200" :rich-colors="true" class="liliblog-toaster" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>
