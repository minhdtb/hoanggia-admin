export const useAuthStore = defineStore('authStore', () => {
    const pb = usePb();
    const loading = ref(false);
    const errorMessage = ref<string | undefined>(undefined);
    const isError = computed(() => errorMessage.value !== undefined);
    const authUser = computed(() => pb.authStore.model);

    const actions = {
        async login(email: string, password: string) {
            loading.value = true;
            errorMessage.value = undefined;
            try {
                await pb.admins.authWithPassword(email, password)
                navigateTo('/')
            } catch (e) {
                if (typeof e === 'string') {
                    errorMessage.value = e;
                } else if (e instanceof Error) {
                    errorMessage.value = e.message;
                }
            } finally {
                loading.value = false;
            }
        },
        logout() {
            pb.authStore.clear();
            navigateTo('/login');
        }
    }

    return {
        authUser,
        loading,
        errorMessage,
        isError,
        ...actions,
    };
})
