// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: false,
  extends: [
    process.env.TYPOGRAPHY_THEME || '@nuxt-themes/typography'
  ],
  modules: [
    '@nuxt/content',
    '@vueuse/nuxt'
  ],
  // content: {
  //   experimental: {
  //     clientDB: true
  //   }
  // }
})
