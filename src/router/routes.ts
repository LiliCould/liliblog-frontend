import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/home/HomeView.vue'),
        meta: { title: '首页' },
    },
    {
        path: '/article/:id(\\d+)',
        name: 'ArticleDetail',
        component: () => import('@/views/article/ArticleDetail.vue'),
        meta: { title: '文章详情' },
    },
    {
        path: '/category/:slug',
        name: 'CategoryArticles',
        component: () => import('@/views/category/CategoryArticles.vue'),
        meta: { title: '分类文章' },
    },
    {
        path: '/tag/:slug',
        name: 'TagArticles',
        component: () => import('@/views/tag/TagArticles.vue'),
        meta: { title: '标签文章' },
    },
    {
        path: '/user/me',
        name: 'UserMe',
        component: () => import('@/views/user/UserProfile.vue'),
        meta: { title: '我的首页', requiresAuth: true },
    },
    {
        path: '/user/:id(\\d+)',
        name: 'UserProfile',
        component: () => import('@/views/user/UserProfile.vue'),
        meta: { title: '用户首页' },
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { title: '登录', layout: 'blank' },
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/auth/RegisterView.vue'),
        meta: { title: '注册', layout: 'blank' },
    },
    {
        path: '/profile/edit',
        name: 'ProfileEdit',
        component: () => import('@/views/user/ProfileEdit.vue'),
        meta: { title: '编辑资料', requiresAuth: true },
    },
    {
        path: '/write',
        name: 'Write',
        component: () => import('@/views/manage/ArticleEditor.vue'),
        meta: { title: '写文章', requiresAuth: true, layout: 'blank' },
    },
    {
        path: '/write/:id(\\d+)',
        name: 'WriteEdit',
        component: () => import('@/views/manage/ArticleEditor.vue'),
        meta: { title: '编辑文章', requiresAuth: true, layout: 'blank' },
    },
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '后台管理', requiresAuth: true, requiresAdmin: true, layout: 'admin' },
    },
    {
        path: '/admin/articles',
        name: 'AdminArticles',
        component: () => import('@/views/admin/Articles.vue'),
        meta: { title: '文章管理', requiresAuth: true, requiresAdmin: true, layout: 'admin' },
    },
    {
        path: '/admin/categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/Categories.vue'),
        meta: { title: '分类管理', requiresAuth: true, requiresAdmin: true, layout: 'admin' },
    },
    {
        path: '/admin/tags',
        name: 'AdminTags',
        component: () => import('@/views/admin/Tags.vue'),
        meta: { title: '标签管理', requiresAuth: true, requiresAdmin: true, layout: 'admin' },
    },
    {
        path: '/admin/comments',
        name: 'AdminComments',
        component: () => import('@/views/admin/Comments.vue'),
        meta: { title: '评论管理', requiresAuth: true, requiresAdmin: true, layout: 'admin' },
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('@/views/about/AboutView.vue'),
        meta: { title: '关于我' },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/home/HomeView.vue'),
        meta: { title: '页面不存在' },
    },
]

export default routes
