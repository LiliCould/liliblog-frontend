import { createApp } from 'vue'
import '@/assets/styles/variables.css'
import '@/assets/styles/reset.css'
import '@/assets/styles/transitions.css'
import '@/assets/styles/performance.css'
import '@/assets/styles/element-override.css'
import '@/assets/styles/markdown.css'
import 'virtual:uno.css'

// 注册全局指令
import { vLazy } from './directives/lazy'

import App from './App.vue'
import router from './router'
import pinia from './stores'
import { useUserStore } from './stores/user'
import { useAppStore } from './stores/app'

const app = createApp(App)

app.use(pinia)
app.use(router)

// 注册懒加载指令
app.directive('lazy', vLazy)

const userStore = useUserStore()
userStore.init()

const appStore = useAppStore()
appStore.initAppData()

app.mount('#app')
