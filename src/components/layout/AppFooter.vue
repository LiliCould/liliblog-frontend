<template>
  <footer class="mt-auto bg-t-bg relative border-t border-t-border">
    <div
      class="absolute -top-px left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-t-primary to-transparent opacity-60">
    </div>

    <div class="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10 pt-12 pb-6">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8 pb-8 border-b border-t-border relative">
        <div class="sm:col-span-2 lg:col-span-1 max-w-xs">
          <div class="flex items-center gap-2.5 mb-3">
            <Star class="w-6 h-6 text-t-primary [filter:drop-shadow(0_0_4px_rgba(var(--color-primary-rgb),0.4))]" />
            <span
              class="text-[22px] font-bold bg-gradient-to-br from-t-primary to-t-secondary bg-clip-text [-webkit-text-fill-color:transparent]">LiliBlog</span>
          </div>
          <p class="text-sm text-t-body leading-relaxed">记录生活，分享技术，探索无限可能</p>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-t-title uppercase tracking-wider mb-3">快速链接</h4>
          <nav class="flex flex-col gap-2">
            <router-link to="/"
              class="text-sm text-t-body no-underline w-fit relative transition-colors duration-200 hover:text-t-primary [text-shadow:0_0_8px_rgba(var(--color-primary-rgb),0.3)] after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-gradient-to-r after:from-t-primary after:to-t-secondary after:transition-[width] after:duration-300 hover:after:w-full">首页</router-link>
            <router-link to="/about"
              class="text-sm text-t-body no-underline w-fit relative transition-colors duration-200 hover:text-t-primary [text-shadow:0_0_8px_rgba(var(--color-primary-rgb),0.3)] after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-gradient-to-r after:from-t-primary after:to-t-secondary after:transition-[width] after:duration-300 hover:after:w-full">关于</router-link>
          </nav>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-t-title uppercase tracking-wider mb-3">联系方式</h4>
          <div class="flex flex-col gap-2">
            <a href="mailto:lilicould@qq.com"
              class="flex items-center gap-2.5 text-sm text-t-body no-underline py-1 transition-colors duration-200 hover:text-t-primary group">
              <Mail
                class="w-4 h-4 text-t-primary opacity-70 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 [filter:drop-shadow(0_0_4px_rgba(var(--color-primary-rgb),0.5))]" />
              <span>lilicould@qq.com</span>
            </a>
            <a href="https://github.com/lilicould" target="_blank" rel="noopener"
              class="flex items-center gap-2.5 text-sm text-t-body no-underline py-1 transition-colors duration-200 hover:text-t-primary group">
              <GithubIcon
                class="w-4 h-4 text-t-primary opacity-70 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 [filter:drop-shadow(0_0_4px_rgba(var(--color-primary-rgb),0.5))]" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-t-title uppercase tracking-wider mb-3">友情链接</h4>
          <nav class="flex flex-col gap-2">
            <a href="https://traums.cn/login" target="_blank" rel="noopener"
              class="text-sm text-t-body no-underline w-fit relative transition-colors duration-200 hover:text-t-primary [text-shadow:0_0_8px_rgba(var(--color-primary-rgb),0.3)] after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-gradient-to-r after:from-t-primary after:to-t-secondary after:transition-[width] after:duration-300 hover:after:w-full">TraumSpace</a>
          </nav>
        </div>
      </div>

      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-2 text-xs text-t-body-secondary">
          <span>© 2025-{{ currentYear }} LiliCould.</span>
          <span class="opacity-50">·</span>
          <span>All rights reserved.</span>
        </div>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener"
          class="text-xs text-t-body-secondary no-underline px-2 py-1 rounded-sm transition-colors duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)]">
          赣ICP备2025078204号-1
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { Star, Mail } from 'lucide-vue-next'

const GithubIcon = {
  name: 'GithubIcon',
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'currentColor',
    }, [
      h('path', {
        d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
      }),
    ])
  },
}

const currentYear = computed(() => new Date().getFullYear())
</script>
