import {ListOptions} from '~/utils/types';

export type Report = {
  id?: string;
  from?: Date;
  to?: Date;
  type?: string;
  status?: string;
  link?: string;
  created?: string;
};


export const useReportStore = defineStore('reportStore', () => {
  const pb = usePb();

  const loading = ref(false);
  const errorMessage = ref<string | undefined>(undefined);
  const isError = computed(() => errorMessage.value !== undefined);
  const listOptions = ref<ListOptions | undefined>(undefined);
  const reportList = ref<Report[]>([]);

  const total = ref<number>(0);
  const current = ref<Report | undefined>(undefined);
  const createSuccess = ref(false);

  watch(createSuccess, (value) => {
    if (value) {
      setTimeout(() => {
        createSuccess.value = false;
      }, 2000);
    }
  });

  const actions = {
    async list(options?: ListOptions) {
      try {
        loading.value = true;
        reportList.value = [];
        if (options) {
          listOptions.value = options;
        }
        const res = await pb
          .collection('report')
          .getList<Report>(listOptions.value?.page, listOptions.value?.limit, {
            sort: '-created',
          });
        reportList.value = res.items;
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
    async create(input: Report) {
      try {
        errorMessage.value = '';
        loading.value = true;
        await pb.collection('report').create(input);
        createSuccess.value = true;
      } catch (err) {
        if (typeof err === 'string') {
          errorMessage.value = err;
        } else if (err instanceof Error) {
          errorMessage.value = err.message;
        }
        createSuccess.value = false;
      } finally {
        loading.value = false;
      }
    },
  };

  return {
    loading,
    isError,
    reportList,
    total,
    listOptions,
    current,
    errorMessage,
    createSuccess,
    ...actions,
  };
});
