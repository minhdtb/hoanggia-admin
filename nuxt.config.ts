export default defineNuxtConfig({
    ssr: false,
    srcDir: 'src',
    typescript: {
        strict: true,
        typeCheck: true,
    },
    devtools: {
        enabled: true
    }
})
