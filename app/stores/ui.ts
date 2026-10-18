import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type AuthModalMode = 'login' | 'register'

export const useUiStore = defineStore('ui', () => {
  const authModalMode = ref<AuthModalMode | null>(null)

  const isAuthModalOpen = computed(() => authModalMode.value !== null)

  function openAuthModal(mode: AuthModalMode = 'login'): void {
    authModalMode.value = mode
  }

  function closeAuthModal(): void {
    authModalMode.value = null
  }

  return {
    authModalMode,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  }
})
