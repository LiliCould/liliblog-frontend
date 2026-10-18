export type AuthMode = 'login' | 'register'

/**
 * 阶段 1 先用路由承接登录/注册入口；
 * 阶段 3 会替换为 Reka UI Dialog，并保持该调用签名不变。
 */
export function useAuthModal() {
  function open(mode: AuthMode = 'login'): void {
    navigateTo(mode === 'login' ? '/login' : '/register')
  }

  function close(): void {
    // 预留
  }

  return { open, close }
}
