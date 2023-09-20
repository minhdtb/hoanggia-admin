<template>
  <custom-form title="Cài đặt" @submit="onSubmit" :loading="loading">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Tên ngân hàng">
            <v-text-field v-bind="bankName"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Tên tài khoản">
            <v-text-field v-bind="bankAccountName"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Số tài khoản">
            <v-text-field v-bind="bankAccountNumber"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Số điện thoại liên hệ">
            <v-text-field v-bind="contactPhone"></v-text-field>
          </custom-form-field>
        </v-col>
        <v-col></v-col>
      </v-row>
    </template>
    <template #actions>
      <v-btn variant="elevated" color="blue" type="submit" :disabled="isValidating || isSubmitting">
        Lưu
      </v-btn>
    </template>
  </custom-form>
  <v-snackbar v-model="success" color="green" multi-line>
    <v-icon icon="mdi-check-circle-outline"></v-icon>
    Cập nhật thành công
  </v-snackbar>
</template>
<script lang="ts" setup>
import * as yup from 'yup';
import { SubmitEventPromise } from 'vuetify';

useHead({
  title: `Hoang Gia Driver - Cài đặt`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const settingStore = useSettingStore();
const { current, loading, success } = storeToRefs(settingStore);

const { handleSubmit, defineComponentBinds, isValidating, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      bankName: yup.string().required('Hãy nhập ngân hàng'),
      bankAccountName: yup.string().required('Hãy nhập tên tài khoản'),
      bankAccountNumber: yup.string().required('Hãy nhập số tài khoản'),
      contactPhone: yup.string().required('Hãy nhập số điện thoại liên hệ'),
    }),
  ),
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const bankName = defineComponentBinds('bankName', validateConfig);
const bankAccountName = defineComponentBinds('bankAccountName', validateConfig);
const bankAccountNumber = defineComponentBinds('bankAccountNumber', validateConfig);
const contactPhone = defineComponentBinds('contactPhone', validateConfig);

onMounted(async () => {
  await settingStore.getSetting();
});

watch(
  () => settingStore.current,
  () => {
    setFieldValue('bankName', current.value?.bankName);
    setFieldValue('bankAccountName', current.value?.bankAccountName);
    setFieldValue('bankAccountNumber', current.value?.bankAccountNumber);
    setFieldValue('contactPhone', current.value?.contactPhone);
  },
);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    await settingStore.saveSetting(values);
  })();
};
</script>
