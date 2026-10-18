import { computed } from 'vue'
import { useUiStore, type AuthModalMode } from '~/stores/ui'

export function useAuthModal() {
  const ui = useUiStore()

  function open(mode: AuthModalMode = 'login'): void {
    ui.openAuthModal(mode)
  }

  function close(): void {
    ui.closeAuthModal()
  }

  return {
    open,
    close,
    mode: computed(() => ui.authModalMode),
    isOpen: computed(() => ui.isAuthModalOpen),
  }
}
