export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const userStore = useUserStore()
  userStore.init()

  if (!userStore.isLoggedIn) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  if (!userStore.isAdmin) {
    return navigateTo('/')
  }
})
