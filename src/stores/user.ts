import {ListOptions} from '~/utils/types';

export interface User {
  id?: string;
  username?: string;
  name?: string;
  phone?: string;
  user_email?: string;
  address?: string;
  avatar?: string;
  created?: string;
}

export const useUserStore = defineStore('userStore', () => {
  const pb = usePb();
  const appConfig = useAppConfig();

  const loading = ref(false);
  const errorMessage = ref<string | undefined>(undefined);
  const isError = computed(() => errorMessage.value !== undefined);
  const listOptions = ref<ListOptions | undefined>(undefined);
  const userList = ref<User[]>([]);
  const total = ref<number>(0);
  const current = ref<User | undefined>(undefined);
  const createSuccess = ref(false);

  const actions = {
    async list(options?: ListOptions, search?: string) {
      try {
        loading.value = true;
        userList.value = [];
        if (options) {
          listOptions.value = options;
        }
        const res = await pb
          .collection('user')
          .getList<User>(listOptions.value?.page, listOptions.value?.limit, {
            filter: search,
            sort: '-created',
          });
        userList.value = res.items.map((it) => {
          if (it.avatar) {
            it.avatar = `${appConfig.backend.url}/api/files/user/${it.id}/${it.avatar}`;
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
    async listAll(search?: string) {
      try {
        loading.value = true;
        userList.value = [];
        const res = await pb
          .collection('user')
          .getFullList<User>({
            filter: search,
            sort: '-created',
          });
        userList.value = res.map((it) => {
          if (it.avatar) {
            it.avatar = `${appConfig.backend.url}/api/files/user/${it.id}/${it.avatar}`;
          }
          return it;
        });
        total.value = res.length;
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
    async getUserById(id: string) {
      try {
        loading.value = true;
        const res = await pb.collection('user').getOne<User>(id);
        if (res && res.avatar) {
          res.avatar = `${appConfig.backend.url}/api/files/user/${res.id}/${res.avatar}`;
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
    async create(input: any) {
      try {
        errorMessage.value = '';
        loading.value = true;
        input.username = `user_${input.phone}`
        const {vehicles, ...rest} = input;
        const user = await pb.collection('user').create(rest);
        for (const vehicle of vehicles) {
          await pb.collection('vehicle').create({
            user: user.id,
            brand: vehicle.brand,
            name: vehicle.name,
            type: vehicle.type,
          })
        }
        createSuccess.value = true;
        return user;
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
    userList,
    total,
    listOptions,
    current,
    errorMessage,
    createSuccess,
    ...actions,
  };
});
