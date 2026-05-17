<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api'
import { isValidUsername, isValidEmail, isValidPassword } from '@/utils/validate'

/**
 * 注册页面
 * 需要管理员权限才能访问
 */
const router = useRouter()

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  nickname: '',
})

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const handleRegister = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  // 表单验证
  if (!isValidUsername(form.value.username)) {
    errorMsg.value = '用户名只能包含字母、数字、下划线，长度3-20位'
    return
  }
  if (!isValidPassword(form.value.password)) {
    errorMsg.value = '密码至少6位'
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    errorMsg.value = '两次输入的密码不一致'
    return
  }
  if (!isValidEmail(form.value.email)) {
    errorMsg.value = '请输入有效的邮箱地址'
    return
  }
  if (!form.value.nickname.trim()) {
    errorMsg.value = '请输入昵称'
    return
  }

  loading.value = true
  try {
    const res = await register({
      username: form.value.username,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword,
      email: form.value.email,
      nickname: form.value.nickname,
    })

    if (res.code === 0) {
      successMsg.value = '注册成功！'
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } else {
      errorMsg.value = res.msg || '注册失败'
    }
  } catch (error: unknown) {
    const err = error as { response?: { data?: { msg?: string } } }
    errorMsg.value = err.response?.data?.msg || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-[var(--neutral-50)] px-4 dark:bg-[var(--background)]"
  >
    <div
      class="w-full max-w-md border-2 border-black bg-white p-8 dark:border-[var(--neutral-800)] dark:bg-[var(--surface)]"
    >
      <h1 class="text-2xl font-black tracking-tight">
        注册新用户
      </h1>
      <p class="mt-1 font-mono text-sm text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
        管理员专用功能
      </p>

      <form
        class="mt-6 space-y-4"
        @submit.prevent="handleRegister"
      >
        <div>
          <label class="mb-1 block text-sm font-bold">用户名</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
            placeholder="3-20位字母、数字、下划线"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-bold">昵称</label>
          <input
            v-model="form.nickname"
            type="text"
            class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
            placeholder="请输入昵称"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-bold">邮箱</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
            placeholder="请输入邮箱"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-bold">密码</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
            placeholder="至少6位"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-bold">确认密码</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
            placeholder="再次输入密码"
          />
        </div>

        <!-- 错误提示 -->
        <p
          v-if="errorMsg"
          class="text-sm font-bold"
          :style="{ color: 'var(--accent-magenta)' }"
        >
          {{ errorMsg }}
        </p>

        <!-- 成功提示 -->
        <p
          v-if="successMsg"
          class="text-sm font-bold"
          :style="{ color: 'var(--accent-toxic)' }"
        >
          {{ successMsg }}
        </p>

        <button
          type="submit"
          class="w-full border-2 border-black py-2 text-sm font-bold transition-none hover:bg-[var(--accent-toxic)] hover:text-black dark:border-white"
          :disabled="loading"
        >
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <div class="mt-4 text-center">
        <router-link
          to="/"
          class="text-xs font-mono"
        >
          [返回首页]
        </router-link>
      </div>
    </div>
  </div>
</template>
