import { ListOptions } from '~/utils/types';
import { Driver } from '~/stores/driver';
import moment from 'moment';

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
  const appConfig = useAppConfig();

  const loading = ref(false);
  const errorMessage = ref<string | undefined>(undefined);
  const isError = computed(() => errorMessage.value !== undefined);
  const listOptions = ref<ListOptions | undefined>(undefined);
  const transactionList = ref<Transaction[]>([]);
  const total = ref<number>(0);
  const current = ref<Transaction | undefined>(undefined);
  const createTransactionSuccess = ref(false);

  watch(createTransactionSuccess, (value) => {
    if (value) {
      setTimeout(() => {
        createTransactionSuccess.value = false;
      }, 2000);
    }
  });

  const actions = {
    async listDeposit(options?: ListOptions, from?: string, to?: string) {
      try {
        loading.value = true;
        transactionList.value = [];
        if (options) {
          listOptions.value = options;
        }
        let filter = 'status != "Pending" && type = "Deposit"';
        if (from) {
          filter += ` && created >= "${from}" `;
        }
        if (to) {
          filter += ` && created <= "${moment(to).add(1, 'days').format('YYYY-MM-DD')}" `;
        }
        const res = await pb
          .collection('transaction')
          .getList<Transaction>(listOptions.value?.page, listOptions.value?.limit, {
            expand: 'driver,creator',
            filter: filter,
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
    async listWithdrawal(options?: ListOptions, from?: string, to?: string) {
      try {
        loading.value = true;
        transactionList.value = [];
        if (options) {
          listOptions.value = options;
        }
        let filter = 'status != "Pending" && type="Withdrawal"';
        if (from) {
          filter += ` && created >= "${from}" `;
        }
        if (to) {
          filter += ` && created <= "${moment(to).add(1, 'days').format('YYYY-MM-DD')}" `;
        }
        const res = await pb
          .collection('transaction')
          .getList<Transaction>(listOptions.value?.page, listOptions.value?.limit, {
            expand: 'driver,creator',
            filter: filter,
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
            expand: 'driver,creator',
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
        createTransactionSuccess.value = true;
      } catch (err) {
        if (typeof err === 'string') {
          errorMessage.value = err;
        } else if (err instanceof Error) {
          errorMessage.value = err.message;
        }
        createTransactionSuccess.value = false;
      } finally {
        loading.value = false;
      }
    },
    async approve(id: string) {
      try {
        errorMessage.value = '';
        loading.value = true;
        await pb.send('/approve-transaction', {
          method: 'POST',
          body: {
            id,
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
    async reject(id: string) {
      try {
        errorMessage.value = '';
        loading.value = true;
        await pb.send('/reject-transaction', {
          method: 'POST',
          body: {
            id,
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
    async delete(id: string) {
      try {
        errorMessage.value = '';
        loading.value = true;
        await pb.collection('transaction').delete(id);
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
    async exportExcel(from: string, to: string, type: string) {
      try {
        errorMessage.value = '';
        loading.value = true;
        const data = await useFetch(`${appConfig.backend.url}/export-excel`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + pb.authStore.token,
          },
          body: {
            from,
            to,
            type,
          },
        });
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(data.data.value as Blob);
        link.download = 'export.xlsx';
        link.click();
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
    createTransactionSuccess,
    ...actions,
  };
});
