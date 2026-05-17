<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api'
import { UserPlus } from 'lucide-vue-next'

const router = useRouter()

const form = ref({
  username: '',
  password: '',
  nickname: '',
  email: '',
})
const loading = ref(false)

const handleSubmit = async () => {
  if (!form.value.username || !form.value.password || !form.value.nickname) return
  loading.value = true
  try {
    await register(form.value)
    router.push('/login')
  } catch (error) {
    console.error('注册失败', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-bg-canvas px-4">
    <div class="w-full max-w-md bg-bg-surface rounded-2xl card-shadow p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-black text-text-title tracking-tight">注册新用户</h1>
        <p class="text-sm text-text-meta mt-2">创建一个新的管理员账号</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-text-title mb-1.5">用户名</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary"
            placeholder="请输入用户名"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-title mb-1.5">昵称</label>
          <input
            v-model="form.nickname"
            type="text"
            class="w-full px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary"
            placeholder="请输入昵称"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-title mb-1.5">邮箱</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary"
            placeholder="请输入邮箱（可选）"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-title mb-1.5">密码</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary"
            placeholder="请输入密码"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-none disabled:opacity-50 flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <UserPlus class="w-4 h-4" />
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>
    </div>
  </div>
</template>
