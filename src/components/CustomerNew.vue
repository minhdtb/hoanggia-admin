<template>
  <custom-form title="Thêm khách hàng" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Số điện thoại">
            <v-text-field v-bind="phone"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Họ và tên">
            <v-text-field v-bind="name"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Mật khẩu">
            <v-text-field type="password" v-bind="password"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Nhập lại mật khẩu">
            <v-text-field type="password" v-bind="passwordConfirm"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Email">
            <v-text-field v-bind="email"></v-text-field>
          </custom-form-field>
        </v-col>
      </v-row>
    </template>
    <template #actions>
      <v-btn variant="elevated" color="blue" type="submit" :disabled="isValidating || isSubmitting"
      >Lưu
      </v-btn>
    </template>
  </custom-form>
</template>
<script setup lang="ts">
import * as yup from 'yup';
import {SubmitEventPromise} from 'vuetify';

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const userStore = useUserStore();

const {handleSubmit, defineComponentBinds, isValidating, isSubmitting, values} = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      phone: yup.string().required('Hãy nhập số điện thoại')
        .min(3, 'Tên đăng nhập quá ngắn').matches(/^[a-z0-9_-]{3,15}$/, 'Sai format'),
      password: yup.string().required('Hãy nhập mật khẩu')
        .min(8, 'Mật khẩu quá ngắn'),
      passwordConfirm: yup.string().required('Hãy nhập lại mật khẩu')
        .oneOf([yup.ref('password')], 'Mật khẩu không trùng nhau'),
      name: yup.string(),
      user_email: yup.string().email(),
    }),
  ), initialValues: {
    password: 'Aa123456@@',
    passwordConfirm: 'Aa123456@@',
  }
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const phone = defineComponentBinds('phone', validateConfig);
const password = defineComponentBinds('password', validateConfig);
const passwordConfirm = defineComponentBinds('passwordConfirm', validateConfig);
const name = defineComponentBinds('name', validateConfig);
const email = defineComponentBinds('user_email', validateConfig);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    await userStore.create(values);
    emit('onClose');
  })();
};
</script>
