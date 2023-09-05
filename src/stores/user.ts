import {ListOptions} from "~/utils/types";

export interface User {
    id?: string;
    name?: string;
    phone?: string;
    user_email?: string;
    avatar?: string;
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

    const actions = {
        async list(options?: ListOptions) {
            try {
                loading.value = true;
                if (options) {
                    listOptions.value = options;
                }
                const res = await pb.collection('user').getList(
                    listOptions.value?.page,
                    listOptions.value?.limit
                )
                userList.value = res.items.map(it => {
                    if (it['avatar']) {
                        it['avatar'] = `${appConfig.backend.url}/api/files/user/${it.id}/${it['avatar']}`
                    }

                    return it;
                })
                total.value = res.totalItems
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
    }

    return {
        loading,
        isError,
        userList,
        total,
        listOptions,
        current,
        errorMessage,
        ...actions,
    };
})
