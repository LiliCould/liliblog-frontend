<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center" @click.self="$emit('close')">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div class="relative w-full max-w-md mx-4 rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-6 shadow-[0_0_24px_rgba(0,240,255,0.1)]">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white">修改密码</h2>
          <button
            class="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#e0e0e8] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200"
            @click="$emit('close')">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <input
              v-model="form.oldPassword"
              type="password"
              placeholder="旧密码"
              class="w-full h-11 pl-10 pr-4 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.1)]"
            />
          </div>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <input
              v-model="form.newPassword"
              type="password"
              placeholder="新密码"
              class="w-full h-11 pl-10 pr-4 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.1)]"
            />
          </div>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="确认新密码"
              class="w-full h-11 pl-10 pr-4 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.1)]"
            />
          </div>

          <p v-if="errorMsg" class="text-xs text-[#ff2d78]">{{ errorMsg }}</p>

          <div class="flex items-center gap-3 mt-2">
            <button
              type="submit"
              :disabled="submitting"
              class="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[rgba(0,240,255,0.12)] border border-[#00f0ff] text-[#00f0ff] font-semibold text-sm transition-all duration-300 hover:bg-[rgba(0,240,255,0.2)] hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save class="w-4 h-4" />
              {{ submitting ? '修改中...' : '确认修改' }}
            </button>
            <button
              type="button"
              class="h-11 px-6 rounded-lg border border-[rgba(0,240,255,0.15)] text-[#6b7280] text-sm font-medium transition-all duration-300 hover:text-[#e0e0e8] hover:border-[rgba(0,240,255,0.3)]"
              @click="$emit('close')">
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { X, Lock, Save } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { updateUser } from '@/api/user'
import { useToast } from '@/composables/useToast'

defineEmits<{ close: [] }>()

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const submitting = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  errorMsg.value = ''

  if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
    errorMsg.value = '请填写所有密码字段'
    return
  }
  if (form.newPassword !== form.confirmPassword) {
    errorMsg.value = '两次输入的新密码不一致'
    return
  }
  if (form.newPassword.length < 6) {
    errorMsg.value = '新密码长度不能少于6位'
    return
  }

  submitting.value = true
  try {
    await updateUser({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
    })
    toast.success('密码修改成功，请重新登录')
    userStore.logout()
    router.push('/login')
  } catch {
  } finally {
    submitting.value = false
  }
}
</script>
