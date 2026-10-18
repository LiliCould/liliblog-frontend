<template>
  <DialogRoot :open="isOpen" @update:open="onOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-[var(--z-modal)] bg-[var(--color-scrim)] backdrop-blur-sm" />

      <DialogContent
        class="panel-glass fixed left-1/2 top-1/2 z-[var(--z-modal)] w-full max-w-[380px] -translate-x-1/2 -translate-y-1/2 overflow-hidden focus:outline-none max-md:max-h-[90dvh] max-md:max-w-[calc(100vw-1rem)] max-md:overflow-y-auto"
      >
        <DialogTitle class="sr-only">登录立里博客</DialogTitle>
        <DialogDescription class="sr-only">使用用户名密码或邮箱验证码登录</DialogDescription>

        <button
          class="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center text-t-muted hover:text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all cursor-pointer"
          aria-label="关闭登录弹窗"
          @click="close"
        >
          <X class="w-4 h-4" />
        </button>

        <div class="px-6 pt-7 pb-0">
          <AuthPanel
            :initial-view="mode || 'login'"
            :allow-register="false"
            embedded
            @success="handleSuccess"
          />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { X } from 'lucide-vue-next'

const route = useRoute()
const { mode, isOpen, close } = useAuthModal()

function onOpenChange(value: boolean): void {
  if (!value) close()
}

async function handleSuccess(): Promise<void> {
  close()
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/')) {
    await navigateTo(redirect)
  }
}
</script>
