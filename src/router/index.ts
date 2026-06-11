import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes'
import { getToken } from '@/utils/storage'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/composables/useToast'

NProgress.configure({ showSpinner: false })

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) return savedPosition
        return { top: 0 }
    },
})

router.beforeEach(async (to, _from, next) => {
    NProgress.start()
    const token = getToken()

    document.title = `${to.meta.title || '立里博客'} - 立里博客`

    if (to.meta.requiresAuth && !token) {
        next({ path: '/login', query: { redirect: to.fullPath } })
        return
    }

    if (to.meta.requiresAdmin) {
        const userStore = useUserStore()
        if (!userStore.isAdmin) {
            next({ path: '/', query: { admin_denied: '1' } })
            return
        }
    }

    if ((to.name === 'Login' || to.name === 'Register') && token) {
        next('/')
        return
    }

    next()
})

router.afterEach((to) => {
    NProgress.done()
    if (to.query.admin_denied === '1') {
        useToast().warning('仅管理员可访问后台')
        router.replace({ query: { ...to.query, admin_denied: undefined } })
    }
})

export default router
