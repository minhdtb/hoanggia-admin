export const useAuthStore = defineStore('authStore', () => {
    const pb = usePb();
    const authUser = ref(undefined)
    const loading = ref(false);

    const actions = {
        async login(email: string, password: string) {
            loading.value = true;

            try {
                await pb.admins.authWithPassword(email, password)
            } catch (e) {

            } finally {
                loading.value = false;
            }
        }
    }

    return {
        authUser,
        loading,
        ...actions,
    };
})
