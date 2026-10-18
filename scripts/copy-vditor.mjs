import { cpSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const source = resolve('node_modules/vditor/dist')
const target = resolve('public/vditor/dist')

if (!existsSync(source)) {
  console.warn('[vditor] node_modules/vditor/dist not found, skip copy')
  process.exit(0)
}

cpSync(source, target, { recursive: true })
console.log('[vditor] copied to public/vditor/dist')
