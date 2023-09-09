<template>
  <custom-form title="Thông tin lái xe" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Họ tên">
            <v-text-field v-bind="name"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Số điện thoại">
            <v-text-field v-bind="phone"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Email">
            <v-text-field v-bind="email"></v-text-field>
          </custom-form-field>
        </v-col>
        <v-col>
          <custom-form-field label="Địa chỉ">
            <v-text-field v-bind="email"></v-text-field>
          </custom-form-field>
        </v-col>
      </v-row>
    </template>
    <template #actions>
      <v-btn variant="outlined" @click="emit('onClose')">Quay lại</v-btn>
      <v-btn variant="outlined" color="blue" type="submit" :disabled="isValidating || isSubmitting">
        Chấp nhận
      </v-btn>
    </template>
  </custom-form>
</template>
<script setup lang="ts">
import * as yup from 'yup';
import { SubmitEventPromise } from 'vuetify';
import { useDriverStore } from '~/stores/driver';

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const props = defineProps<{
  id: string;
}>();

const driverStore = useDriverStore();
const { current } = storeToRefs(driverStore);

const { handleSubmit, defineComponentBinds, isValidating, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      name: yup.string().required('Hãy nhập họ tên'),
      phone: yup.string().required('Hãy nhập số điện thoại'),
      email: yup.string().email('Sai định dạng email'),
    }),
  ),
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const name = defineComponentBinds('name', validateConfig);
const phone = defineComponentBinds('phone', validateConfig);
const email = defineComponentBinds('email', validateConfig);

onMounted(async () => {
  await driverStore.getDriverById(props.id);
});

watch(
  () => driverStore.current,
  () => {
    setFieldValue('name', current.value?.name);
    setFieldValue('phone', current.value?.phone);
    setFieldValue('email', current.value?.user_email ?? undefined);
  },
);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    await driverStore.updateDriver(props.id, values);
    emit('onClose');
  })();
};
</script>
