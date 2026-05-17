import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/global.css'

/**
 * 应用入口文件
 * 创建 Vue 应用实例并挂载全局插件
 */
const app = createApp(App)

// 注册 Pinia 状态管理
app.use(createPinia())

// 注册 Vue Router
app.use(router)

// 挂载应用
app.mount('#app')
