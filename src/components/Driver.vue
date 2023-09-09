<template>
  <custom-form title="Thông tin lái xe" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Họ tên">
            <v-text-field v-bind="name" readonly></v-text-field>
          </custom-form-field>
          <custom-form-field label="Số điện thoại">
            <v-text-field v-bind="phone" readonly></v-text-field>
          </custom-form-field>
          <custom-form-field label="Email">
            <v-text-field v-bind="email" readonly></v-text-field>
          </custom-form-field>
          <custom-form-field label="Trạng thái">
            <driver-status-select v-bind="authStatus"></driver-status-select>
          </custom-form-field>
        </v-col>
        <v-col>
          <custom-form-field label="Địa chỉ">
            <v-text-field v-bind="address" readonly></v-text-field>
          </custom-form-field>
          <custom-form-field label="Ngày đăng ký">
            <div class="pa-1">{{ $moment(current?.created).format('DD/MM/YYYY HH:mm') }}</div>
          </custom-form-field>
          <custom-form-field label="Tọa độ hiện tại">
            <div class="pa-1">{{ current?.lat }} , {{ current?.lon }}</div>
          </custom-form-field>
          <custom-form-field label="Trạng thái phục vụ">
            <div class="pa-1">
              <v-chip :color="driveStatusText(current?.driveStatus ?? '')?.color"
                >{{ driveStatusText(current?.driveStatus ?? '')?.text }}
              </v-chip>
            </div>
          </custom-form-field>
          <custom-form-field label="Trạng thái hoạt động">
            <div>
              <v-chip :color="activeStatusText(current?.activeStatus ?? '')?.color"
                >{{ activeStatusText(current?.activeStatus ?? '')?.text }}
              </v-chip>
            </div>
          </custom-form-field>
          <custom-form-field label="Tài khoản">
            <div>{{ new Intl.NumberFormat('vi-VN').format(current?.balance ?? 0) }} VNĐ</div>
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
import { activeStatusText, driveStatusText } from '~/utils/helper';

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
      name: yup.string(),
      phone: yup.string(),
      email: yup.string().email('Sai định dạng email'),
      address: yup.string(),
      authStatus: yup.string(),
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
const address = defineComponentBinds('address', validateConfig);
const authStatus = defineComponentBinds('authStatus', validateConfig);

onMounted(async () => {
  await driverStore.getDriverById(props.id);
});

watch(
  () => driverStore.current,
  () => {
    setFieldValue('name', current.value?.name);
    setFieldValue('phone', current.value?.phone);
    setFieldValue('email', current.value?.user_email);
    setFieldValue('address', current.value?.address);
    setFieldValue('authStatus', current.value?.authStatus);
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
