import { ListOptions } from '~/utils/types';
import { User } from '~/stores/user';
import { Driver } from '~/stores/driver';

export interface History {
  id?: string;
  from?: object;
  to?: object;
  pickupDate?: string;
  bookingDate?: string;
  fee?: number;
  distance?: object;
  status?: string;
  expand?: {
    user?: User;
    driver?: Driver;
  };
  created?: string;
}

export const useHistoryStore = defineStore('historyStore', () => {
  const pb = usePb();

  const loading = ref(false);
  const errorMessage = ref<string | undefined>(undefined);
  const isError = computed(() => errorMessage.value !== undefined);
  const listOptions = ref<ListOptions | undefined>(undefined);
  const historyList = ref<History[]>([]);
  const total = ref<number>(0);
  const current = ref<History | undefined>(undefined);

  const actions = {
    async list(id: string, options?: ListOptions) {
      try {
        loading.value = true;
        historyList.value = [];
        if (options) {
          listOptions.value = options;
        }
        const res = await pb
          .collection('history')
          .getList<History>(listOptions.value?.page, listOptions.value?.limit, {
            filter: `user = "${id}" || driver = "${id}"`,
            expand: 'user,driver',
          });
        historyList.value = res.items;
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
    async getHistoryById(id: string) {
      try {
        loading.value = true;
        current.value = await pb.collection('history').getOne<History>(id, {
          expand: 'user,driver',
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
  };

  return {
    loading,
    isError,
    historyList,
    total,
    listOptions,
    current,
    errorMessage,
    ...actions,
  };
});
