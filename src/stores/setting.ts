export const useSettingStore = defineStore('settingStore', () => {
  const pb = usePb();

  const loading = ref(false);
  const items = ref([]);
  const errorMessage = ref<string | undefined>(undefined);
  const isError = computed(() => errorMessage.value !== undefined);
  const current = ref();

  const success = ref(false);

  watch(success, (value) => {
    if (value) {
      setTimeout(() => {
        success.value = false;
      }, 2000);
    }
  });

  const actions = {
    async getSetting() {
      try {
        loading.value = true;
        items.value = await pb.collection('setting').getFullList();
        let obj: any = {};
        items.value.forEach((item: any) => {
          obj[`${item.key}`] = item.value;
        });
        current.value = obj;
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
    async saveSetting(values: any) {
      try {
        loading.value = true;
        await Promise.all(
          Object.keys(values).map(async (key) => {
            const value = values[key];
            const item: any = items.value.find((item: any) => item.key === key);
            if (item) {
              await pb.collection('setting').update(item.id, {
                value,
              });
            }
          }),
        );
        success.value = true;
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
    errorMessage,
    success,
    current,
    ...actions,
  };
});
