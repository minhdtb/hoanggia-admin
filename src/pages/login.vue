<template>
  <v-container class="fill-height">
    <v-row class="d-flex flex-row justify-center">
      <v-col cols="md-4">
        <v-card class="pa-4">
          <v-form @submit="onSubmit">
            <v-card-title class="text-center font-weight-bold text-uppercase"
              >Lái xe hoàng gia
            </v-card-title>
            <v-card-item>
              <v-text-field label="Email" type="text" v-bind="email"></v-text-field>
            </v-card-item>
            <v-card-item>
              <v-text-field label="Mật khẩu" type="password" v-bind="password"></v-text-field>
            </v-card-item>
            <v-card-actions>
              <v-btn
                class="w-100"
                color="info"
                variant="elevated"
                type="submit"
                :disabled="isValidating || isSubmitting"
                >Đăng nhập
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <v-overlay persistent contained class="align-center justify-center" v-model="loading">
      <v-progress-circular indeterminate size="32" width="2"></v-progress-circular>
    </v-overlay>
    <v-snackbar v-model="showSnackbar">
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="showSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script setup lang="ts">
import { SubmitEventPromise } from 'vuetify';
import * as yup from 'yup';

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
    'error-messages': state.errors,
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
