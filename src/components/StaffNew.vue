<template>
  <custom-form title="Thêm nhân viên" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Tên đăng nhập">
            <v-text-field v-bind="username"></v-text-field>
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
          <custom-form-field label="Họ và tên">
            <v-text-field v-bind="fullName"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Phân quyền">
            <staff-role-select v-bind="role"></staff-role-select>
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
import {useStaffStore} from '~/stores/staff';

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const staffStore = useStaffStore();

const {handleSubmit, defineComponentBinds, isValidating, isSubmitting, values} = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      username: yup.string().required('Hãy nhập tên đăng nhập')
        .min(3, 'Tên đăng nhập quá ngắn').matches(/^[a-z0-9_-]{3,15}$/, 'Sai format'),
      password: yup.string().required('Hãy nhập mật khẩu')
        .min(8, 'Mật khẩu quá ngắn'),
      passwordConfirm: yup.string().required('Hãy nhập lại mật khẩu')
        .oneOf([yup.ref('password')], 'Mật khẩu không trùng nhau'),
      role: yup.string().required('Hãy chọn phân quyền'),
      fullName: yup.string(),
      user_email: yup.string().email(),
    }),
  )
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const username = defineComponentBinds('username', validateConfig);
const password = defineComponentBinds('password', validateConfig);
const passwordConfirm = defineComponentBinds('passwordConfirm', validateConfig);
const role = defineComponentBinds('role', validateConfig);
const fullName = defineComponentBinds('fullName', validateConfig);
const email = defineComponentBinds('user_email', validateConfig);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    await staffStore.create(values);
    emit('onClose');
  })();
};
</script>
