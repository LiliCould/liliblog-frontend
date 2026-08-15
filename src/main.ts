import { createApp } from 'vue'
import '@/assets/styles/tailwind.css'
import '@/assets/styles/variables.css'
import '@/assets/styles/reset.css'
import '@/assets/styles/transitions.css'

import { vLazy } from './directives/lazy'
import { useCodeTheme } from '@/composables/useCodeTheme'

import App from './App.vue'
import router from './router'
import pinia from './stores'
import { useUserStore } from './stores/user'
import { useAppStore } from './stores/app'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.directive('lazy', vLazy)

const userStore = useUserStore()
userStore.init()

const appStore = useAppStore()
appStore.initAppData()

useCodeTheme().initCodeTheme()

app.mount('#app')
