import {ListOptions} from '~/utils/types';
import {Driver} from '~/stores/driver';
import {User} from '~/stores/user';
import moment from "moment/moment";

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
  const canceling = ref(false);
  const errorMessage = ref<string | undefined>(undefined);
  const isError = computed(() => errorMessage.value !== undefined);
  const listOptions = ref<ListOptions | undefined>(undefined);
  const bookingList = ref<Booking[]>([]);
  const bookingHistoryList = ref<Booking[]>([]);
  const total = ref<number>(0);
  const historyTotal = ref<number>(0);
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
    async listHistory(options?: ListOptions, search?: string) {
      try {
        loading.value = true;
        bookingHistoryList.value = [];
        if (options) {
          listOptions.value = options;
        }
        const res = await pb
          .collection('booking_history')
          .getList<Booking>(listOptions.value?.page, listOptions.value?.limit, {
            filter: `id ~ "${search ?? ''}" || user.name ~ "${search ?? ''}"`,
            expand: 'user,driver',
            sort: '-created',
          });
        bookingHistoryList.value = res.items;
        historyTotal.value = res.totalItems;
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
    async cancel(id: string) {
      try {
        canceling.value = true;
        if (id) {
          await pb.send('/cancel-booking', {
            method: 'POST',
            body: {
              bookingId: id,
            },
          });
          await new Promise((resolve, reject) => {
            setTimeout(async () => {
              await this.list(listOptions.value);
              resolve(null);
            }, 2000);
          });
        }
      } catch (err) {
        if (typeof err === 'string') {
          errorMessage.value = err;
        } else if (err instanceof Error) {
          errorMessage.value = err.message;
        }
      } finally {
        canceling.value = false;
      }
    },
    async manualAssignDriver(bookingId: string, driverId: string, fee: number) {
      try {
        loading.value = true;
        await pb.send('/manual-assign-driver', {
          method: 'POST',
          body: {
            bookingId,
            driverId,
            fee,
          },
        });
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
    async getBookingFee(pickupDate: string, distance: number) {
      try {
        loading.value = true;
        return await pb.send('/get-booking-fee', {
          method: 'POST',
          body: {
            pickupDate,
            distance: {
              value: distance,
            },
          },
        });
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
    async create(booking: any, directions: any[]) {
      try {
        loading.value = true;
        let pickupDate = booking.pickupDate
        const v = pickupDate.split(':')
        const hour = parseInt(v[0])
        const minute = parseInt(v[1])
        pickupDate = moment(new Date()).set('hour', hour).set('minute', minute)
          .format("YYYY-MM-DDTHH:mm:ss.SSS")
        await pb.send('/create-booking', {
          method: 'POST',
          body: {
            userId: booking.user.id,
            from: booking.from,
            tos: [booking.to],
            pickupDate: pickupDate,
            distance: {
              text: '',
              value: booking.distance * 1000,
            },
            directions: directions,
            vehicle: booking.vehicle.id,
            fee: booking.fee,
          },
        });
      } catch (err) {
        if (typeof err === 'string') {
          errorMessage.value = err;
        } else if (err instanceof Error) {
          errorMessage.value = err.message;
        }
      } finally {
        loading.value = false;
      }
    }
  };

  return {
    loading,
    canceling,
    isError,
    bookingList,
    bookingHistoryList,
    total,
    historyTotal,
    listOptions,
    current,
    errorMessage,
    updateBookingSuccess,
    ...actions,
  };
});
