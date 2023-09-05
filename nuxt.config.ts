export default defineNuxtConfig({
    ssr: false,
    srcDir: 'src',
    css: ['vuetify/lib/styles/main.sass'],
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
        '@pinia/nuxt'
    ],
    devtools: {
        enabled: true
    }
})
