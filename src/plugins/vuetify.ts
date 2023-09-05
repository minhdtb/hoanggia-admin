import {createVuetify} from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import {VDataTable, VDataTableServer} from 'vuetify/labs/VDataTable';

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        ssr: false,
        components: {
            ...components,
            VDataTable,
            VDataTableServer,
        },
        directives,
        theme: {
            defaultTheme: 'light',
        },
    });
    nuxtApp.vueApp.use(vuetify);
});
