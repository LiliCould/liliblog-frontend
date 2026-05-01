import { createApp } from 'vue'
import '@/assets/styles/variables.css'
import '@/assets/styles/reset.css'
import '@/assets/styles/element-override.css'
import '@/assets/styles/markdown.css'
import '@/assets/styles/transitions.css'
import 'virtual:uno.css'

import App from './App.vue'
import router from './router'
import pinia from './stores'
import { useUserStore } from './stores/user'
import { useAppStore } from './stores/app'

const app = createApp(App)

app.use(pinia)
app.use(router)

const userStore = useUserStore()
userStore.init()

const appStore = useAppStore()
appStore.initAppData()

app.mount('#app')
