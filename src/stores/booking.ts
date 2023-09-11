import { ListOptions } from '~/utils/types';
import { Driver } from '~/stores/driver';
import { User } from '~/stores/user';

export interface Booking {
  id?: string;
  expand?: {
    user?: User;
    driver?: Driver;
    vehicle?: object;
  };
  from?: object;
  to?: object;
  pickupDate?: string;
  status?: string;
  driverPosition: object;
  direction?: object;
  distance?: object;
  fee?: number;
  created?: string;
}

export const useBookingStore = defineStore('bookingStore', () => {
  const pb = usePb();

  const loading = ref(false);
  const errorMessage = ref<string | undefined>(undefined);
  const isError = computed(() => errorMessage.value !== undefined);
  const listOptions = ref<ListOptions | undefined>(undefined);
  const bookingList = ref<Booking[]>([]);
  const total = ref<number>(0);
  const current = ref<Booking | undefined>(undefined);
  const updateBookingSuccess = ref(false);

  watch(updateBookingSuccess, (value) => {
    if (value) {
      setTimeout(() => {
        updateBookingSuccess.value = false;
      }, 2000);
    }
  });

  const actions = {
    async list(options?: ListOptions) {
      try {
        loading.value = true;
        bookingList.value = [];
        if (options) {
          listOptions.value = options;
        }
        const res = await pb
          .collection('booking')
          .getList<Booking>(listOptions.value?.page, listOptions.value?.limit, {
            expand: 'user,driver',
            sort: '-created',
          });
        bookingList.value = res.items;
        total.value = res.totalItems;
      } catch (err) {
        if (typeof err === 'string') {
          errorMessage.value = err;
        } else if (err instanceof Error) {
          errorMessage.value = err.message;
        }
      } finally {
        loading.value = false;
      }
    },
  };

  return {
    loading,
    isError,
    bookingList,
    total,
    listOptions,
    current,
    errorMessage,
    createBookingSuccess: updateBookingSuccess,
    ...actions,
  };
});
