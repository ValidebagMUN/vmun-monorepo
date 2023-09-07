// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@sidebase/nuxt-auth'],
  devtools: { enabled: true },
  auth: {
    globalAppMiddleware: true
  },
  runtimeConfig: {
    publicRoutes: process.env.PUBLIC_ROUTES?.split(',') || []
  }
})
