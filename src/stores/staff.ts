import {ListOptions} from '~/utils/types';

export type Staff = {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
  avatar?: string;
  created?: string;
};


export const useStaffStore = defineStore('staffStore', () => {
  const pb = usePb();

  const loading = ref(false);
  const errorMessage = ref<string | undefined>(undefined);
  const isError = computed(() => errorMessage.value !== undefined);
  const listOptions = ref<ListOptions | undefined>(undefined);
  const staffList = ref<Staff[]>([]);

  const total = ref<number>(0);
  const current = ref<Staff | undefined>(undefined);
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
        staffList.value = [];
        if (options) {
          listOptions.value = options;
        }
        const res = await pb
          .collection('staff')
          .getList<Staff>(listOptions.value?.page, listOptions.value?.limit, {
            sort: '-created',
          });
        staffList.value = res.items;
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
    async create(input: Staff) {
      try {
        errorMessage.value = '';
        loading.value = true;
        await pb.collection('staff').create(input);
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
    async delete(id: string) {
      try {
        errorMessage.value = '';
        loading.value = true;
        await pb.collection('staff').delete(id);
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
    staffList,
    total,
    listOptions,
    current,
    errorMessage,
    createSuccess,
    ...actions,
  };
});
