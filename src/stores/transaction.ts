import { ListOptions } from '~/utils/types';
import { Driver } from '~/stores/driver';

export interface Transaction {
  id?: string;
  creator?: string;
  expand?: {
    driver?: Driver;
  };
  code?: string;
  amount?: number;
  status?: string;
  created?: string;
}

export const useTransactionStore = defineStore('transactionStore', () => {
  const pb = usePb();

  const loading = ref(false);
  const errorMessage = ref<string | undefined>(undefined);
  const isError = computed(() => errorMessage.value !== undefined);
  const listOptions = ref<ListOptions | undefined>(undefined);
  const transactionList = ref<Transaction[]>([]);
  const total = ref<number>(0);
  const current = ref<Transaction | undefined>(undefined);

  const actions = {
    async list(options?: ListOptions) {
      try {
        loading.value = true;
        transactionList.value = [];
        if (options) {
          listOptions.value = options;
        }
        const res = await pb
          .collection('transaction')
          .getList<Transaction>(listOptions.value?.page, listOptions.value?.limit, {
            expand: 'driver',
            filter: 'status != "Pending"',
            sort: '-created',
          });
        transactionList.value = res.items;
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
    async listWaiting(options?: ListOptions) {
      try {
        loading.value = true;
        transactionList.value = [];
        if (options) {
          listOptions.value = options;
        }
        const res = await pb
          .collection('transaction')
          .getList<Transaction>(listOptions.value?.page, listOptions.value?.limit, {
            expand: 'driver',
            filter: 'status = "Pending"',
            sort: '-created',
          });
        transactionList.value = res.items;
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
    async createTransaction(input: { driverId: string; amount: number }) {
      try {
        errorMessage.value = '';
        loading.value = true;
        await pb.send('/create-transaction', {
          method: 'POST',
          body: {
            driverId: input.driverId,
            amount: input.amount,
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
  };

  return {
    loading,
    isError,
    transactionList,
    total,
    listOptions,
    current,
    errorMessage,
    ...actions,
  };
});
