<template>
  <AppLayout :show-hero="false">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center gap-3 mb-6">
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-t-muted hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all duration-200"
          @click="router.back()">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <h1 class="text-2xl font-bold text-t-title">编辑资料</h1>
      </div>

      <div class="rounded-xl bg-t-surface border border-t-border p-6">
        <div class="flex items-center gap-6 mb-8">
          <div class="relative group">
            <div
              class="w-24 h-24 rounded-full bg-t-elevated border-2 border-[rgba(var(--color-primary-rgb),0.3)] flex items-center justify-center overflow-hidden">
              <img :src="resolveAvatar(avatarPreview || userStore.avatar)" alt="" class="w-full h-full object-cover"
                @error="handleAvatarError" />
            </div>
            <label
              class="absolute inset-0 rounded-full bg-[rgba(0,0,0,0.6)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera class="w-6 h-6 text-t-primary" />
              <input type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
            </label>
          </div>
          <div>
            <p class="text-sm text-t-body">点击头像更换</p>
            <p class="text-xs text-t-muted mt-1">支持 JPG、PNG 格式</p>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm text-t-body mb-2">昵称</label>
          <input v-model="nickname" type="text"
            class="w-full px-4 py-2.5 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-all duration-300 focus:border-t-primary focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.15)]"
            placeholder="输入昵称" />
        </div>

        <div class="flex items-center gap-3">
          <button
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[rgba(var(--color-primary-rgb),0.1)] border border-t-primary text-t-primary text-sm font-medium transition-all duration-300 hover:bg-[rgba(var(--color-primary-rgb),0.2)] hover:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.2)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="saving" @click="saveProfile">
            <Save class="w-4 h-4" />
            {{ saving ? '保存中...' : '保存修改' }}
          </button>
          <button
            class="px-5 py-2.5 rounded-lg border border-t-border text-t-muted text-sm font-medium transition-all duration-300 hover:text-t-body hover:border-[rgba(var(--color-primary-rgb),0.3)] cursor-pointer"
            @click="router.back()">
            取消
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Camera, Save } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { updateUser } from '@/api/user'
import { uploadFile } from '@/api/file'
import { resolveAvatar, handleAvatarError } from '@/utils/format'
import { useToast } from '@/composables/useToast'
import AppLayout from '@/components/layout/AppLayout.vue'
import type { ApiResponse } from '@/types/api'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

const nickname = ref(userStore.nickname)
const avatarPreview = ref('')
const avatarFile = ref<File | null>(null)
const saving = ref(false)

function handleAvatarChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const file = input.files[0]
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

async function saveProfile() {
  saving.value = true
  try {
    const data: Record<string, string> = {}
    let avatarUrl = userStore.avatar

    if (avatarFile.value) {
      const uploadRes = await uploadFile(avatarFile.value, 'avatar') as unknown as ApiResponse<string>
      avatarUrl = uploadRes.data
      data.avatar = avatarUrl
      userStore.updateAvatar(avatarUrl)
    }

    if (nickname.value.trim() && nickname.value !== userStore.nickname) {
      data.nickname = nickname.value.trim()
    }

    if (Object.keys(data).length > 0) {
      await updateUser(data)
      if (data.nickname) {
        userStore.updateNickname(data.nickname)
      }
      toast.success('个人资料已保存')
      router.back()
    } else {
      toast.success('没有修改')
      router.back()
    }
  } catch {
  } finally {
    saving.value = false
  }
}
</script>
