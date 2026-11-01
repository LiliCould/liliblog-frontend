<template>
  <div class="space-y-4">
    <!-- 作者资料 -->
    <section :class="cardClass">
      <div :class="sectionHeadClass">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <User class="w-4 h-4 text-t-primary shrink-0" />
            <h3 class="text-sm font-semibold text-t-title">作者资料</h3>
          </div>
          <p class="text-[11px] text-t-muted mt-1">首页「关于作者」卡片展示的基础信息</p>
        </div>
      </div>

      <div class="p-4 grid gap-3 md:grid-cols-2">
        <div class="md:col-span-2">
          <label :class="labelClass">头像地址</label>
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 shrink-0 flex items-center justify-center overflow-hidden rounded-full border border-t-border bg-t-bg">
              <img
                v-if="showAvatarPreview"
                :src="profile.avatar"
                alt="头像预览"
                class="w-full h-full object-cover"
                @error="markAvatarFailed"
              />
              <User v-else class="w-4 h-4 text-t-muted" />
            </span>
            <input
              :value="profile.avatar ?? ''"
              type="text"
              :class="inputClass"
              class="font-mono"
              placeholder="https://oss.example.com/avatar.png"
              @input="updateProfile('avatar', $event)"
            />
          </div>
        </div>

        <div>
          <label :class="labelClass">昵称</label>
          <input
            :value="profile.nickname ?? ''"
            type="text"
            :class="inputClass"
            placeholder="立里可"
            @input="updateProfile('nickname', $event)"
          />
        </div>

        <div>
          <label :class="labelClass">账号 handle</label>
          <input
            :value="profile.handle ?? ''"
            type="text"
            :class="inputClass"
            class="font-mono"
            placeholder="LiliCould"
            @input="updateProfile('handle', $event)"
          />
        </div>

        <div>
          <label :class="labelClass">邮箱</label>
          <input
            :value="profile.email ?? ''"
            type="email"
            :class="inputClass"
            placeholder="lilicould@qq.com"
            @input="updateProfile('email', $event)"
          />
        </div>

        <div>
          <label :class="labelClass">角标文案 badge</label>
          <input
            :value="profile.badge ?? ''"
            type="text"
            :class="inputClass"
            placeholder="关于作者"
            @input="updateProfile('badge', $event)"
          />
        </div>

        <div class="md:col-span-2">
          <label :class="labelClass">个性签名</label>
          <input
            :value="profile.signature ?? ''"
            type="text"
            :class="inputClass"
            placeholder="热爱技术，追求卓越"
            @input="updateProfile('signature', $event)"
          />
        </div>
      </div>
    </section>

    <!-- 社交链接 -->
    <section :class="cardClass">
      <div :class="sectionHeadClass">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <Link2 class="w-4 h-4 text-t-primary shrink-0" />
            <h3 class="text-sm font-semibold text-t-title">社交链接</h3>
          </div>
          <p class="text-[11px] text-t-muted mt-1">图标仅支持 github / bilibili / music / mail</p>
        </div>
        <span class="text-[11px] font-mono text-t-muted shrink-0">{{ socialLinks.length }} 项</span>
      </div>

      <div class="p-4 space-y-2.5">
        <div class="hidden md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_7rem_minmax(0,1.6fr)_3rem_2rem] gap-2 text-[11px] text-t-muted">
          <span>key</span>
          <span>名称</span>
          <span>图标</span>
          <span>链接</span>
          <span class="text-center">启用</span>
          <span />
        </div>

        <div v-if="socialLinks.length === 0" class="py-6 text-center text-xs text-t-muted border border-dashed border-t-border">
          暂无社交链接，点击下方「添加链接」开始
        </div>

        <div
          v-for="(link, index) in socialLinks"
          :key="index"
          class="grid gap-2 md:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_7rem_minmax(0,1.6fr)_3rem_2rem] md:items-center"
        >
          <input v-model="link.key" type="text" :class="inputClass" class="font-mono" placeholder="key，如 github" />
          <input v-model="link.name" type="text" :class="inputClass" placeholder="名称，如 GitHub" />
          <select v-model="link.icon" :class="selectClass">
            <option v-for="option in iconOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
          <input v-model="link.url" type="text" :class="inputClass" class="font-mono" placeholder="https://github.com/..." />
          <div class="flex items-center md:justify-center">
            <button
              type="button"
              role="switch"
              :aria-checked="link.enabled !== false"
              :aria-label="link.enabled !== false ? '停用该链接' : '启用该链接'"
              class="relative inline-flex w-8 h-4 items-center rounded-full border transition-colors duration-200 cursor-pointer"
              :class="link.enabled !== false ? 'bg-t-primary-fill border-t-primary' : 'bg-t-elevated border-t-border hover:border-t-border-hover'"
              @click="toggleSocialLink(index)"
            >
              <span
                class="absolute left-0.5 w-3 h-3 rounded-full bg-t-surface border border-t-border transition-transform duration-200"
                :class="{ 'translate-x-4': link.enabled !== false }"
              />
            </button>
          </div>
          <button
            type="button"
            :class="[deleteBtnClass, 'max-md:justify-self-end']"
            title="删除链接"
            aria-label="删除链接"
            @click="removeSocialLink(index)"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>

        <button type="button" :class="addBtnClass" @click="addSocialLink">
          <Plus class="w-3.5 h-3.5" />
          添加链接
        </button>
      </div>
    </section>

    <!-- 兴趣分组 -->
    <section :class="cardClass">
      <div :class="sectionHeadClass">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-t-primary shrink-0" />
            <h3 class="text-sm font-semibold text-t-title">兴趣分组</h3>
          </div>
          <p class="text-[11px] text-t-muted mt-1">每组一个标题和若干条目，条目支持回车快速添加</p>
        </div>
        <span class="text-[11px] font-mono text-t-muted shrink-0">{{ infoGroups.length }} 组</span>
      </div>

      <div class="p-4 space-y-3">
        <div v-if="infoGroups.length === 0" class="py-6 text-center text-xs text-t-muted border border-dashed border-t-border">
          暂无兴趣分组，点击下方「添加分组」开始
        </div>

        <div
          v-for="(group, index) in infoGroups"
          :key="index"
          class="p-3 space-y-3 bg-t-bg border border-t-border transition-colors duration-200 hover:border-t-border-hover"
        >
          <div class="grid gap-2 md:grid-cols-[4rem_minmax(0,1.4fr)_minmax(0,1fr)_2rem] md:items-center">
            <input v-model="group.emoji" type="text" :class="inputClass" class="text-center" placeholder="🍥" aria-label="分组 emoji" />
            <input v-model="group.text" type="text" :class="inputClass" placeholder="分组名称，如 喜欢的动漫" />
            <input v-model="group.key" type="text" :class="inputClass" class="font-mono" placeholder="key，如 anime" />
            <button
              type="button"
              :class="[deleteBtnClass, 'max-md:justify-self-end']"
              title="删除分组"
              aria-label="删除分组"
              @click="removeInfoGroup(index)"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>

          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-1.5">
              <span
                v-for="(item, itemIndex) in (Array.isArray(group.items) ? group.items : [])"
                :key="itemIndex"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[rgba(var(--color-primary-rgb),0.1)] text-t-primary text-xs"
              >
                {{ item }}
                <button
                  type="button"
                  class="leading-none hover:text-t-danger cursor-pointer"
                  :aria-label="`删除条目 ${item}`"
                  @click="removeItem(index, itemIndex)"
                >
                  ×
                </button>
              </span>
              <span v-if="!group.items || group.items.length === 0" class="text-[11px] text-t-muted">暂无条目</span>
            </div>

            <div class="flex items-center gap-2">
              <input
                :value="itemDrafts[index] ?? ''"
                type="text"
                :class="inputClass"
                placeholder="输入条目后按回车添加"
                @input="updateItemDraft(index, $event)"
                @keydown.enter.prevent="addItem(index)"
              />
              <button
                type="button"
                class="btn-admin btn-admin-secondary shrink-0"
                @click="addItem(index)"
              >
                添加
              </button>
            </div>
          </div>
        </div>

        <button type="button" :class="addBtnClass" @click="addInfoGroup">
          <Plus class="w-3.5 h-3.5" />
          添加分组
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Link2, Plus, Sparkles, Trash2, User } from 'lucide-vue-next'
import type { AuthorConfig, AuthorInfoGroup, AuthorProfile, AuthorSocialLink } from '~/types'

const model = defineModel<AuthorConfig>({ required: true })

const cardClass = 'bg-t-surface border border-t-border'
const sectionHeadClass = 'flex flex-wrap items-start justify-between gap-3 px-4 py-3 border-b border-t-border'
const labelClass = 'block text-xs text-t-muted mb-1'
const inputClass = 'form-control'
const selectClass = 'form-control'
const deleteBtnClass = 'btn-admin btn-admin-icon btn-admin-danger-outline shrink-0'
const addBtnClass = 'btn-admin-add'

const iconOptions = [
  { value: 'github', label: 'GitHub' },
  { value: 'bilibili', label: 'Bilibili' },
  { value: 'music', label: '网易云音乐' },
  { value: 'mail', label: '邮箱' },
]

const profile = computed(() => model.value.profile ?? {})
const socialLinks = computed(() => model.value.socialLinks ?? [])
const infoGroups = computed(() => model.value.infoGroups ?? [])

const itemDrafts = reactive<Record<number, string>>({})
const avatarFailed = ref(false)

const showAvatarPreview = computed(() => Boolean(profile.value.avatar) && !avatarFailed.value)

watch(() => model.value.profile?.avatar, () => {
  avatarFailed.value = false
})

// 切换配置分组时清空未提交的条目草稿与头像错误状态
watch(model, () => {
  avatarFailed.value = false
  for (const key of Object.keys(itemDrafts)) delete itemDrafts[Number(key)]
})

function markAvatarFailed(): void {
  avatarFailed.value = true
}

function ensureProfile(): AuthorProfile {
  if (!model.value.profile) model.value.profile = {}
  return model.value.profile
}

function updateProfile(field: keyof AuthorProfile, event: Event): void {
  ensureProfile()[field] = (event.target as HTMLInputElement).value
}

function addSocialLink(): void {
  if (!model.value.socialLinks) model.value.socialLinks = []
  model.value.socialLinks.push({ key: '', name: '', icon: 'github', url: '', enabled: true })
}

function removeSocialLink(index: number): void {
  model.value.socialLinks?.splice(index, 1)
}

function toggleSocialLink(index: number): void {
  const link: AuthorSocialLink | undefined = socialLinks.value[index]
  if (!link) return
  link.enabled = link.enabled === false
}

function addInfoGroup(): void {
  if (!model.value.infoGroups) model.value.infoGroups = []
  model.value.infoGroups.push({ key: '', text: '', emoji: '', items: [] })
}

function removeInfoGroup(index: number): void {
  model.value.infoGroups?.splice(index, 1)
  for (const key of Object.keys(itemDrafts)) delete itemDrafts[Number(key)]
}

function updateItemDraft(index: number, event: Event): void {
  itemDrafts[index] = (event.target as HTMLInputElement).value
}

function addItem(index: number): void {
  const group: AuthorInfoGroup | undefined = infoGroups.value[index]
  if (!group) return
  const text = (itemDrafts[index] ?? '').trim()
  if (!text) return
  if (!Array.isArray(group.items)) group.items = []
  if (!group.items.includes(text)) group.items.push(text)
  itemDrafts[index] = ''
}

function removeItem(index: number, itemIndex: number): void {
  const group: AuthorInfoGroup | undefined = infoGroups.value[index]
  if (!group || !Array.isArray(group.items)) return
  group.items.splice(itemIndex, 1)
}
</script>
