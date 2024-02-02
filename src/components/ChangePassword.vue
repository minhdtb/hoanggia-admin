<template>
  <custom-form title="Đổi mật khẩu" @submit="onSubmit">
    <template #content>
      <custom-form-field label="Mật khẩu hiện tại">
        <v-text-field v-bind="currentPassword" type="password"/>
      </custom-form-field>
      <custom-form-field label="Mật khẩu mới">
        <v-text-field v-bind="password" type="password"/>
      </custom-form-field>
      <custom-form-field label="Nhập lại mật khẩu mới">
        <v-text-field v-bind="confirmPassword" type="password"/>
      </custom-form-field>
    </template>
    <template #actions>
      <v-btn variant="elevated" @click="emit('onClose')">Quay lại</v-btn>
      <v-btn variant="elevated" color="blue" type="submit" :disabled="isValidating || isSubmitting">
        Chấp nhận
      </v-btn>
    </template>
  </custom-form>
  <v-snackbar v-model="error">
    {{ errorMessage }}
    <template v-slot:actions>
      <v-btn color="pink" variant="text" @click="error = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>
<script setup lang="ts">
const authStore = useAuthStore();
import {SubmitEventPromise} from 'vuetify';
import * as yup from 'yup';

const pb = usePb()

const error = ref(false);
const errorMessage = ref('');

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const {handleSubmit, defineComponentBinds, isValidating, isSubmitting, setFieldValue} = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      currentPassword: yup.string().required('Hãy nhập mật khẩu hiện tại'),
      password: yup.string().required('Hãy nhập mật khẩu mới'),
      confirmPassword: yup.string().required('Hãy nhập lại mật khẩu mới')
        .oneOf([yup.ref('password')], 'Mật khẩu không trùng nhau'),
    }),
  ),
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const currentPassword = defineComponentBinds('currentPassword', validateConfig);
const password = defineComponentBinds('password', validateConfig);
const confirmPassword = defineComponentBinds('confirmPassword', validateConfig);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    try {
      await pb.send('/auth-change-password', {
        method: 'POST',
        body: {
          table: 'staff',
          oldPassword: values.currentPassword,
          newPassword: values.password,
        },
      });
      authStore.logout();
    } catch (e: any) {
      error.value = true;
      errorMessage.value = e.toString();
    }
  })();
}
</script>
