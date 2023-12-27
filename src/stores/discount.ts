import { ListOptions } from '~/utils/types';
import { User } from '~/stores/user';

export type Discount = {
  id?: string;
  expand?: {
    user?: User;
  };
  validStart?: Date;
  validEnd?: Date;
  count?: number;
  title?: string;
  content?: string;
  discount?: number;
  discountType?: string;
  userType?: string;
  type?: string;
  status?: string;
  created?: string;
};

export type DiscountUsage = {
  id?: string;
  expand?: {
    user?: User;
  };
};

export const useDiscountStore = defineStore('discountStore', () => {
  const pb = usePb();
  const appConfig = useAppConfig();

  const loading = ref(false);
  const errorMessage = ref<string | undefined>(undefined);
  const isError = computed(() => errorMessage.value !== undefined);
  const listOptions = ref<ListOptions | undefined>(undefined);
  const discountList = ref<Discount[]>([]);
  const discountUsedList = ref<DiscountUsage[]>([]);

  const total = ref<number>(0);
  const current = ref<Discount | undefined>(undefined);
  const createSuccess = ref(false);
  const updateSuccess = ref(false);

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
        discountList.value = [];
        if (options) {
          listOptions.value = options;
        }
        const res = await pb
          .collection('discount')
          .getList<Discount>(listOptions.value?.page, listOptions.value?.limit, {
            filter: 'type = "Fixed"',
            expand: 'user',
            sort: '-created',
          });
        discountList.value = res.items;
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
    async listUsed(options?: ListOptions) {
      try {
        loading.value = true;
        discountUsedList.value = [];
        if (options) {
          listOptions.value = options;
        }
        const res = await pb
          .collection('discount_usage')
          .getList<DiscountUsage>(listOptions.value?.page, listOptions.value?.limit, {
            expand: 'user,discount,booking',
            sort: '-created',
          });
        discountUsedList.value = res.items;
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
    async getDiscountById(id: string) {
      try {
        loading.value = true;
        current.value = await pb.collection('discount').getOne<User>(id);
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
    async updateDiscount(id: string, discount: Discount) {
      try {
        loading.value = true;
        await pb.collection('discount').update(id, discount);
        updateSuccess.value = true;
      } catch (err) {
        updateSuccess.value = false;
        if (typeof err === 'string') {
          errorMessage.value = err;
        } else if (err instanceof Error) {
          errorMessage.value = err.message;
        }
      } finally {
        loading.value = false;
      }
    },
    async create(input: Discount) {
      try {
        errorMessage.value = '';
        loading.value = true;
        await pb.collection('discount').create(input);
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
    discountList,
    discountUsedList,
    total,
    listOptions,
    current,
    errorMessage,
    createSuccess,
    updateSuccess,
    ...actions,
  };
});
