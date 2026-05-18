import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes'
import { getToken } from '@/utils/storage'
import { useUserStore } from '@/stores/user'

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
            next('/')
            return
        }
    }

    if ((to.name === 'Login' || to.name === 'Register') && token) {
        next('/')
        return
    }

    next()
})

router.afterEach(() => {
    NProgress.done()
})

export default router
