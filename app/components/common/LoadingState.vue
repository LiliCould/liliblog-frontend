<template>
  <div v-if="variant === 'article'" class="card-glass space-y-5 p-6 md:p-8">
    <div class="skeleton h-8 w-3/4" />
    <div class="flex gap-3">
      <div class="skeleton h-8 w-8 rounded-full" />
      <div class="skeleton h-4 w-32" />
      <div class="skeleton h-4 w-24" />
    </div>
    <div class="skeleton aspect-[16/9] w-full" />
    <div class="space-y-3 pt-2">
      <div v-for="i in 6" :key="i" class="skeleton h-4" :class="i % 3 === 0 ? 'w-2/3' : 'w-full'" />
    </div>
  </div>

  <div v-else-if="variant === 'cards'" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="i in count" :key="i" class="card-glass p-5">
      <div class="flex items-center gap-3">
        <div class="skeleton h-10 w-10 rounded-control" />
        <div class="flex-1 space-y-2">
          <div class="skeleton h-4 w-3/4" />
          <div class="skeleton h-3 w-1/2" />
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col gap-4">
    <div v-for="i in count" :key="i" class="card-glass p-5">
      <div class="flex gap-5">
        <div class="flex-1 space-y-3">
          <div class="skeleton h-5 w-2/3" />
          <div class="skeleton h-3 w-full" />
          <div class="skeleton h-3 w-4/5" />
          <div class="flex gap-2 pt-2">
            <div class="skeleton h-5 w-16 rounded-full" />
            <div class="skeleton h-5 w-20 rounded-full" />
          </div>
        </div>
        <div class="skeleton hidden aspect-[4/3] w-[28%] md:block" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'list' | 'article' | 'cards'
  count?: number
}>(), {
  variant: 'list',
  count: 3,
})
</script>
