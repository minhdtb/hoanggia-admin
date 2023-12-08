import vuetify from 'vite-plugin-vuetify';
import { ModuleOptions, Nuxt } from '@nuxt/schema';

export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src',
  typescript: {
    strict: true,
    typeCheck: true,
  },
  css: [
    '~/assets/custom.scss',
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
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
    '@nuxtjs/google-fonts',
    (_: ModuleOptions, nuxt: Nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins?.push(
          vuetify({
            styles: { configFile: 'assets/setting.sass' },
          }),
        );
      });
    },
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
      Roboto: true,
    },
    display: 'swap',
  },
});
