import vuetify from "vite-plugin-vuetify";
import {ModuleOptions, Nuxt} from '@nuxt/schema';

export default defineNuxtConfig({
    ssr: false,
    srcDir: 'src',
    css: [
        'vuetify/lib/styles/main.sass'
    ],
    typescript: {
        strict: true,
        typeCheck: true,
    },
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
                        styles: {configFile: 'assets/setting.sass'},
                    }),
                );
            });
        },
    ],
    sourcemap: {
        server: false,
        client: false
    },
    devtools: {
        enabled: true
    },
    googleFonts: {
        preconnect: true,
        families: {
            'Open Sans': true,
            Roboto: true,
        },
        display: 'swap'
    }
})
