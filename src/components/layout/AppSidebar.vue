<template>
  <aside class="hidden lg:flex flex-col gap-6 w-64 flex-shrink-0">
    <div class="bg-[rgba(20,20,35,0.85)] border border-[rgba(0,240,255,0.15)] rounded-lg p-5 transition-all duration-250 relative overflow-hidden hover:[box-shadow:0_8px_32px_rgba(0,240,255,0.1),0_0_1px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 hover:border-[rgba(0,240,255,0.3)] group"
      style="backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
    >
      <div class="absolute top-0 left-0 h-[3px] w-0 bg-gradient-to-r from-cyber-primary to-cyber-pink transition-[width] duration-400 [box-shadow:0_0_8px_rgba(0,240,255,0.4)] group-hover:w-full"></div>
      <div class="flex items-center gap-2.5 mb-3 pb-2 border-b border-[rgba(0,240,255,0.15)]">
        <FolderOpen class="w-5 h-5 text-cyber-primary [filter:drop-shadow(0_0_3px_rgba(0,240,255,0.3))]" />
        <h3 class="text-base font-semibold text-cyber-title m-0">分类</h3>
      </div>

      <div class="flex flex-col gap-0.5 max-h-80 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(0,240,255,0.15)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[rgba(0,240,255,0.3)]">
        <router-link
          v-for="cat in appStore.categories"
          :key="cat.id"
          :to="`/category/${cat.slug}`"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium text-cyber-body no-underline transition-all duration-250 relative hover:text-cyber-primary hover:bg-[rgba(0,240,255,0.06)] hover:translate-x-1 group/cat"
        >
          <span class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-gradient-to-b from-cyber-primary to-cyber-pink rounded-full transition-[height] duration-250 [box-shadow:0_0_6px_rgba(0,240,255,0.4)] group-hover/cat:h-3/5"></span>
          <span>{{ cat.name }}</span>
          <ChevronRight class="w-3.5 h-3.5 opacity-0 -translate-x-1 transition-all duration-250 group-hover/cat:opacity-100 group-hover/cat:translate-x-0" />
        </router-link>
        <div v-if="appStore.categories.length === 0" class="flex flex-col items-center gap-2 py-8 text-cyber-muted text-sm">
          <AlertCircle class="w-10 h-10 opacity-40" />
          <span>暂无分类</span>
        </div>
      </div>
    </div>

    <MyInfo />
  </aside>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { FolderOpen, ChevronRight, AlertCircle } from 'lucide-vue-next'
import MyInfo from '@/components/common/MyInfo.vue'

const appStore = useAppStore()
</script>
