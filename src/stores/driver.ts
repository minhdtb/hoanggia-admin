import { ListOptions } from '~/utils/types';

export interface Driver {
  id?: string;
  name?: string;
  phone?: string;
  address?: string;
  user_email?: string;
  avatar?: string;
  nidFront?: string;
  nidBack?: string;
  driverLicenseFront?: string;
  driverLicenseBack?: string;
  judicialRecord?: string;
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
  const success = ref(false);

  watch(success, (value) => {
    if (value) {
      setTimeout(() => {
        success.value = false;
      }, 2000);
    }
  });

  const actions = {
    async list(options?: ListOptions, search?: string) {
      try {
        loading.value = true;
        driverList.value = [];
        if (options) {
          listOptions.value = options;
        }
        const res = await pb
          .collection('driver')
          .getList<Driver>(listOptions.value?.page, listOptions.value?.limit, {
            filter: `authStatus != "WaitingApproval" && (name ~ "${search ?? ''}" || phone ~ "${
              search ?? ''
            }")`,
            sort: '-created',
          });
        driverList.value = res.items.map((it) => {
          if (it.avatar) {
            it.avatar = `${appConfig.backend.url}/api/files/driver/${it.id}/${it.avatar}`;
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
        driverList.value = [];
        if (options) {
          listOptions.value = options;
        }
        const res = await pb
          .collection('driver')
          .getList<Driver>(listOptions.value?.page, listOptions.value?.limit, {
            filter: 'authStatus = "WaitingApproval"',
            sort: '-created',
          });
        driverList.value = res.items.map((it) => {
          if (it.avatar) {
            it.avatar = `${appConfig.backend.url}/api/files/driver/${it.id}/${it.avatar}`;
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
        success.value = true;
      } catch (err) {
        success.value = false;
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
        const res = await pb.collection('driver').getOne<Driver>(id);
        if (res) {
          if (res.avatar) {
            res.avatar = `${appConfig.backend.url}/api/files/driver/${res.id}/${res.avatar}`;
          }
          if (res.nidFront) {
            res.nidFront = `${appConfig.backend.url}/api/files/driver/${res.id}/${res.nidFront}`;
          }
          if (res.nidBack) {
            res.nidBack = `${appConfig.backend.url}/api/files/driver/${res.id}/${res.nidBack}`;
          }
          if (res.driverLicenseFront) {
            res.driverLicenseFront = `${appConfig.backend.url}/api/files/driver/${res.id}/${res.driverLicenseFront}`;
          }
          if (res.driverLicenseBack) {
            res.driverLicenseBack = `${appConfig.backend.url}/api/files/driver/${res.id}/${res.driverLicenseBack}`;
          }
          if (res.judicialRecord) {
            res.judicialRecord = `${appConfig.backend.url}/api/files/driver/${res.id}/${res.judicialRecord}`;
          }
        }
        current.value = res;
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
    success,
    errorMessage,
    ...actions,
  };
});
