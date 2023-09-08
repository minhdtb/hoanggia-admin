import { Moment } from 'moment/moment';

declare module '#app' {
  interface NuxtApp {
    $moment: Moment;
  }
}

declare module 'vue' {
  import { Moment } from 'moment';

  interface ComponentCustomProperties {
    $moment: Moment;
  }
}
