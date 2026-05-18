<template>
  <AppLayout>
    <div class="min-h-screen max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-white mb-8">用户设置</h1>

      <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-6 mb-6">
        <h2 class="text-lg font-semibold text-[#e0e0e8] mb-6">个人信息</h2>

        <div class="flex items-center gap-6 mb-6">
          <div class="relative group">
            <div class="w-20 h-20 rounded-full bg-[#1a1a24] border-2 border-[rgba(0,240,255,0.3)] flex items-center justify-center overflow-hidden">
              <img :src="resolveAvatar(avatarPreview || userStore.avatar)" alt="" class="w-full h-full object-cover" @error="handleAvatarError" />
            </div>
            <label class="absolute inset-0 rounded-full bg-[rgba(0,0,0,0.6)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera class="w-6 h-6 text-[#00f0ff]" />
              <input type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
            </label>
          </div>
          <div>
            <p class="text-sm text-[#6b7280]">点击头像更换</p>
            <p class="text-xs text-[#6b7280] mt-1">支持 JPG、PNG 格式</p>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm text-[#e0e0e8] mb-2">昵称</label>
          <input
            v-model="nickname"
            type="text"
            class="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.15)]"
          />
        </div>

        <button
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[rgba(0,240,255,0.1)] border border-[#00f0ff] text-[#00f0ff] text-sm font-medium transition-all duration-300 hover:bg-[rgba(0,240,255,0.2)] hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] cursor-pointer"
          :disabled="savingProfile"
          @click="saveProfile"
        >
          <Save class="w-4 h-4" />
          {{ savingProfile ? '保存中...' : '保存修改' }}
        </button>
      </div>

      <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-6">
        <h2 class="text-lg font-semibold text-[#e0e0e8] mb-6">修改密码</h2>

        <div class="mb-4">
          <label class="block text-sm text-[#e0e0e8] mb-2">旧密码</label>
          <input
            v-model="oldPassword"
            type="password"
            class="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.15)]"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-[#e0e0e8] mb-2">新密码</label>
          <input
            v-model="newPassword"
            type="password"
            class="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.15)]"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm text-[#e0e0e8] mb-2">确认密码</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.15)]"
          />
        </div>

        <button
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[rgba(255,45,120,0.1)] border border-[#ff2d78] text-[#ff2d78] text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,45,120,0.2)] hover:shadow-[0_0_12px_rgba(255,45,120,0.2)] cursor-pointer"
          :disabled="savingPassword"
          @click="changePassword"
        >
          <Lock class="w-4 h-4" />
          {{ savingPassword ? '修改中...' : '修改密码' }}
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Camera, Save, Lock } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { resolveAvatar, handleAvatarError } from '@/utils/format'
import { updateUser } from '@/api/user'
import { uploadFile } from '@/api/file'
import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import AppLayout from '@/components/layout/AppLayout.vue'

const userStore = useUserStore()

const nickname = ref(userStore.nickname)
const avatarPreview = ref('')
const avatarFile = ref<File | null>(null)
const savingProfile = ref(false)

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const savingPassword = ref(false)

function handleAvatarChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const file = input.files[0]
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

async function saveProfile() {
  savingProfile.value = true
  try {
    let avatarUrl = userStore.avatar
    if (avatarFile.value) {
      const uploadRes = await uploadFile(avatarFile.value, 'avatar') as unknown as ApiResponse<string>
      avatarUrl = uploadRes.data
      userStore.updateAvatar(avatarUrl)
    }
    if (nickname.value !== userStore.nickname) {
      await updateUser({ nickname: nickname.value, avatar: avatarUrl })
      userStore.updateNickname(nickname.value)
    } else if (avatarFile.value) {
      await updateUser({ avatar: avatarUrl })
    }
  } finally {
    savingProfile.value = false
  }
}

async function changePassword() {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) return
  if (newPassword.value !== confirmPassword.value) return
  savingPassword.value = true
  try {
    await request.put('/api/user/password', {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    })
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } finally {
    savingPassword.value = false
  }
}
</script>
