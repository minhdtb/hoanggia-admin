import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VDataTable, VDataTableServer } from 'vuetify/labs/VDataTable';
import { VDatePicker } from 'vuetify/labs/VDatePicker';
import { vi } from 'vuetify/locale';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false,
    components: {
      ...components,
      VDataTable,
      VDataTableServer,
      VDatePicker,
    },
    locale: {
      locale: 'vi',
      messages: { vi },
    },
    directives,
    theme: {
      defaultTheme: 'light',
    },
  });
  nuxtApp.vueApp.use(vuetify);
});
