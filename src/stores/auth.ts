export const useAuthStore = defineStore('authStore', () => {
  const pb = usePb();
  const loading = ref(false);
  const errorMessage = ref<string | undefined>(undefined);
  const isError = computed(() => errorMessage.value !== undefined);
  const authUser = computed(() => pb.authStore.model);

  const isAdmin = computed(() => pb.authStore.isAdmin);
  const isOperator = computed(() => pb.authStore.isAuthRecord &&
    pb.authStore.model?.role === 'Operator');
  const isAccountant = computed(() => pb.authStore.isAuthRecord &&
    pb.authStore.model?.role === 'Accountant');

  const actions = {
    async login(username: string, password: string) {
      loading.value = true;
      errorMessage.value = undefined;
      try {
        await pb.collection('staff').authWithPassword(username, password);
        navigateTo('/');
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
    async adminLogin(email: string, password: string) {
      loading.value = true;
      errorMessage.value = undefined;
      try {
        await pb.admins.authWithPassword(email, password);
        navigateTo('/');
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
      window.location.reload();
    },
  };

  return {
    authUser,
    loading,
    errorMessage,
    isError,
    isAdmin,
    isOperator,
    isAccountant,
    ...actions,
  };
});
