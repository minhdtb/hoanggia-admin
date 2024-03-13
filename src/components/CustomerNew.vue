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
          <custom-form-field label="Email">
            <v-text-field v-bind="email"></v-text-field>
          </custom-form-field>
        </v-col>
        <v-col>
          <custom-form-field :label="`Mật khẩu ( ${defaultPassword} )`">
            <v-text-field type="password" v-bind="password"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Nhập lại mật khẩu">
            <v-text-field type="password" v-bind="passwordConfirm"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Thông tin xe">
            <vehicle-list v-bind="vehicles"></vehicle-list>
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

const defaultPassword = 'LjA6y5T4'

const emit = defineEmits<{
  (eventName: 'onSubmit', value: any): void;
}>();

const props = defineProps<{
  initialPhone?: string,
}>()

const userStore = useUserStore();

const {handleSubmit, defineComponentBinds, isValidating, isSubmitting} = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      phone: yup.string().required('Hãy nhập số điện thoại')
        .min(3, 'Số điện thoại quá ngắn').matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
          'Sai định dạng số điện thoại'),
      password: yup.string().required('Hãy nhập mật khẩu')
        .min(8, 'Mật khẩu quá ngắn'),
      passwordConfirm: yup.string().required('Hãy nhập lại mật khẩu')
        .oneOf([yup.ref('password')], 'Mật khẩu không trùng nhau'),
      name: yup.string().required('Hãy nhập tên khách hàng'),
      user_email: yup.string().email(),
      vehicles: yup.array().of(yup.object().shape({
        brand: yup.string().required('Hãng xe'),
        type: yup.string().required('Loại xe')
      })).min(1, 'Khách hàng cần có ít nhất 1 xe').default([])
    }),
  ), initialValues: {
    password: defaultPassword,
    passwordConfirm: defaultPassword,
    phone: props.initialPhone,
  }
});

const validateConfig = (state: any) => {
  return {
    props: {
      'error-messages': state.errors,
    },
  }
};

const phone = defineComponentBinds('phone', validateConfig);
const password = defineComponentBinds('password', validateConfig);
const passwordConfirm = defineComponentBinds('passwordConfirm', validateConfig);
const name = defineComponentBinds('name', validateConfig);
const email = defineComponentBinds('user_email', validateConfig);
const vehicles = defineComponentBinds('vehicles', validateConfig);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    const user = await userStore.create(values);
    emit('onSubmit', user);
  })();
};
</script>
