export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src',
  typescript: {
    strict: true,
    typeCheck: true,
  },
  css: ['~/assets/settings.scss'],
  components: ['~/components', '~/components/commons'],
  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },
  imports: {
    dirs: ['stores/**'],
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@vee-validate/nuxt',
    '@pinia/nuxt',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Inter: true,
          'Open+Sans': true,
        },
      },
    ],
  ],
  sourcemap: {
    server: false,
    client: false,
  },
  devtools: {
    enabled: true,
  },
  googleFonts: {
    preconnect: true,
    families: {
      'Open Sans': true,
      Roboto: true,
    },
    display: 'swap',
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
