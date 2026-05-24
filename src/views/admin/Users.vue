<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-t-title">用户管理</h2>
            <button
                class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-t-primary hover:opacity-90 transition-all cursor-pointer"
                @click="openCreateDialog">
                <Plus class="w-4 h-4" />
                添加用户
            </button>
        </div>

        <div class="bg-t-surface border border-t-border p-4">
            <div class="flex flex-wrap items-end gap-3">
                <div class="flex-1 min-w-[180px]">
                    <label class="block text-xs text-t-muted mb-1">关键词</label>
                    <input v-model="filters.keyword" type="text"
                        class="w-full px-3 py-1.5 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
                        placeholder="用户名 / 昵称 / 邮箱" />
                </div>
                <div class="min-w-[120px]">
                    <label class="block text-xs text-t-muted mb-1">角色</label>
                    <CustomSelect v-model="roleModel" :options="roleOptions" placeholder="全部角色" />
                </div>
                <div class="min-w-[120px]">
                    <label class="block text-xs text-t-muted mb-1">状态</label>
                    <CustomSelect v-model="statusModel" :options="statusOptions" placeholder="全部状态" />
                </div>
                <div class="min-w-[150px]">
                    <label class="block text-xs text-t-muted mb-1">注册时间起</label>
                    <input v-model="filters.createTimeStart" type="date"
                        class="w-full px-3 py-1.5 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary" />
                </div>
                <div class="min-w-[150px]">
                    <label class="block text-xs text-t-muted mb-1">注册时间止</label>
                    <input v-model="filters.createTimeEnd" type="date"
                        class="w-full px-3 py-1.5 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary" />
                </div>
                <div class="flex items-center gap-2">
                    <button
                        class="px-4 py-1.5 text-sm font-semibold text-white bg-t-primary hover:opacity-90 transition-all cursor-pointer"
                        @click="applyFilters">
                        查询
                    </button>
                    <button
                        class="px-4 py-1.5 text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer"
                        @click="resetFilters">
                        重置
                    </button>
                </div>
            </div>
            <div v-if="hasActiveFilters" class="flex items-center gap-2 mt-3 pt-3 border-t border-t-border">
                <span class="text-xs text-t-muted">当前筛选：</span>
                <span v-if="filters.keyword"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
                    关键词: {{ filters.keyword }}
                    <button class="hover:opacity-70 cursor-pointer" @click="filters.keyword = undefined">×</button>
                </span>
                <span v-if="filters.role !== undefined"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
                    角色: {{ filters.role === 0 ? '管理员' : '普通用户' }}
                    <button class="hover:opacity-70 cursor-pointer" @click="filters.role = undefined">×</button>
                </span>
                <span v-if="filters.status !== undefined"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
                    状态: {{ filters.status === 1 ? '启用' : '禁用' }}
                    <button class="hover:opacity-70 cursor-pointer" @click="filters.status = undefined">×</button>
                </span>
                <span v-if="filters.createTimeStart"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
                    起: {{ filters.createTimeStart }}
                    <button class="hover:opacity-70 cursor-pointer"
                        @click="filters.createTimeStart = undefined">×</button>
                </span>
                <span v-if="filters.createTimeEnd"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary">
                    止: {{ filters.createTimeEnd }}
                    <button class="hover:opacity-70 cursor-pointer"
                        @click="filters.createTimeEnd = undefined">×</button>
                </span>
            </div>
        </div>

        <div class="bg-t-surface border border-t-border">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-t-border">
                            <th class="text-left px-5 py-3.5 text-t-muted font-medium">用户</th>
                            <th class="text-left px-5 py-3.5 text-t-muted font-medium">邮箱</th>
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
                            <td class="px-5 py-3.5 text-t-muted text-sm">
                                {{ user.email || '-' }}
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
                                        :class="toggleLoadingMap[user.id] ? 'opacity-60 cursor-wait' : ''" :style="{
                                            backgroundColor: user.status === 1 ? 'var(--color-primary)' : 'var(--color-border-solid)',
                                        }" :aria-label="user.status === 1 ? '点击禁用用户' : '点击启用用户'" :disabled="toggleLoadingMap[user.id]"
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
                                        class="p-1.5 text-t-muted transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.1)] cursor-pointer"
                                        title="编辑" @click="openEditDialog(user)">
                                        <Pencil class="w-4 h-4" />
                                    </button>
                                    <button
                                        class="p-1.5 text-t-muted transition-all duration-200 hover:text-[#f43f5e] hover:bg-[rgba(244,63,94,0.1)] cursor-pointer"
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
        </div>

        <div v-if="total > 0"
            class="flex items-center justify-between px-5 py-3 bg-t-surface border border-t-border border-t-0 -mt-px">
            <div class="flex items-center gap-2">
                <span class="text-xs text-t-muted">每页</span>
                <CustomSelect v-model="pageSize" :options="pageSizeOptions" button-class="px-2 py-1 rounded text-xs" />
            </div>
            <div class="flex items-center gap-1">
                <button
                    class="flex items-center justify-center w-8 h-8 rounded border border-t-border text-t-muted transition-all duration-200 hover:text-t-primary hover:border-t-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    :disabled="current <= 1" @click="loadUsers(current - 1)">
                    <ChevronLeft class="w-4 h-4" />
                </button>
                <template v-for="p in displayPages" :key="p">
                    <span v-if="p === '...'"
                        class="w-8 h-8 flex items-center justify-center text-t-muted text-xs">...</span>
                    <button v-else class="w-8 h-8 rounded text-xs font-medium transition-all duration-200" :class="p === current
                        ? 'bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary'
                        : 'border border-transparent text-t-muted hover:text-t-primary hover:border-t-primary'"
                        @click="loadUsers(p as number)">
                        {{ p }}
                    </button>
                </template>
                <button
                    class="flex items-center justify-center w-8 h-8 rounded border border-t-border text-t-muted transition-all duration-200 hover:text-t-primary hover:border-t-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    :disabled="current >= totalPages" @click="loadUsers(current + 1)">
                    <ChevronRight class="w-4 h-4" />
                </button>
            </div>
            <span class="text-xs text-t-muted">共 {{ total }} 条</span>
        </div>

        <Teleport to="body">
            <div v-if="showDialog" class="fixed inset-0 z-[1200] flex items-center justify-center">
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                <div
                    class="relative w-full max-w-md mx-4 bg-t-surface border border-t-border p-6 shadow-[0_0_24px_rgba(var(--color-primary-rgb),0.1)]">
                    <div class="flex items-center justify-between mb-5">
                        <h3 class="text-base font-semibold text-t-title">{{ isEditing ? '编辑用户' : '添加用户' }}</h3>
                        <button
                            class="w-7 h-7 flex items-center justify-center text-t-muted hover:text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all cursor-pointer"
                            @click="showDialog = false">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div v-if="isEditing" class="flex items-center gap-4">
                            <div class="relative group">
                                <div
                                    class="w-16 h-16 rounded-full bg-t-elevated border-2 border-[rgba(var(--color-primary-rgb),0.3)] flex items-center justify-center overflow-hidden">
                                    <img :src="resolveAvatar(avatarPreview)" alt="" class="w-full h-full object-cover"
                                        @error="handleAvatarError" />
                                </div>
                                <label
                                    class="absolute inset-0 rounded-full bg-[rgba(0,0,0,0.6)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera class="w-5 h-5 text-white" />
                                    <input type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
                                </label>
                            </div>
                            <div>
                                <p class="text-sm text-t-body">点击头像更换</p>
                                <p class="text-xs text-t-muted mt-0.5">支持 JPG、PNG 格式</p>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm text-t-body mb-1.5">用户名</label>
                            <input v-model="form.username" type="text"
                                class="w-full px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
                                placeholder="请输入用户名" />
                        </div>
                        <div>
                            <label class="block text-sm text-t-body mb-1.5">昵称</label>
                            <input v-model="form.nickname" type="text"
                                class="w-full px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
                                placeholder="请输入昵称" />
                        </div>
                        <div>
                            <label class="block text-sm text-t-body mb-1.5">邮箱</label>
                            <input v-model="form.email" type="email"
                                class="w-full px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
                                placeholder="请输入邮箱" />
                        </div>
                        <div v-if="!isEditing">
                            <label class="block text-sm text-t-body mb-1.5">密码</label>
                            <input v-model="form.password" type="password"
                                class="w-full px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
                                placeholder="请输入密码" />
                        </div>
                        <div v-if="!isEditing">
                            <label class="block text-sm text-t-body mb-1.5">确认密码</label>
                            <input v-model="form.confirmPassword" type="password"
                                class="w-full px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
                                placeholder="请再次输入密码" />
                        </div>
                        <div v-if="isEditing">
                            <label class="block text-sm text-t-body mb-1.5">重置密码</label>
                            <input v-model="form.newPassword" type="password"
                                class="w-full px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
                                placeholder="留空则不修改密码" />
                        </div>
                        <div v-if="isEditing">
                            <label class="block text-sm text-t-body mb-1.5">角色</label>
                            <CustomSelect v-model="form.role" :options="formRoleOptions" button-class="py-2" />
                        </div>
                        <div v-if="isEditing">
                            <label class="block text-sm text-t-body mb-1.5">状态</label>
                            <CustomSelect v-model="form.status" :options="formStatusOptions" button-class="py-2" />
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 mt-6">
                        <button
                            class="px-4 py-2 text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer"
                            @click="showDialog = false">
                            取消
                        </button>
                        <button
                            class="px-4 py-2 text-sm font-semibold text-white bg-t-primary hover:opacity-90 transition-all cursor-pointer"
                            @click="handleSubmit">
                            {{ isEditing ? '保存' : '添加' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <Teleport to="body">
            <div v-if="showDeleteConfirm" class="fixed inset-0 z-[1300] flex items-center justify-center">
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                <div class="relative w-full max-w-sm mx-4 p-6 border border-[rgba(var(--color-primary-rgb),0.2)]"
                    style="background:rgba(var(--color-surface-rgb),0.98)">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-[rgba(244,63,94,0.1)] flex items-center justify-center">
                                <AlertTriangle class="w-5 h-5 text-[#f43f5e]" />
                            </div>
                            <h3 class="text-base font-semibold text-t-title m-0">确认删除</h3>
                        </div>
                        <button
                            class="w-7 h-7 flex items-center justify-center text-t-muted hover:text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all cursor-pointer"
                            @click="showDeleteConfirm = false">
                            <X class="w-4 h-4" />
                        </button>
                    </div>
                    <p class="text-sm text-t-body leading-relaxed mb-6">
                        确定要删除用户「{{ deleteTarget?.nickname }}」吗？此操作不可撤销。
                    </p>
                    <div class="flex justify-end gap-3">
                        <button
                            class="px-4 py-2 text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer"
                            @click="showDeleteConfirm = false">
                            取消
                        </button>
                        <button
                            class="px-4 py-2 text-sm font-semibold text-white bg-[#f43f5e] hover:opacity-90 transition-all cursor-pointer"
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
import { ref, reactive, computed, onMounted, watch, onUnmounted } from 'vue'
import { Plus, Pencil, Trash2, AlertTriangle, X, Camera, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '@/api/admin/user'
import { uploadFile } from '@/api/file'
import { resolveAvatar, handleAvatarError, formatRelativeTime } from '@/utils/format'
import type { AdminUser, AdminUserQuery, AdminUserCreateDTO, AdminUserUpdateDTO } from '@/types/admin'
import type { ApiResponse } from '@/types/api'
import CustomSelect from '@/components/ui/CustomSelect.vue'

const toast = useToast()

const users = ref<AdminUser[]>([])
const loading = ref(false)
const current = ref(1)
const pageSize = ref(10)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const displayPages = computed(() => {
    const pages: (number | string)[] = []
    const tp = totalPages.value
    const c = current.value
    if (tp <= 7) {
        for (let i = 1; i <= tp; i++) pages.push(i)
    } else {
        pages.push(1)
        if (c > 3) pages.push('...')
        const start = Math.max(2, c - 1)
        const end = Math.min(tp - 1, c + 1)
        for (let i = start; i <= end; i++) pages.push(i)
        if (c < tp - 2) pages.push('...')
        pages.push(tp)
    }
    return pages
})

const filters = reactive<{
    keyword?: string
    role?: number
    status?: number
    createTimeStart?: string
    createTimeEnd?: string
}>({})

const roleOptions = [
    { label: '全部角色', value: '' },
    { label: '管理员', value: 0 },
    { label: '普通用户', value: 1 },
]

const statusOptions = [
    { label: '全部状态', value: '' },
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 },
]

const formRoleOptions = [
    { label: '管理员', value: 0 },
    { label: '普通用户', value: 1 },
]

const formStatusOptions = [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 },
]

const pageSizeOptions = [
    { label: '5 条', value: 5 },
    { label: '10 条', value: 10 },
    { label: '15 条', value: 15 },
    { label: '20 条', value: 20 },
    { label: '50 条', value: 50 },
]

const roleModel = computed({
    get: () => filters.role ?? '',
    set: (val: string | number) => { filters.role = val === '' ? undefined : val as number },
})

const statusModel = computed({
    get: () => filters.status ?? '',
    set: (val: string | number) => { filters.status = val === '' ? undefined : val as number },
})

const hasActiveFilters = computed(() => {
    return !!filters.keyword || filters.role !== undefined || filters.status !== undefined || !!filters.createTimeStart || !!filters.createTimeEnd
})

function buildQueryParams(page: number): AdminUserQuery {
    const params: AdminUserQuery = { current: page, size: pageSize.value }
    if (filters.keyword) {
        params.username = filters.keyword
        params.nickname = filters.keyword
        params.email = filters.keyword
    }
    if (filters.role !== undefined) params.role = filters.role
    if (filters.status !== undefined) params.status = filters.status
    if (filters.createTimeStart) params.createTimeStart = filters.createTimeStart + ' 00:00:00'
    if (filters.createTimeEnd) params.createTimeEnd = filters.createTimeEnd + ' 23:59:59'
    return params
}

function applyFilters() {
    loadUsers(1)
}

function resetFilters() {
    filters.keyword = undefined
    filters.role = undefined
    filters.status = undefined
    filters.createTimeStart = undefined
    filters.createTimeEnd = undefined
    loadUsers(1)
}

const showDialog = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const form = reactive({
    username: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    newPassword: '',
    role: 1 as number,
    status: 1 as number,
})

const avatarPreview = ref('')
const avatarFile = ref<File | null>(null)
const uploadLoading = ref(false)

const showDeleteConfirm = ref(false)
const deleteTarget = ref<AdminUser | null>(null)
const toggleLoadingMap = reactive<Record<number, boolean>>({})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function debouncedApplyFilters() {
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
        loadUsers(1)
    }, 500)
}

watch(
    () => [filters.keyword, filters.role, filters.status, filters.createTimeStart, filters.createTimeEnd],
    () => {
        debouncedApplyFilters()
    },
)

watch(pageSize, () => {
    current.value = 1
    loadUsers(1)
})

onUnmounted(() => {
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }
})

async function loadUsers(page = 1) {
    loading.value = true
    try {
        const res = await getAdminUsers(buildQueryParams(page)) as any
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
    form.newPassword = ''
    form.role = 1
    form.status = 1
    avatarPreview.value = ''
    avatarFile.value = null
}

function openCreateDialog() {
    resetForm()
    isEditing.value = false
    editingId.value = null
    showDialog.value = true
}

function handleAvatarChange(e: Event) {
    const input = e.target as HTMLInputElement
    if (!input.files?.length) return
    const file = input.files[0]
    avatarFile.value = file
    avatarPreview.value = URL.createObjectURL(file)
}

async function openEditDialog(user: AdminUser) {
    isEditing.value = true
    editingId.value = user.id
    form.username = user.username
    form.nickname = user.nickname
    form.email = user.email || ''
    form.password = ''
    form.confirmPassword = ''
    form.newPassword = ''
    form.role = user.role
    form.status = user.status
    avatarPreview.value = user.avatar || ''
    avatarFile.value = null
    showDialog.value = true
}

async function handleSubmit() {
    if (isEditing.value && editingId.value) {
        const data: AdminUserUpdateDTO = {
            nickname: form.nickname,
            username: form.username,
            role: form.role,
            status: form.status,
        }
        if (form.email) data.email = form.email
        if (form.newPassword) {
            data.newPassword = form.newPassword
            data.confirmPassword = form.newPassword
        }
        try {
            if (avatarFile.value) {
                uploadLoading.value = true
                const uploadRes = await uploadFile(avatarFile.value, 'avatar') as unknown as ApiResponse<string>
                data.avatar = uploadRes.data
                uploadLoading.value = false
            }
            await updateAdminUser(editingId.value, data)
            toast.success('用户信息已更新')
            showDialog.value = false
            loadUsers(current.value)
        } catch {
            uploadLoading.value = false
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