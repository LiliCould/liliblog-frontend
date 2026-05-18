import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        title?: string
        requiresAuth?: boolean
        requiresAdmin?: boolean
        layout?: 'blank' | 'default' | 'admin'
    }
}

export { }
