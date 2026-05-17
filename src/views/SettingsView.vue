<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { updateUser, uploadFile } from '@/api'
import type { FileUploadResult } from '@/api/file'
import { Save, Camera } from 'lucide-vue-next'

const authStore = useAuthStore()

const form = ref({
  nickname: authStore.userInfo?.nickname || '',
  email: authStore.userInfo?.email || '',
  avatar: authStore.userInfo?.avatar || '',
})
const loading = ref(false)
const uploadLoading = ref(false)

const handleAvatarChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadLoading.value = true
  try {
    const res = await uploadFile(file, 'avatar')
    const data = res.data as unknown as FileUploadResult
    form.value.avatar = data.url
  } catch (error) {
    console.error('上传头像失败', error)
  } finally {
    uploadLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!authStore.userInfo) return
  loading.value = true
  try {
    await updateUser({
      nickname: form.value.nickname,
      email: form.value.email,
      avatar: form.value.avatar,
    })
    await authStore.fetchUserInfo()
  } catch (error) {
    console.error('更新用户信息失败', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-bg-surface rounded-2xl card-shadow p-6 md:p-8">
    <h1 class="text-xl font-bold text-text-title mb-6">账号设置</h1>

    <div class="space-y-6">
      <!-- 头像 -->
      <div class="flex items-center gap-4">
        <div class="relative">
          <img
            :src="form.avatar || '/favicon.svg'"
            alt="头像"
            class="w-20 h-20 rounded-full object-cover border-2 border-border"
          />
          <label
            class="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full cursor-pointer hover:opacity-90"
          >
            <Camera class="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
            />
          </label>
        </div>
        <div>
          <p class="text-sm font-medium text-text-title">头像</p>
          <p class="text-xs text-text-meta">点击相机图标上传新头像</p>
        </div>
      </div>

      <!-- 昵称 -->
      <div>
        <label class="block text-sm font-medium text-text-title mb-1.5">昵称</label>
        <input
          v-model="form.nickname"
          type="text"
          class="w-full px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary"
        />
      </div>

      <!-- 邮箱 -->
      <div>
        <label class="block text-sm font-medium text-text-title mb-1.5">邮箱</label>
        <input
          v-model="form.email"
          type="email"
          class="w-full px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary"
        />
      </div>

      <!-- 保存按钮 -->
      <button
        class="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-none disabled:opacity-50 flex items-center gap-2"
        :disabled="loading"
        @click="handleSubmit"
      >
        <Save class="w-4 h-4" />
        {{ loading ? '保存中...' : '保存修改' }}
      </button>
    </div>
  </div>
</template>
