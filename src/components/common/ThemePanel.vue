<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-[1100] flex items-center justify-center" @click.self="$emit('close')">
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div
                class="relative w-full max-w-md mx-4 max-h-[85vh] overflow-y-auto rounded-xl bg-t-surface border border-t-border p-6 shadow-[0_0_24px_rgba(var(--color-primary-rgb),0.1)]">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-semibold text-t-title">主题设置</h2>
                    <button
                        class="w-8 h-8 rounded-lg flex items-center justify-center text-t-muted hover:text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all duration-200"
                        @click="$emit('close')">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <div class="mb-6">
                    <div class="flex items-center justify-between p-3 rounded-lg border transition-all duration-300"
                        :class="followSystem
                            ? 'border-t-primary bg-[rgba(var(--color-primary-rgb),0.08)]'
                            : 'border-t-border hover:border-[rgba(var(--color-primary-rgb),0.3)]'">
                        <div class="flex items-center gap-3">
                            <Monitor class="w-5 h-5" :class="followSystem ? 'text-t-primary' : 'text-t-muted'" />
                            <div>
                                <span class="text-sm font-medium"
                                    :class="followSystem ? 'text-t-primary' : 'text-t-body'">跟随系统</span>
                                <p class="text-xs text-t-muted mt-0.5">
                                    {{ followSystem ? `当前：系统${systemIsDark ? '深色' : '浅色'}模式` : '根据系统设置自动切换主题' }}
                                </p>
                            </div>
                        </div>
                        <button class="relative w-10 h-6 rounded-full transition-colors duration-300 cursor-pointer"
                            :class="followSystem ? 'bg-t-primary' : 'bg-t-border'" @click="toggleFollowSystem">
                            <span
                                class="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300"
                                :style="{ left: followSystem ? '18px' : '2px' }"></span>
                        </button>
                    </div>
                </div>

                <div class="h-px bg-t-border mb-6"></div>

                <div class="mb-6">
                    <h3 class="text-sm font-semibold text-t-body mb-3">预设主题</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <button v-for="t in themes" :key="t.id"
                            class="relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 cursor-pointer"
                            :class="currentTheme === t.id
                                ? 'border-t-primary bg-[rgba(var(--color-primary-rgb),0.08)] shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.15)]'
                                : 'border-t-border hover:border-[rgba(var(--color-primary-rgb),0.3)]'"
                            :disabled="followSystem && !!t.systemMapping" @click="handleSelectTheme(t.id)">
                            <div class="flex gap-1 shrink-0">
                                <span class="w-5 h-5 rounded-full border border-[rgba(var(--color-primary-rgb),0.2)]"
                                    :style="{ backgroundColor: t.preview.primary }"></span>
                                <span class="w-5 h-5 rounded-full border border-[rgba(var(--color-primary-rgb),0.2)]"
                                    :style="{ backgroundColor: t.preview.bg }"></span>
                                <span class="w-5 h-5 rounded-full border border-[rgba(var(--color-primary-rgb),0.2)]"
                                    :style="{ backgroundColor: t.preview.surface }"></span>
                            </div>
                            <div class="flex flex-col items-start">
                                <span class="text-sm font-medium"
                                    :class="currentTheme === t.id ? 'text-t-primary' : 'text-t-body'">{{ t.name
                                    }}</span>
                                <span v-if="t.systemMapping" class="text-[10px] text-t-muted">
                                    {{ t.systemMapping === 'light' ? '☀ 浅色' : '🌙 深色' }}
                                </span>
                            </div>
                            <Check v-if="currentTheme === t.id" class="w-4 h-4 text-t-primary absolute right-3" />
                        </button>
                    </div>
                </div>

                <div class="h-px bg-t-border mb-6"></div>

                <div class="mb-6" :class="followSystem ? 'opacity-40 pointer-events-none' : ''">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-sm font-semibold text-t-body">自定义配色</h3>
                        <button class="text-xs text-t-muted hover:text-t-primary transition-colors duration-200"
                            @click="handleReset">
                            重置
                        </button>
                    </div>
                    <div class="flex flex-col gap-3">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-t-muted">主色调</span>
                            <div class="flex items-center gap-2">
                                <input type="color"
                                    :value="customOverrides.primary || getComputedColor('--color-primary')"
                                    class="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                                    @input="updateCustom('primary', ($event.target as HTMLInputElement).value)" />
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-t-muted">强调色</span>
                            <div class="flex items-center gap-2">
                                <input type="color"
                                    :value="customOverrides.secondary || getComputedColor('--color-secondary')"
                                    class="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                                    @input="updateCustom('secondary', ($event.target as HTMLInputElement).value)" />
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-t-muted">背景色</span>
                            <div class="flex items-center gap-2">
                                <input type="color" :value="customOverrides.bg || getComputedColor('--color-bg')"
                                    class="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                                    @input="updateCustom('bg', ($event.target as HTMLInputElement).value)" />
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-t-muted">卡片色</span>
                            <div class="flex items-center gap-2">
                                <input type="color"
                                    :value="customOverrides.surface || getComputedColor('--color-surface')"
                                    class="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                                    @input="updateCustom('surface', ($event.target as HTMLInputElement).value)" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="h-px bg-t-border mb-6"></div>

                <div :class="followSystem ? 'opacity-40 pointer-events-none' : ''">
                    <h3 class="text-sm font-semibold text-t-body mb-3">排版设置</h3>
                    <div class="flex flex-col gap-4">
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <span class="text-sm text-t-muted">字体大小</span>
                                <span class="text-xs text-t-primary font-mono">{{ localOverrides.fontSize || 15
                                }}px</span>
                            </div>
                            <input type="range" :min="12" :max="20" :value="localOverrides.fontSize || 15"
                                class="w-full h-1.5 rounded-full appearance-none bg-[rgba(var(--color-primary-rgb),0.15)] cursor-pointer accent-[var(--color-primary)]"
                                @input="updateCustom('fontSize', Number(($event.target as HTMLInputElement).value))" />
                        </div>
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <span class="text-sm text-t-muted">圆角大小</span>
                                <span class="text-xs text-t-primary font-mono">{{ localOverrides.borderRadius ?? 8
                                }}px</span>
                            </div>
                            <input type="range" :min="0" :max="20" :value="localOverrides.borderRadius ?? 8"
                                class="w-full h-1.5 rounded-full appearance-none bg-[rgba(var(--color-primary-rgb),0.15)] cursor-pointer accent-[var(--color-primary)]"
                                @input="updateCustom('borderRadius', Number(($event.target as HTMLInputElement).value))" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showConfirmDialog" class="fixed inset-0 z-[1200] flex items-center justify-center">
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showConfirmDialog = false"></div>
            <div class="relative w-full max-w-sm mx-4 rounded-xl p-6 border border-[rgba(var(--color-primary-rgb),0.2)]"
                style="background:rgba(var(--color-surface-rgb),0.98)">
                <div class="flex items-center gap-3 mb-4">
                    <div
                        class="w-10 h-10 rounded-full bg-[rgba(var(--color-primary-rgb),0.1)] flex items-center justify-center">
                        <AlertTriangle class="w-5 h-5 text-t-primary" />
                    </div>
                    <h3 class="text-base font-semibold text-t-title m-0">启用跟随系统</h3>
                </div>
                <p class="text-sm text-t-body leading-relaxed mb-6">
                    启用跟随系统后，所有自定义主题设置将被重置为系统默认。系统深色模式将自动切换至"赛博暗夜"，浅色模式将保持"明亮模式"。
                </p>
                <div class="flex justify-end gap-3">
                    <button
                        class="px-4 py-2 rounded-lg text-sm text-t-muted border border-t-border hover:text-t-body transition-colors"
                        @click="showConfirmDialog = false">
                        取消
                    </button>
                    <button
                        class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-t-primary hover:opacity-90 transition-all"
                        @click="confirmEnableFollowSystem">
                        确认启用
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { reactive, watch, ref, computed } from 'vue'
import { X, Check, Monitor, AlertTriangle } from 'lucide-vue-next'
import { useTheme, themes } from '@/composables/useTheme'
import type { CustomThemeOverrides } from '@/composables/useTheme'

defineEmits<{ close: [] }>()

const { currentTheme, customOverrides, followSystem, setTheme, setCustom, resetCustom, enableFollowSystem, disableFollowSystem, getSystemTheme } = useTheme()

const localOverrides = reactive<CustomThemeOverrides>({ ...customOverrides.value })
const showConfirmDialog = ref(false)

const systemIsDark = computed(() => getSystemTheme() === 'dark')

watch(() => customOverrides.value, (val) => {
    Object.assign(localOverrides, val)
}, { deep: true })

function getComputedColor(varName: string): string {
    const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
    if (val.startsWith('#')) return val
    if (val.startsWith('rgb')) {
        const match = val.match(/(\d+),\s*(\d+),\s*(\d+)/)
        if (match) {
            const r = parseInt(match[1]).toString(16).padStart(2, '0')
            const g = parseInt(match[2]).toString(16).padStart(2, '0')
            const b = parseInt(match[3]).toString(16).padStart(2, '0')
            return `#${r}${g}${b}`
        }
    }
    return '#000000'
}

function updateCustom(key: keyof CustomThemeOverrides, value: string | number) {
    (localOverrides as any)[key] = value
    setCustom({ ...localOverrides })
}

function handleReset() {
    resetCustom()
    Object.keys(localOverrides).forEach(k => delete (localOverrides as any)[k])
}

function toggleFollowSystem() {
    if (followSystem.value) {
        disableFollowSystem()
    } else {
        showConfirmDialog.value = true
    }
}

function confirmEnableFollowSystem() {
    showConfirmDialog.value = false
    enableFollowSystem()
    Object.keys(localOverrides).forEach(k => delete (localOverrides as any)[k])
}

function handleSelectTheme(themeId: string) {
    if (followSystem.value) return
    setTheme(themeId)
}
</script>
