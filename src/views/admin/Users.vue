<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-t-title">用户管理</h2>
      <button
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-t-primary hover:opacity-90 transition-all cursor-pointer"
        @click="openCreateDialog">
        <Plus class="w-4 h-4" />
        添加用户
      </button>
    </div>

    <div class="rounded-xl bg-t-surface border border-t-border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-t-border">
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">用户</th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">角色</th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">状态</th>
              <th class="text-left px-5 py-3.5 text-t-muted font-medium">上次登录</th>
              <th class="text-right px-5 py-3.5 text-t-muted font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id"
              class="border-b border-[rgba(var(--color-primary-rgb),0.08)] transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.03)]">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full bg-t-elevated border border-t-border flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img :src="resolveAvatar(user.avatar)" alt="" class="w-full h-full object-cover"
                      @error="handleAvatarError" />
                  </div>
                  <div>
                    <p class="text-t-body font-medium">{{ user.nickname }}</p>
                    <p class="text-xs text-t-muted">@{{ user.username }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="user.role === 0
                  ? 'bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary border border-[rgba(var(--color-primary-rgb),0.3)]'
                  : 'bg-t-elevated text-t-muted border border-t-border'">
                  {{ user.role === 0 ? '管理员' : '用户' }}
                </span>
              </td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <button
                    class="relative w-9 h-5 rounded-full transition-colors duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-t-primary focus-visible:ring-offset-1"
                    :class="toggleLoadingMap[user.id] ? 'opacity-60 cursor-wait' : ''"
                    :style="{
                      backgroundColor: user.status === 1 ? 'var(--color-primary)' : 'var(--color-border-solid)',
                    }"
                    :aria-label="user.status === 1 ? '点击禁用用户' : '点击启用用户'"
                    :disabled="toggleLoadingMap[user.id]"
                    @click="toggleUserStatus(user)">
                    <span
                      class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300"
                      :style="{
                        left: user.status === 1 ? '18px' : '2px',
                      }"></span>
                  </button>
                  <span class="text-xs font-medium transition-colors duration-300"
                    :class="user.status === 1 ? 'text-[#4ade80]' : 'text-[#f43f5e]'">
                    {{ user.status === 1 ? '启用' : '禁用' }}
                  </span>
                </div>
              </td>
              <td class="px-5 py-3.5 text-t-muted">
                {{ user.lastLoginTime ? formatRelativeTime(user.lastLoginTime) : '从未登录' }}
              </td>
              <td class="px-5 py-3.5">
                <div class="flex items-center justify-end gap-1">
                  <button
                    class="p-1.5 rounded-lg text-t-muted transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.1)] cursor-pointer"
                    title="编辑" @click="openEditDialog(user)">
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    class="p-1.5 rounded-lg text-t-muted transition-all duration-200 hover:text-[#f43f5e] hover:bg-[rgba(244,63,94,0.1)] cursor-pointer"
                    title="删除" @click="handleDelete(user)">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="users.length === 0 && !loading" class="text-center py-12 text-t-muted text-sm">
        暂无用户
      </div>

      <div v-if="total > pageSize" class="flex items-center justify-between px-5 py-3 border-t border-t-border">
        <span class="text-xs text-t-muted">共 {{ total }} 条</span>
        <div class="flex items-center gap-1">
          <button
            class="px-3 py-1.5 rounded text-xs transition-colors duration-200 cursor-pointer"
            :class="current > 1 ? 'text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.1)]' : 'text-t-muted cursor-not-allowed'"
            :disabled="current <= 1" @click="loadUsers(current - 1)">
            上一页
          </button>
          <button v-for="p in displayPages" :key="p" class="px-3 py-1.5 rounded text-xs transition-colors duration-200 cursor-pointer"
            :class="p === current ? 'bg-t-primary text-white' : 'text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.1)]'"
            @click="loadUsers(p)">
            {{ p }}
          </button>
          <button
            class="px-3 py-1.5 rounded text-xs transition-colors duration-200 cursor-pointer"
            :class="current < totalPages ? 'text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.1)]' : 'text-t-muted cursor-not-allowed'"
            :disabled="current >= totalPages" @click="loadUsers(current + 1)">
            下一页
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showDialog" class="fixed inset-0 z-[1200] flex items-center justify-center" @click.self="showDialog = false">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-md mx-4 rounded-xl bg-t-surface border border-t-border p-6 shadow-[0_0_24px_rgba(var(--color-primary-rgb),0.1)]">
          <h3 class="text-base font-semibold text-t-title mb-5">{{ isEditing ? '编辑用户' : '添加用户' }}</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm text-t-body mb-1.5">用户名</label>
              <input v-model="form.username" type="text" :disabled="isEditing"
                class="w-full px-3 py-2 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="请输入用户名" />
            </div>
            <div>
              <label class="block text-sm text-t-body mb-1.5">昵称</label>
              <input v-model="form.nickname" type="text"
                class="w-full px-3 py-2 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
                placeholder="请输入昵称" />
            </div>
            <div>
              <label class="block text-sm text-t-body mb-1.5">邮箱</label>
              <input v-model="form.email" type="email"
                class="w-full px-3 py-2 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
                placeholder="请输入邮箱" />
            </div>
            <div v-if="!isEditing">
              <label class="block text-sm text-t-body mb-1.5">密码</label>
              <input v-model="form.password" type="password"
                class="w-full px-3 py-2 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
                placeholder="请输入密码" />
            </div>
            <div v-if="!isEditing">
              <label class="block text-sm text-t-body mb-1.5">确认密码</label>
              <input v-model="form.confirmPassword" type="password"
                class="w-full px-3 py-2 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
                placeholder="请再次输入密码" />
            </div>
            <div v-if="isEditing">
              <label class="block text-sm text-t-body mb-1.5">角色</label>
              <select v-model="form.role"
                class="w-full px-3 py-2 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary">
                <option :value="0">管理员</option>
                <option :value="1">普通用户</option>
              </select>
            </div>
            <div v-if="isEditing">
              <label class="block text-sm text-t-body mb-1.5">状态</label>
              <select v-model="form.status"
                class="w-full px-3 py-2 rounded-lg bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary">
                <option :value="1">启用</option>
                <option :value="0">禁用</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              class="px-4 py-2 rounded-lg text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer"
              @click="showDialog = false">
              取消
            </button>
            <button
              class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-t-primary hover:opacity-90 transition-all cursor-pointer"
              @click="handleSubmit">
              {{ isEditing ? '保存' : '添加' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-[1300] flex items-center justify-center"
        @click.self="showDeleteConfirm = false">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div
          class="relative w-full max-w-sm mx-4 rounded-xl p-6 border border-[rgba(var(--color-primary-rgb),0.2)]"
          style="background:rgba(var(--color-surface-rgb),0.98)">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-full bg-[rgba(244,63,94,0.1)] flex items-center justify-center">
              <AlertTriangle class="w-5 h-5 text-[#f43f5e]" />
            </div>
            <h3 class="text-base font-semibold text-t-title m-0">确认删除</h3>
          </div>
          <p class="text-sm text-t-body leading-relaxed mb-6">
            确定要删除用户「{{ deleteTarget?.nickname }}」吗？此操作不可撤销。
          </p>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 rounded-lg text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer"
              @click="showDeleteConfirm = false">
              取消
            </button>
            <button
              class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#f43f5e] hover:opacity-90 transition-all cursor-pointer"
              @click="confirmDelete">
              确认删除
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '@/api/admin/user'
import { resolveAvatar, handleAvatarError, formatRelativeTime } from '@/utils/format'
import type { AdminUser, AdminUserCreateDTO, AdminUserUpdateDTO } from '@/types/admin'

const toast = useToast()

const users = ref<AdminUser[]>([])
const loading = ref(false)
const current = ref(1)
const pageSize = 10
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / pageSize))

const displayPages = computed(() => {
  const pages: number[] = []
  const tp = totalPages.value
  const c = current.value
  let start = Math.max(1, c - 2)
  const end = Math.min(tp, start + 4)
  start = Math.max(1, end - 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const showDialog = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const form = reactive({
  username: '',
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 1 as number,
  status: 1 as number,
})

const showDeleteConfirm = ref(false)
const deleteTarget = ref<AdminUser | null>(null)
const toggleLoadingMap = reactive<Record<number, boolean>>({})

async function loadUsers(page = 1) {
  loading.value = true
  try {
    const res = await getAdminUsers({ current: page, size: pageSize }) as any
    users.value = res.data?.records || []
    total.value = res.data?.total || 0
    current.value = res.data?.current || page
  } finally {
    loading.value = false
  }
}

async function toggleUserStatus(user: AdminUser) {
  toggleLoadingMap[user.id] = true
  try {
    const newStatus = user.status === 1 ? 0 : 1
    await updateAdminUser(user.id, { status: newStatus } as AdminUserUpdateDTO)
    user.status = newStatus
    toast.success(newStatus === 1 ? '用户已启用' : '用户已禁用')
  } catch {
    // handled by interceptor
  } finally {
    delete toggleLoadingMap[user.id]
  }
}

function resetForm() {
  form.username = ''
  form.nickname = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  form.role = 1
  form.status = 1
}

function openCreateDialog() {
  resetForm()
  isEditing.value = false
  editingId.value = null
  showDialog.value = true
}

async function openEditDialog(user: AdminUser) {
  isEditing.value = true
  editingId.value = user.id
  form.username = user.username
  form.nickname = user.nickname
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  form.role = user.role
  form.status = user.status
  showDialog.value = true
}

async function handleSubmit() {
  if (isEditing.value && editingId.value) {
    const data: AdminUserUpdateDTO = {
      nickname: form.nickname,
      role: form.role,
      status: form.status,
    }
    if (form.email) data.email = form.email
    try {
      await updateAdminUser(editingId.value, data)
      toast.success('用户信息已更新')
      showDialog.value = false
      loadUsers(current.value)
    } catch {
      // handled by interceptor
    }
  } else {
    if (!form.username || !form.nickname || !form.email || !form.password || !form.confirmPassword) {
      toast.error('请填写所有必填字段')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('两次输入的密码不一致')
      return
    }
    const data: AdminUserCreateDTO = {
      username: form.username,
      nickname: form.nickname,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
    }
    try {
      await createAdminUser(data)
      toast.success('用户添加成功')
      showDialog.value = false
      loadUsers(1)
    } catch {
      // handled by interceptor
    }
  }
}

function handleDelete(user: AdminUser) {
  deleteTarget.value = user
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  try {
    await deleteAdminUser(deleteTarget.value.id)
    toast.success('用户已删除')
    showDeleteConfirm.value = false
    deleteTarget.value = null
    loadUsers(current.value)
  } catch {
    // handled by interceptor
  }
}

onMounted(() => loadUsers(1))
</script>
