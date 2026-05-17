<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { updateUser } from '@/api'
import { uploadFile } from '@/api'

/**
 * 设置页面
 * 修改昵称、头像、密码
 */
const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  nickname: '',
  avatar: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const uploadLoading = ref(false)

onMounted(() => {
  if (authStore.userInfo) {
    form.value.nickname = authStore.userInfo.nickname || ''
    form.value.avatar = authStore.userInfo.avatar || ''
  }
})

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploadLoading.value = true
  try {
    const res = await uploadFile(file, 'avatar')
    if (res.code === 0) {
      form.value.avatar = res.data
    }
  } catch (error) {
    console.error('头像上传失败:', error)
  } finally {
    uploadLoading.value = false
  }
}

const handleSubmit = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  loading.value = true

  try {
    const data: Record<string, string> = {}

    // 修改密码
    if (form.value.newPassword) {
      if (form.value.newPassword !== form.value.confirmPassword) {
        errorMsg.value = '两次输入的密码不一致'
        return
      }
      data.oldPassword = form.value.oldPassword
      data.newPassword = form.value.newPassword
      data.confirmPassword = form.value.confirmPassword
    }

    // 修改昵称
    if (form.value.nickname) {
      data.nickname = form.value.nickname
    }

    // 修改头像
    if (form.value.avatar) {
      data.avatar = form.value.avatar
    }

    const res = await updateUser(data)
    if (res.code === 0) {
      successMsg.value = '保存成功！'
      // 刷新用户信息
      await authStore.fetchUserInfo()

      // 如果修改了密码，提示重新登录
      if (form.value.newPassword) {
        setTimeout(() => {
          authStore.logout()
          router.push('/login')
        }, 1500)
      }
    } else {
      errorMsg.value = res.msg || '保存失败'
    }
  } catch (error: unknown) {
    const err = error as { response?: { data?: { msg?: string } } }
    errorMsg.value = err.response?.data?.msg || '保存失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-black">
      账号设置
    </h1>

    <div
      class="border-2 border-black p-6 dark:border-[var(--neutral-800)]"
    >
      <form
        class="space-y-6"
        @submit.prevent="handleSubmit"
      >
        <!-- 头像 -->
        <div>
          <label class="mb-2 block text-sm font-bold">头像</label>
          <div class="flex items-center gap-4">
            <img
              :src="form.avatar || '/default-avatar.png'"
              alt="avatar"
              class="h-16 w-16 rounded-full border-2 border-black object-cover dark:border-white"
            />
            <label class="cursor-pointer border-2 border-black px-3 py-1 text-sm font-bold dark:border-white">
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarUpload"
              />
              {{ uploadLoading ? '上传中...' : '更换头像' }}
            </label>
          </div>
        </div>

        <!-- 昵称 -->
        <div>
          <label class="mb-1 block text-sm font-bold">昵称</label>
          <input
            v-model="form.nickname"
            type="text"
            class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
          />
        </div>

        <!-- 修改密码 -->
        <div class="border-t border-[var(--neutral-200)] pt-4 dark:border-[var(--neutral-800)]">
          <h3 class="text-sm font-bold">修改密码</h3>
          <div class="mt-3 space-y-3">
            <div>
              <label class="mb-1 block text-sm font-bold">旧密码</label>
              <input
                v-model="form.oldPassword"
                type="password"
                class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
                placeholder="请输入旧密码"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-bold">新密码</label>
              <input
                v-model="form.newPassword"
                type="password"
                class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
                placeholder="请输入新密码"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-bold">确认新密码</label>
              <input
                v-model="form.confirmPassword"
                type="password"
                class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
                placeholder="再次输入新密码"
              />
            </div>
          </div>
        </div>

        <!-- 提示信息 -->
        <p
          v-if="errorMsg"
          class="text-sm font-bold"
          :style="{ color: 'var(--accent-magenta)' }"
        >
          {{ errorMsg }}
        </p>
        <p
          v-if="successMsg"
          class="text-sm font-bold"
          :style="{ color: 'var(--accent-toxic)' }"
        >
          {{ successMsg }}
        </p>

        <!-- 保存按钮 -->
        <button
          type="submit"
          class="border-2 border-black px-6 py-2 text-sm font-bold transition-none hover:bg-[var(--accent-toxic)] hover:text-black dark:border-white"
          :disabled="loading"
        >
          {{ loading ? '保存中...' : '保存设置' }}
        </button>
      </form>
    </div>
  </div>
</template>
