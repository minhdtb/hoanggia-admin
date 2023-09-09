import { ListOptions } from '~/utils/types';

export interface Driver {
  id?: string;
  name?: string;
  phone?: string;
  address?: string;
  user_email?: string;
  avatar?: string;
  authStatus?: string;
  driveStatus?: string;
  activeStatus?: string;
  created?: string;
  lat?: number;
  lon?: number;
  balance?: number;
}

export const useDriverStore = defineStore('driverStore', () => {
  const pb = usePb();
  const appConfig = useAppConfig();

  const loading = ref(false);
  const errorMessage = ref<string | undefined>(undefined);
  const isError = computed(() => errorMessage.value !== undefined);
  const listOptions = ref<ListOptions | undefined>(undefined);
  const driverList = ref<Driver[]>([]);
  const total = ref<number>(0);
  const current = ref<Driver | undefined>(undefined);

  const actions = {
    async list(options?: ListOptions) {
      try {
        loading.value = true;
        if (options) {
          listOptions.value = options;
        }
        const res = await pb
          .collection('driver')
          .getList(listOptions.value?.page, listOptions.value?.limit, {
            filter: 'authStatus != "WaitingApproval"',
            sort: '-created',
          });
        driverList.value = res.items.map((it) => {
          if (it['avatar']) {
            it['avatar'] = `${appConfig.backend.url}/api/files/driver/${it.id}/${it['avatar']}`;
          }
          return it;
        });
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
        if (options) {
          listOptions.value = options;
        }
        const res = await pb
          .collection('driver')
          .getList(listOptions.value?.page, listOptions.value?.limit, {
            filter: 'authStatus = "WaitingApproval"',
            sort: '-created',
          });
        driverList.value = res.items.map((it) => {
          if (it['avatar']) {
            it['avatar'] = `${appConfig.backend.url}/api/files/driver/${it.id}/${it['avatar']}`;
          }
          return it;
        });
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
    async updateDriver(id: string, driver: Driver) {
      try {
        loading.value = true;
        await pb.collection('driver').update(id, driver);
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
    async getDriverById(id: string) {
      try {
        loading.value = true;
        current.value = await pb.collection('driver').getOne(id);
        if (current.value && current.value.avatar) {
          current.value.avatar = `${appConfig.backend.url}/api/files/driver/${current.value.id}/${current.value.avatar}`;
        }
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
    driverList,
    total,
    listOptions,
    current,
    errorMessage,
    ...actions,
  };
});
