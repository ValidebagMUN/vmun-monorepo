// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@sidebase/nuxt-auth', '@nuxt/ui'],
  devtools: { enabled: true },
  auth: {
    globalAppMiddleware: true
  },
  ui: {
    global: true
  },
  runtimeConfig: {
    publicRoutes: process.env.PUBLIC_ROUTES?.split(',') || []
  }
})
