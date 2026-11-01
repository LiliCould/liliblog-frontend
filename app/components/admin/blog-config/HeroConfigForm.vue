<template>
  <div class="space-y-4">
    <!-- 打字机文案 -->
    <section :class="cardClass">
      <div :class="sectionHeadClass">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <Type class="w-4 h-4 text-t-primary shrink-0" />
            <h3 class="text-sm font-semibold text-t-title">打字机文案</h3>
          </div>
          <p class="text-[11px] text-t-muted mt-1">首页 Hero 区逐字打出的短句，按顺序循环播放</p>
        </div>
        <button
          type="button"
          role="switch"
          :aria-checked="typewriterEnabled"
          class="inline-flex items-center gap-2 shrink-0 cursor-pointer"
          @click="toggleTypewriter"
        >
          <span
            class="relative inline-flex w-9 h-5 items-center rounded-full border transition-colors duration-200"
            :class="typewriterEnabled ? 'bg-t-primary-fill border-t-primary' : 'bg-t-elevated border-t-border hover:border-t-border-hover'"
          >
            <span
              class="absolute left-0.5 w-4 h-4 rounded-full bg-t-surface border border-t-border transition-transform duration-200"
              :class="{ 'translate-x-4': typewriterEnabled }"
            />
          </span>
          <span class="text-xs font-medium" :class="typewriterEnabled ? 'text-t-primary' : 'text-t-muted'">
            {{ typewriterEnabled ? '已启用' : '已关闭' }}
          </span>
        </button>
      </div>

      <div class="p-4 space-y-2.5">
        <div v-if="!typewriterEnabled" class="flex items-start gap-2 px-3 py-2 bg-[rgba(var(--color-primary-rgb),0.05)] border border-t-border text-[11px] leading-relaxed text-t-muted">
          <Info class="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>打字机效果已关闭，下面的文案会保留但不会在首页播放。</span>
        </div>

        <div v-if="phrases.length === 0" class="py-6 text-center text-xs text-t-muted border border-dashed border-t-border">
          暂无文案，点击下方「添加文案」开始
        </div>

        <div v-for="(phrase, index) in phrases" :key="index" class="flex items-center gap-2">
          <span class="w-5 shrink-0 text-right text-[11px] font-mono text-t-muted">{{ index + 1 }}</span>
          <input
            :value="phrase"
            type="text"
            :class="inputClass"
            placeholder="例如：热爱技术，追求卓越"
            @input="updatePhrase(index, $event)"
          />
          <button type="button" :class="deleteBtnClass" title="删除文案" aria-label="删除文案" @click="removePhrase(index)">
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>

        <button type="button" :class="addBtnClass" @click="addPhrase">
          <Plus class="w-3.5 h-3.5" />
          添加文案
        </button>
      </div>
    </section>

    <!-- 编程语言模板 -->
    <section :class="cardClass">
      <div :class="sectionHeadClass">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <Code2 class="w-4 h-4 text-t-primary shrink-0" />
            <h3 class="text-sm font-semibold text-t-title">编程语言模板</h3>
          </div>
          <p class="text-[11px] text-t-muted mt-1">打字机结束后的代码片段包装，prefix / suffix 为前后缀</p>
        </div>
        <span class="text-[11px] font-mono text-t-muted shrink-0">{{ templates.length }} 项</span>
      </div>

      <div class="p-4 space-y-2.5">
        <div class="hidden md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_2rem] gap-2 text-[11px] text-t-muted">
          <span>key</span>
          <span>label</span>
          <span>prefix</span>
          <span>suffix</span>
          <span />
        </div>

        <div v-if="templates.length === 0" class="py-6 text-center text-xs text-t-muted border border-dashed border-t-border">
          暂无语言模板，点击下方「添加模板」开始
        </div>

        <div
          v-for="(template, index) in templates"
          :key="index"
          class="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_2rem] md:items-center"
        >
          <input v-model="template.key" type="text" :class="inputClass" class="font-mono" placeholder="key，如 ts" />
          <input v-model="template.label" type="text" :class="inputClass" placeholder="显示名，如 TypeScript" />
          <input v-model="template.prefix" type="text" :class="inputClass" class="font-mono" placeholder="前缀，如 const x = " />
          <input v-model="template.suffix" type="text" :class="inputClass" class="font-mono" placeholder="后缀，如 ;" />
          <button
            type="button"
            :class="[deleteBtnClass, 'max-md:justify-self-end']"
            title="删除模板"
            aria-label="删除模板"
            @click="removeTemplate(index)"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>

        <button type="button" :class="addBtnClass" @click="addTemplate">
          <Plus class="w-3.5 h-3.5" />
          添加模板
        </button>
      </div>
    </section>

    <!-- 轮播图 -->
    <section :class="cardClass">
      <div :class="sectionHeadClass">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <Images class="w-4 h-4 text-t-primary shrink-0" />
            <h3 class="text-sm font-semibold text-t-title">轮播图</h3>
          </div>
          <p class="text-[11px] text-t-muted mt-1">首页 Hero 轮播图片，按顺序播放，停用的不会展示</p>
        </div>
        <span class="text-[11px] font-mono text-t-muted shrink-0">{{ enabledSlideCount }} / {{ slides.length }} 启用</span>
      </div>

      <div class="p-4 space-y-2.5">
        <div class="hidden md:grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_5rem_2rem] gap-2 text-[11px] text-t-muted">
          <span>图片地址 src</span>
          <span>替代文本 alt</span>
          <span class="text-center">启用</span>
          <span />
        </div>

        <div v-if="slides.length === 0" class="py-6 text-center text-xs text-t-muted border border-dashed border-t-border">
          暂无轮播图，点击下方「添加轮播图」开始
        </div>

        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="grid gap-2 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_5rem_2rem] md:items-center"
        >
          <input v-model="slide.src" type="text" :class="inputClass" class="font-mono" placeholder="https://oss.example.com/hero-1.jpg" />
          <input v-model="slide.alt" type="text" :class="inputClass" placeholder="图片描述" />
          <div class="flex items-center md:justify-center">
            <button
              type="button"
              role="switch"
              :aria-checked="slide.enabled !== false"
              :aria-label="slide.enabled !== false ? '停用该轮播图' : '启用该轮播图'"
              class="relative inline-flex w-8 h-4 items-center rounded-full border transition-colors duration-200 cursor-pointer"
              :class="slide.enabled !== false ? 'bg-t-primary-fill border-t-primary' : 'bg-t-elevated border-t-border hover:border-t-border-hover'"
              @click="toggleSlide(index)"
            >
              <span
                class="absolute left-0.5 w-3 h-3 rounded-full bg-t-surface border border-t-border transition-transform duration-200"
                :class="{ 'translate-x-4': slide.enabled !== false }"
              />
            </button>
          </div>
          <button
            type="button"
            :class="[deleteBtnClass, 'max-md:justify-self-end']"
            title="删除轮播图"
            aria-label="删除轮播图"
            @click="removeSlide(index)"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>

        <button type="button" :class="addBtnClass" @click="addSlide">
          <Plus class="w-3.5 h-3.5" />
          添加轮播图
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Code2, Images, Info, Plus, Trash2, Type } from 'lucide-vue-next'
import type { HeroCodeTemplate, HeroConfig, HeroSlide, HeroTypewriterConfig } from '~/types'

const model = defineModel<HeroConfig>({ required: true })

const cardClass = 'bg-t-surface border border-t-border'
const sectionHeadClass = 'flex flex-wrap items-start justify-between gap-3 px-4 py-3 border-b border-t-border'
const inputClass = 'form-control'
const deleteBtnClass = 'btn-admin btn-admin-icon btn-admin-danger-outline shrink-0'
const addBtnClass = 'btn-admin-add'

const typewriter = computed<HeroTypewriterConfig>(() => model.value.typewriter ?? {})
const phrases = computed(() => typewriter.value.phrases ?? [])
const templates = computed(() => typewriter.value.templates ?? [])
const slides = computed(() => model.value.slides ?? [])

const typewriterEnabled = computed(() => typewriter.value.enabled !== false)
const enabledSlideCount = computed(() => slides.value.filter(slide => slide.enabled !== false).length)

function ensureTypewriter(): HeroTypewriterConfig {
  if (!model.value.typewriter) model.value.typewriter = {}
  return model.value.typewriter
}

function ensurePhrases(): string[] {
  const config = ensureTypewriter()
  if (!config.phrases) config.phrases = []
  return config.phrases
}

function ensureTemplates(): HeroCodeTemplate[] {
  const config = ensureTypewriter()
  if (!config.templates) config.templates = []
  return config.templates
}

function ensureSlides(): HeroSlide[] {
  if (!model.value.slides) model.value.slides = []
  return model.value.slides
}

function toggleTypewriter(): void {
  const config = ensureTypewriter()
  config.enabled = config.enabled === false
}

function addPhrase(): void {
  ensurePhrases().push('')
}

function updatePhrase(index: number, event: Event): void {
  const list = ensurePhrases()
  if (index < 0 || index >= list.length) return
  list[index] = (event.target as HTMLInputElement).value
}

function removePhrase(index: number): void {
  ensurePhrases().splice(index, 1)
}

function addTemplate(): void {
  ensureTemplates().push({ key: '', label: '', prefix: '', suffix: '' })
}

function removeTemplate(index: number): void {
  ensureTemplates().splice(index, 1)
}

function nextSlideKey(): string {
  const used = new Set(slides.value.map(slide => slide.key))
  let index = slides.value.length + 1
  while (used.has(`slide-${index}`)) index += 1
  return `slide-${index}`
}

function addSlide(): void {
  ensureSlides().push({ key: nextSlideKey(), src: '', alt: '', enabled: true })
}

function removeSlide(index: number): void {
  ensureSlides().splice(index, 1)
}

function toggleSlide(index: number): void {
  const slide = slides.value[index]
  if (!slide) return
  slide.enabled = slide.enabled === false
}
</script>
