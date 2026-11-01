<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-xs text-t-muted max-w-2xl">
          管理博客站点的分组配置，hero / author 支持可视化编辑，其余分组使用 JSON 编辑。
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
          @click="handleRefresh"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" />
          刷新
        </button>
        <button
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-t-on-primary bg-t-primary-fill hover:opacity-90 transition-all cursor-pointer"
          @click="openAddDialog"
        >
          <Plus class="w-3.5 h-3.5" />
          新增分组
        </button>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-4 md:gap-6 md:items-start">
      <aside class="md:w-64 flex-shrink-0 bg-t-surface border border-t-border">
        <div class="flex items-center justify-between px-4 py-3 border-b border-t-border">
          <span class="text-[11px] font-semibold text-t-muted uppercase tracking-wider">分组</span>
          <span class="text-xs text-t-muted font-mono">{{ sections.length }}</span>
        </div>

        <div class="max-md:flex max-md:gap-2 max-md:overflow-x-auto max-md:p-2">
          <template v-if="loading && sections.length === 0">
            <div v-for="i in 3" :key="i" class="p-3 max-md:flex-1 max-md:min-w-[170px]">
              <div class="h-3 w-20 bg-t-elevated animate-pulse" />
              <div class="h-2.5 w-full mt-2.5 bg-t-elevated animate-pulse" />
              <div class="h-2.5 w-16 mt-2 bg-t-elevated animate-pulse" />
            </div>
          </template>

          <div v-else-if="sections.length === 0" class="px-4 py-10 text-center text-xs text-t-muted max-md:w-full">
            暂无配置分组
          </div>

          <template v-else>
            <button
              v-for="section in sections"
              :key="section.key"
              type="button"
              class="w-full text-left px-4 py-3 transition-all duration-200 cursor-pointer max-md:min-w-[180px] max-md:border max-md:border-t-border md:border-b md:border-[rgba(var(--color-primary-rgb),0.08)] md:last:border-b-0"
              :class="selected?.key === section.key
                ? 'bg-[rgba(var(--color-primary-rgb),0.1)] [box-shadow:inset_2px_0_0_var(--color-primary)] text-t-primary'
                : 'text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:text-t-primary'"
              @click="requestSelect(section)"
            >
              <div class="flex items-center gap-2">
                <span
                  class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  :class="isEnabled(section) ? 'bg-t-success' : 'bg-t-muted opacity-40'"
                />
                <span class="font-mono text-xs truncate">{{ section.key }}</span>
                <span
                  v-if="selected?.key === section.key && dirty"
                  class="ml-auto w-1.5 h-1.5 rounded-full bg-t-warning flex-shrink-0"
                  title="有未保存的修改"
                />
              </div>
              <p class="mt-1 text-xs truncate" :class="section.remark ? 'text-t-muted' : 'text-t-muted opacity-60'">
                {{ section.remark || '未填写备注' }}
              </p>
              <p class="mt-1 text-[11px] text-t-muted">{{ formatDate(section.updateTime) }}</p>
            </button>
          </template>
        </div>
      </aside>

      <section class="flex-1 min-w-0 bg-t-surface border border-t-border">
        <div v-if="!selected" class="flex flex-col items-center justify-center px-6 py-24 text-center">
          <Settings class="w-8 h-8 text-t-muted mb-3" />
          <p class="text-sm text-t-body">选择左侧分组开始编辑</p>
          <p class="mt-1 text-xs text-t-muted">或点击右上角「新增分组」创建新的配置分组</p>
        </div>

        <template v-else>
          <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-t-border">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="font-mono text-sm text-t-title truncate">{{ selected.key }}</span>
              <span
                class="px-1.5 py-0.5 text-[11px] border flex-shrink-0"
                :class="enabledDraft === 1
                  ? 'text-t-success border-t-success bg-t-success-soft'
                  : 'text-t-muted border-t-border'"
              >
                {{ enabledDraft === 1 ? '已启用' : '已停用' }}
              </span>
              <span v-if="dirty" class="text-[11px] text-t-warning flex-shrink-0">有未保存的修改</span>
            </div>

            <div class="flex items-center gap-2">
              <div class="flex items-center gap-2 mr-1">
                <span class="text-xs text-t-muted">启用</span>
                <button
                  type="button"
                  role="switch"
                  :aria-checked="enabledDraft === 1"
                  class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 cursor-pointer"
                  :class="enabledDraft === 1 ? 'bg-t-primary-fill' : 'bg-t-elevated border border-t-border'"
                  @click="toggleEnabled"
                >
                  <span
                    class="inline-block h-3.5 w-3.5 rounded-full transition-transform duration-200"
                    :class="enabledDraft === 1 ? 'translate-x-[18px] bg-t-on-primary' : 'translate-x-[3px] bg-t-muted'"
                  />
                </button>
              </div>

              <button
                class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-t-on-primary bg-t-primary-fill hover:opacity-90 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="saving"
                @click="handleSave"
              >
                <Save class="w-4 h-4" />
                {{ saving ? '保存中...' : '保存' }}
              </button>

              <button
                class="w-8 h-8 flex items-center justify-center border border-t-border text-t-muted hover:text-t-danger hover:border-t-danger transition-all cursor-pointer"
                title="删除分组"
                @click="handleDelete"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="px-4 pt-4">
            <AppTabs
              :model-value="activeTab"
              :tabs="tabItems"
              variant="pill"
              @update:model-value="handleTabChange"
            />
          </div>

          <div class="p-4">
            <div v-if="activeTab === 'visual'">
              <HeroConfigForm v-if="selected.key === 'hero'" v-model="heroDraft" />
              <AuthorConfigForm v-else-if="selected.key === 'author'" v-model="authorDraft" />
              <div v-else class="border border-dashed border-t-border px-4 py-16 text-center">
                <p class="text-sm text-t-body">该分组暂无可视化表单，请使用 JSON 编辑</p>
                <button
                  class="mt-3 px-4 py-2 text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer"
                  @click="handleTabChange('json')"
                >
                  切换到 JSON
                </button>
              </div>
            </div>

            <BlogConfigJsonEditor v-else v-model="jsonText" :error="jsonError" />
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-t-border">
            <p class="text-[11px] text-t-muted">
              备注：<span class="text-t-body">{{ selected.remark || '-' }}</span>
            </p>
            <div class="flex items-center gap-3">
              <span v-if="dirty" class="inline-flex items-center gap-1.5 text-[11px] text-t-warning">
                <span class="w-1.5 h-1.5 rounded-full bg-t-warning" />
                有未保存的修改
              </span>
              <span class="text-[11px] text-t-muted">更新于 {{ formatDate(selected.updateTime, 'YYYY-MM-DD HH:mm') }}</span>
            </div>
          </div>
        </template>
      </section>
    </div>

    <AppDialog v-model:open="showAddDialog" title="新增配置分组">
      <div class="space-y-4">
        <div>
          <label class="block text-xs text-t-muted mb-1">分组 Key <span class="text-t-danger">*</span></label>
          <input
            v-model="addForm.key"
            type="text"
            class="w-full px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm font-mono outline-none transition-colors duration-200 focus:border-t-primary"
            placeholder="例如：footer"
          />
          <p class="mt-1 text-[11px] text-t-muted">需匹配 <span class="font-mono">^[a-z][a-z0-9-]{1,63}$</span></p>
        </div>
        <div>
          <label class="block text-xs text-t-muted mb-1">备注</label>
          <input
            v-model="addForm.remark"
            type="text"
            class="w-full px-3 py-2 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary"
            placeholder="可选，用于说明该分组的用途"
          />
        </div>
      </div>
      <div class="flex justify-end gap-3 mt-6">
        <button
          class="px-4 py-2 text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer"
          @click="showAddDialog = false"
        >
          取消
        </button>
        <button
          class="px-4 py-2 text-sm font-semibold text-t-on-primary bg-t-primary-fill hover:opacity-90 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="creating"
          @click="submitAdd"
        >
          {{ creating ? '创建中...' : '创建' }}
        </button>
      </div>
    </AppDialog>

    <AppConfirmDialog
      v-model:open="showDiscardConfirm"
      title="放弃未保存的修改？"
      description="当前分组有未保存的修改，继续操作后这些修改将丢失。"
      confirm-text="放弃修改"
      danger
      @confirm="confirmDiscard"
    />

    <AppConfirmDialog
      v-model:open="showDeleteConfirm"
      title="确认删除分组"
      :description="deleteDescription"
      confirm-text="确认删除"
      danger
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { Plus, RefreshCw, Save, Settings, Trash2 } from 'lucide-vue-next'
import {
  deleteAdminBlogConfig,
  getAdminBlogConfigs,
  upsertAdminBlogConfig,
} from '~/api/admin/blogConfig'
import type { AdminBlogConfigSection } from '~/types/admin'
import type { AuthorConfig, HeroConfig } from '~/types'
import { formatDate } from '~/utils/format'
import BlogConfigJsonEditor from '~/components/admin/blog-config/BlogConfigJsonEditor.vue'
import HeroConfigForm from '~/components/admin/blog-config/HeroConfigForm.vue'
import AuthorConfigForm from '~/components/admin/blog-config/AuthorConfigForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: '站点配置 | 立里博客', robots: 'noindex' })

const toast = useToast()

const KEY_PATTERN = /^[a-z][a-z0-9-]{1,63}$/

const sections = ref<AdminBlogConfigSection[]>([])
const loading = ref(false)
const saving = ref(false)
const creating = ref(false)

const selected = ref<AdminBlogConfigSection | null>(null)
const activeTab = ref<'visual' | 'json'>('json')
const enabledDraft = ref(1)

const heroDraft = ref<HeroConfig>({})
const authorDraft = ref<AuthorConfig>({})
const genericDraft = ref<Record<string, unknown>>({})
const jsonText = ref('{}')
const jsonError = ref('')
const snapshot = ref('{}')

const tabItems = [
  { label: '可视化', value: 'visual' },
  { label: 'JSON', value: 'json' },
]

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

// 仅格式化差异不算修改，按解析后的内容比较
function jsonEqual(a: string, b: string): boolean {
  if (a === b) return true
  try {
    return JSON.stringify(JSON.parse(a)) === JSON.stringify(JSON.parse(b))
  } catch {
    return false
  }
}

function stringifyDraft(): string {
  try {
    return JSON.stringify(currentTypedDraft(), null, 2)
  } catch {
    return '{}'
  }
}

function currentTypedDraft(): Record<string, unknown> {
  const key = selected.value?.key
  if (key === 'hero') return heroDraft.value as unknown as Record<string, unknown>
  if (key === 'author') return authorDraft.value as unknown as Record<string, unknown>
  return genericDraft.value
}

const currentJson = computed(() => {
  if (!selected.value) return snapshot.value
  return activeTab.value === 'json' ? jsonText.value : stringifyDraft()
})

const dirty = computed(() => {
  if (!selected.value) return false
  if (enabledDraft.value !== selected.value.enabled) return true
  return !jsonEqual(currentJson.value, snapshot.value)
})

const deleteDescription = computed(() => (
  selected.value
    ? `确定要删除分组 ${selected.value.key} 吗？该分组配置将从前台失效，此操作不可撤销。`
    : '确定要删除该分组吗？此操作不可撤销。'
))

function selectSection(section: AdminBlogConfigSection): void {
  const value = clone(section.value ?? {})
  selected.value = section
  enabledDraft.value = section.enabled
  heroDraft.value = section.key === 'hero' ? value as unknown as HeroConfig : {}
  authorDraft.value = section.key === 'author' ? value as unknown as AuthorConfig : {}
  genericDraft.value = section.key === 'hero' || section.key === 'author' ? {} : value
  jsonText.value = JSON.stringify(value, null, 2)
  snapshot.value = jsonText.value
  jsonError.value = ''
  activeTab.value = section.key === 'hero' || section.key === 'author' ? 'visual' : 'json'
}

function resetEditor(): void {
  selected.value = null
  enabledDraft.value = 1
  heroDraft.value = {}
  authorDraft.value = {}
  genericDraft.value = {}
  jsonText.value = '{}'
  jsonError.value = ''
  snapshot.value = '{}'
}

async function loadSections(preferKey?: string, keepTab = false): Promise<void> {
  loading.value = true
  try {
    const response = await getAdminBlogConfigs()
    sections.value = response.data || []
    const targetKey = preferKey ?? selected.value?.key
    const next = (targetKey ? sections.value.find(item => item.key === targetKey) : undefined)
      ?? sections.value[0]
      ?? null
    if (!next) {
      resetEditor()
      return
    }
    const prevTab = activeTab.value
    selectSection(next)
    if (keepTab) activeTab.value = prevTab
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}

const pendingSection = ref<AdminBlogConfigSection | null>(null)
const showDiscardConfirm = ref(false)
const reloadAfterDiscard = ref(false)

function requestSelect(section: AdminBlogConfigSection): void {
  if (selected.value?.key === section.key) return
  if (!dirty.value) {
    selectSection(section)
    return
  }
  pendingSection.value = section
  reloadAfterDiscard.value = false
  showDiscardConfirm.value = true
}

function handleRefresh(): void {
  if (dirty.value) {
    pendingSection.value = null
    reloadAfterDiscard.value = true
    showDiscardConfirm.value = true
    return
  }
  loadSections()
}

function confirmDiscard(): void {
  showDiscardConfirm.value = false
  const target = pendingSection.value
  const shouldReload = reloadAfterDiscard.value
  pendingSection.value = null
  reloadAfterDiscard.value = false
  if (target) {
    selectSection(target)
  } else if (shouldReload) {
    loadSections()
  }
}

function toggleEnabled(): void {
  enabledDraft.value = enabledDraft.value === 1 ? 0 : 1
}

function isEnabled(section: AdminBlogConfigSection): boolean {
  return selected.value?.key === section.key ? enabledDraft.value === 1 : section.enabled === 1
}

function applyJsonToDraft(text: string): boolean {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    jsonError.value = `JSON 格式错误：${message}`
    toast.error('JSON 格式有误，无法切换到可视化编辑')
    return false
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    jsonError.value = '配置内容必须是 JSON 对象'
    toast.error('配置内容必须是 JSON 对象')
    return false
  }
  const value = clone(parsed as Record<string, unknown>)
  const key = selected.value?.key
  heroDraft.value = key === 'hero' ? value as unknown as HeroConfig : {}
  authorDraft.value = key === 'author' ? value as unknown as AuthorConfig : {}
  genericDraft.value = key === 'hero' || key === 'author' ? {} : value
  jsonError.value = ''
  return true
}

function handleTabChange(value: string): void {
  const next: 'visual' | 'json' = value === 'visual' ? 'visual' : 'json'
  if (next === activeTab.value) return
  if (next === 'json') {
    jsonText.value = stringifyDraft()
    jsonError.value = ''
    activeTab.value = 'json'
    return
  }
  if (!applyJsonToDraft(jsonText.value)) return
  activeTab.value = 'visual'
}

watch(jsonText, () => {
  if (jsonError.value) jsonError.value = ''
})

async function handleSave(): Promise<void> {
  if (!selected.value) return

  let payload: Record<string, unknown>
  if (activeTab.value === 'json') {
    let parsed: unknown
    try {
      parsed = JSON.parse(jsonText.value)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      jsonError.value = `JSON 格式错误：${message}`
      toast.error('JSON 格式有误，无法保存')
      return
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      jsonError.value = '配置内容必须是 JSON 对象'
      toast.error('配置内容必须是 JSON 对象')
      return
    }
    payload = clone(parsed as Record<string, unknown>)
  } else {
    payload = clone(currentTypedDraft())
  }

  saving.value = true
  try {
    await upsertAdminBlogConfig(selected.value.key, payload, {
      enabled: enabledDraft.value,
      remark: selected.value.remark ?? undefined,
    })
    const pretty = JSON.stringify(payload, null, 2)
    jsonText.value = pretty
    snapshot.value = pretty
    jsonError.value = ''
    toast.success(`分组 ${selected.value.key} 已保存`)
    await loadSections(selected.value.key, true)
  } catch {
    // handled by interceptor
  } finally {
    saving.value = false
  }
}

const showDeleteConfirm = ref(false)

function handleDelete(): void {
  if (!selected.value) return
  showDeleteConfirm.value = true
}

async function confirmDelete(): Promise<void> {
  if (!selected.value) return
  const key = selected.value.key
  try {
    await deleteAdminBlogConfig(key)
    toast.success(`分组 ${key} 已删除`)
    showDeleteConfirm.value = false
    resetEditor()
    await loadSections()
  } catch {
    // handled by interceptor
  }
}

const showAddDialog = ref(false)
const addForm = reactive({ key: '', remark: '' })

function openAddDialog(): void {
  addForm.key = ''
  addForm.remark = ''
  showAddDialog.value = true
}

async function submitAdd(): Promise<void> {
  const key = addForm.key.trim()
  if (!KEY_PATTERN.test(key)) {
    toast.warning('Key 需以小写字母开头，仅含小写字母、数字与连字符，长度 2-64')
    return
  }
  if (sections.value.some(item => item.key === key)) {
    toast.warning('该分组已存在')
    return
  }
  creating.value = true
  try {
    await upsertAdminBlogConfig(key, {}, { remark: addForm.remark.trim() || undefined })
    toast.success(`分组 ${key} 已创建`)
    showAddDialog.value = false
    await loadSections(key)
  } catch {
    // handled by interceptor
  } finally {
    creating.value = false
  }
}

onMounted(() => loadSections())
</script>
