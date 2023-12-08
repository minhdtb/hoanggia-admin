<template>
  <div class="flex w-1/4 flex-col gap-8 p-8 rounded-lg shadow bg-white">
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl uppercase font-bold w-full flex justify-center items-center">
        Lái xe hoàng gia
      </h1>
      <text-field title="Email" placeholder="Email" v-bind="email" />
      <text-field title="Mật khẩu" type="password" placeholder="Mật kẩu" v-bind="password" />
    </div>
    <my-button>Đăng nhập</my-button>
  </div>
</template>
<script setup lang="ts">
import { SubmitEventPromise } from 'vuetify';
import * as yup from 'yup';
import MyButton from '~/components/commons/MyButton.vue';

useHead({
  title: `Hoang Gia Driver - Đăng nhập`,
});

definePageMeta({
  layout: 'public',
});

const authStore = useAuthStore();
const { isError, errorMessage, loading } = storeToRefs(authStore);
const showSnackbar = ref(false);

const { handleSubmit, defineComponentBinds, isValidating, isSubmitting } = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      email: yup.string().required('Hãy nhập email'),
      password: yup.string().required('Hãy nhập mật khẩu'),
    }),
  ),
});

const validateConfig = (state: any) => ({
  props: {
    errors: state.errors,
  },
});

const email = defineComponentBinds('email', validateConfig);
const password = defineComponentBinds('password', validateConfig);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit((values) => {
    authStore.login(values.email, values.password);
  })();
};

watch(
  () => authStore.isError,
  () => {
    showSnackbar.value = isError.value;
  },
);
</script>
