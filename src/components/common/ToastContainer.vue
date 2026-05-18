<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="item in toasts"
          :key="item.id"
          class="toast-item"
          :class="[`toast-${item.type}`, { 'toast-leaving': item.leaving }]"
          role="alert"
          :aria-live="item.type === 'error' ? 'assertive' : 'polite'"
        >
          <div class="toast-icon">
            <svg v-if="item.type === 'success'" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5" />
              <path d="M6.5 10.5L9 13L13.5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else-if="item.type === 'error'" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5" />
              <path d="M7.5 7.5L12.5 12.5M12.5 7.5L7.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <svg v-else-if="item.type === 'warning'" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3L18.5 17H1.5L10 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              <path d="M10 8.5V11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <circle cx="10" cy="14" r="0.75" fill="currentColor" />
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5" />
              <path d="M10 7V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <circle cx="10" cy="13.5" r="0.75" fill="currentColor" />
            </svg>
          </div>
          <span class="toast-message">{{ item.message }}</span>
          <button class="toast-close" @click="dismiss(item.id)" aria-label="关闭">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  width: max-content;
  max-width: 90vw;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  pointer-events: auto;
  min-width: 280px;
  max-width: 480px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
  font-size: 14px;
  line-height: 1.5;
}

.toast-success {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: #4ade80;
}

.toast-error {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #f87171;
}

.toast-warning {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: #fbbf24;
}

.toast-info {
  background: rgba(0, 240, 255, 0.08);
  border: 1px solid rgba(0, 240, 255, 0.15);
  color: #67e8f9;
}

.toast-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.toast-message {
  flex: 1;
  word-break: break-word;
}

.toast-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: inherit;
  opacity: 0.5;
  cursor: pointer;
  border-radius: 4px;
  transition: opacity 0.15s, background 0.15s;
  padding: 0;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.08);
}

.toast-enter-active {
  transition: opacity 300ms ease, transform 300ms ease;
}

.toast-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.96);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

@media (max-width: 640px) {
  .toast-container {
    top: 72px;
    max-width: calc(100vw - 32px);
  }

  .toast-item {
    min-width: unset;
    max-width: 100%;
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
