import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/article/:id',
      name: 'ArticleDetail',
      component: () => import('@/views/ArticleDetailView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/category/:slug',
      name: 'Category',
      component: () => import('@/views/CategoryView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/tag/:slug',
      name: 'Tag',
      component: () => import('@/views/TagView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/AboutView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { layout: 'none' },
    },
    {
      path: '/user/me',
      name: 'MyHome',
      component: () => import('@/views/UserHomeView.vue'),
      meta: { layout: 'main', requiresAuth: true },
    },
    {
      path: '/user/:id',
      name: 'UserHome',
      component: () => import('@/views/UserHomeView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { layout: 'main', requiresAuth: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { layout: 'none', requiresAdmin: true },
    },
    {
      path: '/write',
      name: 'Write',
      component: () => import('@/views/WriteView.vue'),
      meta: { layout: 'none', requiresAdmin: true },
    },
    {
      path: '/write/:id',
      name: 'EditArticle',
      component: () => import('@/views/WriteView.vue'),
      meta: { layout: 'none', requiresAdmin: true },
    },
    {
      path: '/admin',
      name: 'AdminDashboard',
      component: () => import('@/views/admin/DashboardView.vue'),
      meta: { layout: 'admin', requiresAdmin: true },
    },
    {
      path: '/admin/articles',
      name: 'AdminArticles',
      component: () => import('@/views/admin/ArticleManage.vue'),
      meta: { layout: 'admin', requiresAdmin: true },
    },
    {
      path: '/admin/categories',
      name: 'AdminCategories',
      component: () => import('@/views/admin/CategoryManage.vue'),
      meta: { layout: 'admin', requiresAdmin: true },
    },
    {
      path: '/admin/tags',
      name: 'AdminTags',
      component: () => import('@/views/admin/TagManage.vue'),
      meta: { layout: 'admin', requiresAdmin: true },
    },
    {
      path: '/admin/comments',
      name: 'AdminComments',
      component: () => import('@/views/admin/CommentManage.vue'),
      meta: { layout: 'admin', requiresAdmin: true },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
    return
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/')
    return
  }

  next()
})

export default router
