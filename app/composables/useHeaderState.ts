/** Header 与页面内固定元素共享的可见状态 */
export function useHeaderState() {
  const headerHidden = useState<boolean>('liliblog-header-hidden', () => false)
  return { headerHidden }
}
