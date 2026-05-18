<template>
  <AppLayout :show-hero="false">
    <div class="max-w-2xl mx-auto flex flex-col gap-6">
      <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
        <h2 class="text-lg font-semibold text-white mb-5 pb-3 border-b border-[rgba(0,240,255,0.15)]">个人信息</h2>

        <div v-if="profile" class="flex gap-6 items-start">
          <div class="relative shrink-0">
            <img
              v-if="profile.avatar"
              :src="profile.avatar"
              :alt="profile.nickname"
              class="w-20 h-20 rounded-full object-cover border-2 border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]"
            />
            <div
              v-else
              class="w-20 h-20 rounded-full bg-[#1a1a24] border-2 border-[rgba(0,240,255,0.2)] flex items-center justify-center text-2xl text-[#00f0ff] font-bold"
            >
              {{ profile.nickname?.charAt(0) || 'U' }}
            </div>
            <label class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[rgba(0,240,255,0.12)] border border-[rgba(0,240,255,0.3)] flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[rgba(0,240,255,0.2)] hover:shadow-[0_0_8px_rgba(0,240,255,0.15)]">
              <Camera class="w-3.5 h-3.5 text-[#00f0ff]" />
              <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
            </label>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 py-3 border-b border-[rgba(0,240,255,0.08)]">
              <span class="w-16 text-sm text-[#6b7280] shrink-0">用户名</span>
              <span class="text-sm text-[#e0e0e8]">{{ profile.username }}</span>
            </div>
            <div class="flex items-center gap-3 py-3 border-b border-[rgba(0,240,255,0.08)]">
              <span class="w-16 text-sm text-[#6b7280] shrink-0">昵称</span>
              <div v-if="editingNickname" class="flex items-center gap-2 flex-1">
                <input
                  v-model="editNickname"
                  class="flex-1 h-8 px-3 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm outline-none focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.1)]"
                  @keyup.enter="saveNickname"
                  @blur="saveNickname"
                />
              </div>
              <div v-else class="flex items-center gap-2 flex-1">
                <span class="text-sm text-[#e0e0e8]">{{ profile.nickname }}</span>
                <button class="text-[#6b7280] hover:text-[#00f0ff] transition-colors duration-200" @click="startEditNickname">
                  <PenLine class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        <div v-else class="flex flex-col gap-3">
          <div class="h-10 rounded bg-[#1a1a24] animate-pulse"></div>
          <div class="h-10 rounded bg-[#1a1a24] animate-pulse"></div>
        </div>
      </div>

      <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
        <h2 class="text-lg font-semibold text-white mb-5 pb-3 border-b border-[rgba(0,240,255,0.15)]">修改密码</h2>

        <form class="max-w-sm flex flex-col gap-4" @submit.prevent="handleChangePassword">
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <input
              v-model="passwordForm.oldPassword"
              type="password"
              placeholder="旧密码"
              class="w-full h-11 pl-10 pr-4 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.1)]"
            />
          </div>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="新密码"
              class="w-full h-11 pl-10 pr-4 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.1)]"
            />
          </div>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="确认新密码"
              class="w-full h-11 pl-10 pr-4 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.1)]"
            />
          </div>
          <button
            type="submit"
            :disabled="changingPassword"
            class="flex items-center justify-center gap-2 h-11 rounded-lg bg-[rgba(0,240,255,0.12)] border border-[#00f0ff] text-[#00f0ff] font-semibold text-sm transition-all duration-300 hover:bg-[rgba(0,240,255,0.2)] hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save class="w-4 h-4" />
            {{ changingPassword ? '修改中...' : '修改密码' }}
          </button>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Camera, Save, Lock } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { getCurrentUser, updateUser } from '@/api/user'
import { uploadFile } from '@/api/file'
import AppLayout from '@/components/layout/AppLayout.vue'
import type { User as UserType } from '@/types/user'

const router = useRouter()
const userStore = useUserStore()
const profile = ref<UserType | null>(null)
const editingNickname = ref(false)
const editNickname = ref('')
const changingPassword = ref(false)

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

onMounted(async () => {
  try {
    const res = await getCurrentUser() as any
    profile.value = res.data || null
  } catch {
    // handled by interceptor
  }
})

async function handleAvatarUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  try {
    const res = await uploadFile(file, 'avatar') as any
    const avatarUrl = res.message?.trim() || res.data
    if (avatarUrl) {
      if (profile.value) profile.value.avatar = avatarUrl
      userStore.updateAvatar(avatarUrl)
      await updateUser({ avatar: avatarUrl })
    }
  } catch {
    // handled by interceptor
  }
  target.value = ''
}

function startEditNickname() {
  if (profile.value) {
    editNickname.value = profile.value.nickname
    editingNickname.value = true
  }
}

async function saveNickname() {
  if (!editNickname.value.trim()) {
    editingNickname.value = false
    return
  }
  try {
    await updateUser({ nickname: editNickname.value })
    userStore.updateNickname(editNickname.value)
    if (profile.value) profile.value.nickname = editNickname.value
  } catch {
    // handled by interceptor
  } finally {
    editingNickname.value = false
  }
}

async function handleChangePassword() {
  if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) return
  if (passwordForm.newPassword !== passwordForm.confirmPassword) return
  changingPassword.value = true
  try {
    await updateUser({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    } as any)
    userStore.logout()
    router.push('/login')
  } catch {
    // handled by interceptor
  } finally {
    changingPassword.value = false
  }
}
</script>
