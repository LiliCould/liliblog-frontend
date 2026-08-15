import hljs from 'highlight.js/lib/common'

export function highlightCodeBlocks(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('pre code').forEach((el) => {
    if (el.classList.contains('hljs')) return
    hljs.highlightElement(el)
  })
}
